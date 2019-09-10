export class Base64 {

    static getMimeType(base64URL){

        let regex = /^data:(.+);base64,(.*)$/;
        let result = base64URL.match(regex);
        return result[1];

    }

    static toFile(base64URL){

        let mimeType = Base64.getMimeType(base64URL);
        let ext = mimeType.split('/')[1];
        let filename = `file${Date.now()}.${ext}`;

        return fetch(base64URL)
            .then(res => { return res.arrayBuffer(); })
            .then(buf => { return new File([buf], filename, { type: mimeType }); });

    }

}