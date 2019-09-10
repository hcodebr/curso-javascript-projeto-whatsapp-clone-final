import { Format } from './../util/Format';
import { CameraController } from './CameraController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { MicrophoneController } from './MicrophoneController';
import { Firebase } from './../util/Firebase';
import { User } from './../model/User';
import { Chat } from './../model/Chat';
import { Message } from '../model/Message';
import { Base64 } from '../util/Base64';
import { ContactsController } from './ContactsController';

export class WhatsAppController {

    constructor() {

        this._active = true;
        this._locale = 'pt-BR';
        this._firebase = new Firebase();

        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
        this.initAuth();
        this.checkNotifications();

    }

    checkNotifications() {

        if (typeof Notification === 'function') {

            if (Notification.permission !== 'granted') {

                this.el.alertNotificationPermission.show();



            } else {

                this.el.alertNotificationPermission.hide();

            }

            this.el.alertNotificationPermission.on('click', e => {

                Notification.requestPermission(permission => {

                    if (permission === "granted") {
                        this.el.alertNotificationPermission.hide();
                        console.info('Notificções permitidas!');
                    }

                });

            });

        }

    }

    initAuth() {

        this._firebase.initAuth().then(response => {

            this._user = new User(response.email);

            this._user.on('datachange', data => {

                let img = this.el.myPhoto.querySelector('img');
                let imgEdit = this.el.imgPanelEditProfile;

                if (data.photo) {
                    imgEdit.src = img.src = data.photo;
                    img.show();
                    imgEdit.show();
                    this.el.imgDefaultPanelEditProfile.hide();
                } else {
                    img.hide();
                }

                this.el.inputNamePanelEditProfile.innerHTML = data.name;

                document.querySelector('title').innerHTML = `${data.name} | WhatsApp Clone`;

            });

            this._user.name = response.displayName;
            this._user.email = response.email;
            this._user.photo = response.photoURL;

            this._user.save().then(() => {

                this._user.on('contactschange', contacts => {

                    this.el.contactsMessagesList.innerHTML = '';

                    contacts.forEach(contact => {

                        let contactEl = document.createElement('div');

                        contactEl.className = 'contact-item';

                        contactEl.innerHTML = `
                            <div class="dIyEr">
                                <div class="_1WliW" style="height: 49px; width: 49px;">
                                    <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                                    <div class="_3ZW2E">
                                        <span data-icon="default-user" class="">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                                <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                                <g fill="#FFF">
                                                    <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="_3j7s9">
                                <div class="_2FBdJ">
                                    <div class="_25Ooe">
                                        <span dir="auto" title="Nome do Contato" class="_1wjpf">${contact.name}</span>
                                    </div>
                                    <div class="_3Bxar">
                                        <span class="_3T2VG">${Format.fbTimeStampToTime(contact.lastMessageTime)}</span>
                                    </div>
                                </div>
                                <div class="_1AwDx">
                                    <div class="_itDl">
                                        <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

                                        <span class="_2_LEW last-message">
                                            <div class="_1VfKB">
                                                <span data-icon="status-dblcheck" class="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                                        <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                            <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                            <div class="_3Bxar">
                                                <span>
                                                    <div class="_15G96">
                                                        <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                                    </div>
                                            </span></div>
                                            </span>
                                    </div>
                                </div>
                            </div>
                        `;

                        if (contact.photo) {

                            let img = contactEl.querySelector('.photo');

                            img.src = contact.photo;
                            img.show();

                        }

                        contactEl.dataset.contact = JSON.stringify(contact);

                        this.el.contactsMessagesList.appendChild(contactEl);

                    });

                    this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

                        item.on('click', event => {

                            let contact = JSON.parse(item.dataset.contact);

                            this.setActiveChat(contact);

                        });

                    });

                });

                this._user.getContacts();

            });

            this.el.appContent.css({
                display: 'flex'
            });

        }).catch(err => {
            console.error(err);
        });

    }

    notification(data) {

        if (!this._active && Notification.permission === 'granted') {

            let n = new Notification(this._activeContact.name, {
                icon: this._activeContact.photo,
                body: data.content
            });

            let nSound = new Audio('./audio/alert.mp3');

            nSound.currentTime = 0;
            nSound.play();

            setTimeout(() => {

                if (n) n.close();

            }, 3000);

        }

    }

    setActiveChat(contact) {

        if (this._activeContact) {
            Message.getRef(this._activeContact.chatId).onSnapshot(() => { });
        }

        this.el.activeName.innerHTML = contact.name;
        this.el.activeStatus.innerHTML = contact.status;

        if (contact.photo) {
            let img = this.el.activePhoto;
            img.src = contact.photo;
            img.show();
        }

        this._activeContact = contact;

        this._messagesReceived = [];

        Message.getRef(this._activeContact.chatId).orderBy("timeStamp").onSnapshot(docs => {

            let scrollTop = this.el.panelMessagesContainer.scrollTop;
            let scrollTopMax = this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight;

            let autoScroll = (scrollTop >= scrollTopMax);

            this.el.panelMessagesContainer.innerHTML = '';

            docs.forEach(docMsg => {

                let data = docMsg.data();

                if (!this._messagesReceived.filter(msg => { return (msg === docMsg.id) }).length) {
                    this._messagesReceived.push(docMsg.id);
                    this.notification(data);
                }

                let message = new Message();

                message.fromJSON(data);

                let messageEl = message.getViewElement((data.from === this._user.email));

                this.el.panelMessagesContainer.appendChild(messageEl);

                if (data.from !== this._user.email) {

                    docMsg.ref.set({
                        status: 'read'
                    }, {
                            merge: true
                        });

                }

                if (data.type === 'contact') {

                    messageEl.querySelector('.btn-message-send').on('click', e => {


                        Chat.createIfNotExists(this._user.email, data.content.email).then(chat => {

                            let contact = new User(data.content.email);

                            contact.on('datachange', userData => {

                                contact.chatId = chat.id;

                                this._user.addContact(contact);

                                this._user.chatId = chat.id;

                                contact.addContact(this._user);

                                this.setActiveChat(contact);

                            });

                        });

                    });

                }

            });

            if (autoScroll) {
                this.el.panelMessagesContainer.scrollTop = (this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight);
            } else {
                this.el.panelMessagesContainer.scrollTop = scrollTop;
            }

        });

        this.el.home.hide();
        this.el.main.css({
            display: 'flex'
        });

    }

    loadElements() {

        this.el = {};

        document.querySelectorAll('[id]').forEach(element => {

            this.el[Format.getCamelcase(element.id)] = element;

        });

    }

    elementsPrototype() {

        Element.prototype.hide = function () {
            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function () {
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function () {
            if (this.style.display === 'none') {
                this.show();
            } else {
                this.hide();
            }
            return this;
        }

        Element.prototype.on = function (events, fn) {

            events.split(' ').forEach(event => {

                this.addEventListener(event, fn);

            });
            return this;

        }

        Element.prototype.css = function (styles) {

            for (let name in styles) {

                this.style[name] = styles[name];

            }
            return this;

        }

        Element.prototype.addClass = function (name) {

            this.classList.add(name);
            return this;

        }

        Element.prototype.removeClass = function (name) {

            this.classList.remove(name);
            return this;

        }

        Element.prototype.toggleClass = function (name) {

            this.classList.toggle(name);
            return this;

        }

        Element.prototype.hasClass = function (name) {

            return this.classList.contains(name);

        }

        Element.prototype.sleep = function (duration, fn) {

            setTimeout(fn, duration);
            return this;

        }

        HTMLFormElement.prototype.getForm = function () {

            return new FormData(this);

        }

        HTMLFormElement.prototype.toJSON = function () {

            let json = {};

            this.getForm().forEach((value, key) => {
                json[key] = value;
            });

            return json;

        }

    }

    initEvents() {

        window.addEventListener('focus', e => {

            this._active = true;

        });

        window.addEventListener('blur', e => {

            this._active = false;

        });

        /**
         * START: Editar Perfil
         */
        this.el.myPhoto.on('click', event => {

            this.el.panelAddContact.hide();
            this.el.panelEditProfile.show().sleep(1, () => {
                this.el.panelEditProfile.addClass('open');
            });

        });

        this.el.btnClosePanelEditProfile.on('click', event => {

            this.el.panelEditProfile.removeClass('open').sleep(300, () => {
                this.el.panelEditProfile.hide();
            });

        });

        this.el.photoContainerEditProfile.on('click', event => {

            this.el.inputProfilePhoto.click();

        });

        this.el.inputProfilePhoto.on('change', event => {

            if (this.el.inputProfilePhoto.files.length) {

                let file = this.el.inputProfilePhoto.files[0];
                let filename = `${Date.now()}${file.name}`;

                let uploadTask = Firebase.hd().ref('profile').child(filename).put(file);

                uploadTask.on('state_changed', snapshot => {

                    console.log('upload', snapshot);

                }, err => {

                    console.error(err);

                }, () => {

                    this._user.photo = uploadTask.snapshot.downloadURL;
                    this._user.save().then(() => {

                        this.el.btnClosePanelEditProfile.click();

                    });

                });

            }

        });

        this.el.btnSavePanelEditProfile.on('click', event => {

            let name = this.el.inputNamePanelEditProfile.innerHTML;

            this._user.name = name;
            this._user.save().then(() => {

                this.el.btnClosePanelEditProfile.click();

            });

        });

        this.el.inputNamePanelEditProfile.on('keypress', event => {

            if (event.key === 'Enter') {
                event.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }

        });
        /**
         * END: Editar Perfil
         */

        /**
         * START: Adicionar Contato
         */
        this.el.btnNewContact.on('click', event => {

            this.el.panelEditProfile.hide()
            this.el.panelAddContact.show().sleep(1, () => {
                this.el.panelAddContact.addClass('open');
            });

        });

        this.el.btnClosePanelAddContact.on('click', event => {

            this.el.panelAddContact.removeClass('open').sleep(300, () => {
                this.el.panelAddContact.hide();
            });

        });

        this.el.formPanelAddContact.on('submit', event => {

            event.preventDefault();

            let btn = this.el.formPanelAddContact.querySelector('[type="submit"]');

            btn.disabled = true;

            let email = this.el.formPanelAddContact.getForm().get('email');
            let contact = new User(email);

            contact.on('datachange', data => {

                if (!data.name) {

                    let error = `O contato ${email} não foi encontrado.`;
                    console.error(error);

                } else {

                    Chat.createIfNotExists(this._user.email, email).then(chat => {

                        contact.chatId = chat.id;

                        this._user.addContact(contact);

                        this._user.chatId = chat.id;

                        contact.addContact(this._user);

                        console.info(`O contato ${email} foi adicionado.`);
                        this.el.panelAddContact.hide();

                    });

                }

                btn.disabled = false;

            });

        });
        /**
         * END: Adicionar Contato
         */

        /**
         * START: Menu Anexar
         */
        this.el.btnAttach.on('click', event => {

            event.stopPropagation();

            this.el.menuAttach.addClass('open');

            document.addEventListener('click', this.closeMenuAttach.bind(this));

        });

        this.el.btnAttachPhoto.on('click', event => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this.el.inputPhoto.click();

        });

        this.el.inputPhoto.on('change', event => {

            [...this.el.inputPhoto.files].forEach(file => {

                Message.sendImage(this._activeContact.chatId, this._user.email, file);

            });

        });

        this.el.btnAttachCamera.on('click', event => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.hide();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.sleep(100, () => {
                this.el.panelCamera.style.height = 'calc(100% - 120px)';
            });

            this._cameraController = new CameraController(this.el.videoCamera);

        });

        this.el.btnClosePanelCamera.on('click', event => {

            this._cameraController.stop();
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();

        });

        this.el.btnTakePicture.on('click', event => {

            let picture = this._cameraController.takePicture();

            this.el.pictureCamera.src = picture;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerSendPicture.show();
            this.el.containerTakePicture.hide();

        });

        this.el.btnReshootPanelCamera.on('click', event => {

            this.el.btnReshootPanelCamera.hide();
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.containerSendPicture.hide();
            this.el.containerTakePicture.show();

        });

        this.el.btnSendPicture.on('click', event => {

            this.el.btnSendPicture.disabled = true;

            let picture = new Image();
            picture.src = this.el.pictureCamera.src;
            picture.onload = () => {

                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');

                canvas.setAttribute('width', picture.width);
                canvas.setAttribute('height', picture.height);

                context.translate(picture.width, 0);
                context.scale(-1, 1);
                context.drawImage(picture, 0, 0, canvas.width, canvas.height);

                Base64.toFile(canvas.toDataURL(Base64.getMimeType(this.el.pictureCamera.src))).then(file => {

                    Message.sendImage(this._activeContact.chatId, this._user.email, file);

                    this.closeAllMainPanel();
                    this._cameraController.stop();
                    this.el.btnReshootPanelCamera.hide();
                    this.el.pictureCamera.hide();
                    this.el.videoCamera.show();
                    this.el.containerSendPicture.hide();
                    this.el.containerTakePicture.show();
                    this.el.panelMessagesContainer.show();
                    this.el.btnSendPicture.disabled = false;

                });

            };

        });

        this.el.btnAttachDocument.on('click', event => {

            this.el.inputDocument.click();

        });

        this.el.inputDocument.on('change', event => {

            if (this.el.inputDocument.files.length) {

                let file = this.el.inputDocument.files[0];

                this.closeAllMainPanel();
                this.el.panelMessagesContainer.hide();
                this.el.panelDocumentPreview.addClass('open');
                this.el.panelDocumentPreview.sleep(500, () => {
                    this.el.panelDocumentPreview.style.height = 'calc(100% - 120px)';
                });


                this._documentPreview = new DocumentPreviewController(file);

                this._documentPreview.getPriviewData().then(data => {

                    this.el.filePanelDocumentPreview.hide();
                    this.el.imagePanelDocumentPreview.show();
                    this.el.imgPanelDocumentPreview.src = data.src;
                    this.el.imgPanelDocumentPreview.show();

                    this.el.infoPanelDocumentPreview.innerHTML = data.info;

                }).catch(event => {

                    if (event.error) {
                        console.error(event.event);
                    } else {

                        switch (file.type) {
                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            case 'application/msword':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-doc';
                                break;

                            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            case 'application/vnd.ms-excel':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-xls';
                                break;

                            case 'application/vnd.ms-powerpoint':
                            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-ppt';
                                break;

                            default:
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-generic';
                        }

                        this.el.filePanelDocumentPreview.show();
                        this.el.imagePanelDocumentPreview.hide();

                        this.el.filenamePanelDocumentPreview.innerHTML = file.name;

                    }

                });

            }

        });

        this.el.btnClosePanelDocumentPreview.on('click', event => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();

        });

        this.el.btnSendDocument.on('click', event => {

            let documentFile = this.el.inputDocument.files[0];

            if (documentFile.type === 'application/pdf') {

                Base64.toFile(this.el.imgPanelDocumentPreview.src).then(imageFile => {

                    Message.sendDocument(this._activeContact.chatId, this._user.email, documentFile, imageFile, this.el.infoPanelDocumentPreview.innerHTML);

                });

            } else {

                Message.sendDocument(this._activeContact.chatId, this._user.email, documentFile);

            }

            this.el.btnClosePanelDocumentPreview.click();

        });

        this.el.btnAttachContact.on('click', event => {

            this._contactsController = new ContactsController(this.el.modalContacts, this._user);

            this._contactsController.open();

            this._contactsController.on('select', contact => {

                Message.sendContact(this._activeContact.chatId, this._user.email, contact);

                this._contactsController.close();

            });

        });

        this.el.btnCloseModalContacts.on('click', event => {

            this._contactsController.close();

        });
        /**
         * END: Menu Anexar
         */

        /**
         * START: Microfone
         */

        this.el.btnSendMicrophone.on('click', event => {

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this.startRecordMicrophoneTime();

        });

        this.el.btnCancelMicrophone.on('click', event => {

            this.closeRecordMicrophone();

        });

        this.el.btnFinishMicrophone.on('click', event => {

            this._microphoneController.on('recorded', (file, metadata) => {

                Message.sendAudio(this._activeContact.chatId, this._user.email, file, metadata, this._user.photo);

            });

            this.closeRecordMicrophone();

        });

        /**
          * END: Microfone
          */

        /**
         * START: Digitar Mensagem
         */

        this.el.inputText.on('keypress', event => {

            if (event.key === 'Enter' && !event.ctrlKey) {
                event.preventDefault();
                this.el.btnSend.click();
            }

        });

        this.el.inputText.on('keyup', event => {

            if (this.el.inputText.innerHTML.length) {
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
            } else {
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            }

        });

        this.el.btnSend.on('click', event => {

            Message.send(this._activeContact.chatId, this._user.email, 'text', this.el.inputText.innerHTML);

            this.el.inputText.innerHTML = '';
            this.el.panelEmojis.removeClass('open');

        });

        this.el.btnEmojis.on('click', event => {

            this.el.panelEmojis.toggleClass('open');

            if (this.el.panelEmojis.hasClass('open')) {
                this.el.iconEmojisOpen.hide();
                this.el.iconEmojisClose.show();
            } else {
                this.el.iconEmojisOpen.show();
                this.el.iconEmojisClose.hide();
            }

        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {

            emoji.on('click', event => {

                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(cls => {

                    img.classList.add(cls);

                });

                //Retorna parte do texto selecionada pelo usuário ou a posição atual do cursor.
                let cursor = window.getSelection();

                //Se o cursor não estiver focado no campo de input, forçamos o focus
                if (!cursor.focusNode || cursor.focusNode.id !== 'input-text') {
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                //Cria um novo objeto de controle de intervalos
                let range = document.createRange();
                //Retorna o intervalo atual do cursor
                range = cursor.getRangeAt(0);
                //Remove o conteúdo selecionado
                range.deleteContents();
                //Cria um fragmento de Documento
                var frag = document.createDocumentFragment();
                //Adiciona a imagem no fragmento
                frag.appendChild(img);
                //inserir o fragmento no intervalo
                range.insertNode(frag);
                //coloca o cursor após a imagem                    
                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup'));

            });

        });

        /**
         * END: Digitar Mensagem
         */

    }

    startRecordMicrophoneTime() {

        this._microphoneController = new MicrophoneController();

        this._microphoneController.on('ready', event => {

            this._microphoneController.startRecorder();

        });

        this._microphoneController.on('timer', (data, event) => {

            this.el.recordMicrophoneTimer.innerHTML = data.displayTimer;

        });

    }

    closeRecordMicrophone() {

        this._microphoneController.stopRecorder();

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();

    }

    closeAllMainPanel() {

        this.el.panelDocumentPreview.style.height = '10%';
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');

    }

    closeMenuAttach(e) {

        this.el.menuAttach.removeClass('open');
        document.removeEventListener('click', this.closeMenuAttach);

    }

}