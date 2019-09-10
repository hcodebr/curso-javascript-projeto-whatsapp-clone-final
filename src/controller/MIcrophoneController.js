import { Format } from './../util/Format';
import { ClassEvent } from './../util/ClassEvent';

export class MicrophoneController extends ClassEvent {

    constructor(){

        super();

        this._available = false;

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {

            this._available = true;

            this._stream = stream;

            this.trigger('ready', {
                sream: this._stream,
                audio: this._audio
            });

        }).catch(err => {

            console.error(err);

        });

    }

    stopRecorder(){

        if (this._available) {
        
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();

        }

    }

    stopTimer(){

        clearInterval(this._recordMicrophoneInterval);

    }

    startTimer(){

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('timer', {
                displayTimer: Format.toTime(Date.now() - start)
            });

        }, 100);

    }

    startRecorder(options = {}){

        if (this._available) {

            this.startTimer();

            this._mediaRecorder = new MediaRecorder(this._stream, Object.assign(options, {
                mimeType: 'audio/webm'
            }));

            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e => {

                if (e.data.size > 0) this._recordedChunks.push(e.data);

            });

            this._mediaRecorder.addEventListener('stop', () => {

                let blob = new Blob(this._recordedChunks, {
                    type: 'audio/webm'
                });

                let cx = new AudioContext();

                var fileReader = new FileReader();
                
                fileReader.onload = e => {

                    cx.decodeAudioData(fileReader.result).then(decode => {

                        let file = new File([blob], 'rec' + new Date().getTime() + '.webm', {
                            type: 'audio/webm',
                            lastModified: Date.now()
                        });

                        this.trigger('recorded', file, decode);

                    });

                };

                fileReader.readAsArrayBuffer(blob);                

            });

            this._mediaRecorder.start();

        }

    }

    play(){

        if (this._available) {

            this._audio = new Audio();

            this._audio.src = URL.createObjectURL(this._stream);

            this._audio.play();

            this.trigger('play', {
                sream: this._stream,
                audio: this._audio
            });

        }

    }

    stop(){

        if (this._available) {

            this._stream.getTracks().forEach(track => {

                track.stop();

            });

            this.trigger('stop');

        }

    }

}