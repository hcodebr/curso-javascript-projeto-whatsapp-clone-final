var pdfjsLib = require('pdfjs-dist');
var path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController {

    constructor(file){

        this._file = file;

    }

    getPriviewData(){

        return new Promise((resolve, reject)=>{

            let reader = new FileReader();

            reader.onerror = event => {

                reject({
                    error: true,
                    event
                });

            };

            switch (this._file.type) {

                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':

                    reader.onload = event => {

                        resolve({
                            src: reader.result,
                            info: this._file.name
                        });

                    };

                    reader.readAsDataURL(this._file);

                    break;

                case 'application/pdf':

                    reader.onload = event => {

                        pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {

                            pdf.getPage(1).then(page => {

                                let viewport = page.getViewport(1);

                                let canvas = document.createElement('canvas');
                                let canvasContext = canvas.getContext('2d');

                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                page.render({
                                    canvasContext,
                                    viewport
                                }).then(() => {

                                    let s = (pdf.numPages > 1) ? 's' : '';

                                    resolve({
                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} página${s}`
                                    });

                                });

                            });

                        }).catch(event => {

                            reject({
                                error: true,
                                event
                            });

                        });                   

                    };

                    reader.readAsArrayBuffer(this._file);

                    break;

                default:
                    
                    reject({
                        error: false
                    });

                    break;

            }

        }); 

    }

}