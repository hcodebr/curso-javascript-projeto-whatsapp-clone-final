const functions = require('firebase-functions');
const admin = require('firebase-admin');

const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

let encode64 = function (input) {
    input = escape(input);
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}

let decode64 = function (input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    var base64test = /[^A-Za-z0-9+=]/g;
    if (base64test.exec(input)) {
        console.error("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9+=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
}

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.saveLastMessage = functions.firestore.document('chats/{chatId}/messages/{messageId}').onCreate((change, context) => {

    const chatId = context.params.chatId;
    const messageId = context.params.messageId;

    console.log('[EXEC]:', 'saveLastMessage');

    return new Promise((resolve, reject) => {

        let chatRef = db.collection('chats').doc(chatId);

        chatRef.onSnapshot(snapChat => {

            let chatDoc = snapChat.data();

            console.log('[CHAT]', chatDoc);

            let messageRef = chatRef.collection('messages').doc(messageId);

            messageRef.onSnapshot(snapMessage => {

                let messageDoc = snapMessage.data();

                console.log('[MESSAGE]', messageDoc);
                console.log('[USERS]', Object.keys(chatDoc.users));
                console.log('[FROM BASE64]', encode64(messageDoc.from));

                const messageFrom = messageDoc.from;
                const messageTo = Object.keys(chatDoc.users).filter(userId => userId !== encode64(messageDoc.from))[0];

                console.log('[FROM]', messageFrom);
                console.log('[TO]', decode64(messageTo));
                console.log('[LAST MESSAGE]', messageDoc.content);
                console.log('[LAST MESSAGE TIME]', new Date());

                db.collection('users').doc(decode64(messageTo)).collection('contacts').doc(messageFrom).set({
                    lastMessage: messageDoc.content,
                    lastMessageTime: new Date()
                }, {
                    merge: true
                }).then(() => {

                    console.log('[END]');
                    resolve(true);
                    return true;

                }).catch(e => {
                    throw new Error("User last message not saved.");
                });

            });

        });

    });

});