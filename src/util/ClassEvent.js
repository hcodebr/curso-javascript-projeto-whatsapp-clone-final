export class ClassEvent {

    constructor() {

        this._events = {};

    }

    on(name, fn) {

        if (!this._events[name]) this._events[name] = new Array();

        this._events[name].push(fn);

    }

    trigger() {

        let args = [...arguments];
        let eventName = args.shift();
        args.push(new Event(eventName));

        if (this._events[eventName] instanceof Array) {

            this._events[eventName].forEach(fn => {

                fn.apply(null, args, {
                    type: eventName,
                    timeStamp: new Date().getTime()
                });

            });

        }

    }

}