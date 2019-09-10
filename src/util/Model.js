import { ClassEvent } from "./ClassEvent";

export class Model extends ClassEvent {

    constructor() {
        super();
        this._data = {};
    }

    fromJSON(json) {

        this._data = Object.assign(this._data, json);

        this.trigger('datachange', this._data);

    }

    toJSON() {

        return this._data;

    }

}