export class Format {

    static getCamelcase(text) {

        let div = document.createElement('div');

        div.innerHTML = `<div data-${text}="id"></div>`;

        return Object.keys(div.firstChild.dataset)[0];

    }

    static toTime(duration) {

        let milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        } else {
            return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`;

        }

    }

    static fbTimeStampToTime(timeStamp) {

        return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateToTime(timeStamp.toDate()) : '';

    }

    static dateToTime(date, locale = 'pt-BR') {

        let string = '';

        if (date && date instanceof Date) {
            string = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        }

        return string;

    }

}