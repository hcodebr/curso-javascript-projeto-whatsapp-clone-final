import { Model } from './../util/Model'
import { Firebase } from './../util/Firebase'

export class User extends Model {

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }

    static getRef(){
        return Firebase.db().collection('users');
    }

    constructor(key){
        
        super();

        this.key = key;

        this.getByKey();

    }

    getByKey(){

        return new Promise((s, f)=>{

            User.getRef().doc(this.key).onSnapshot(doc => {

                this.doc = doc;

                this.fromJSON(doc.data());

                s(doc);

            });

        });        

    }

    save(){

        return User.getRef().doc(this.key).set(this.toJSON());

    }

    addContact(contact){

        return User.getRef().doc(this.key).collection('contacts').doc(contact.email).set(contact.toJSON());

    }

    getContacts(){

        return new Promise((s, f)=>{

            User.getRef().doc(this.key).collection('contacts').onSnapshot(docs => {

                let contacts = [];

                docs.forEach(doc=>{

                    let data = doc.data();
                    data._key = doc.key;
                    contacts.push(data);

                });

                s(docs);

                this.trigger('contactschange', contacts);

            });

        });        

    }

}