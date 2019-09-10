const path = require('path');

module.exports = {
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist',
        filename: '[name].bundle.js'
    }
};