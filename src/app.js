import express, { response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import router from './routers/router.js'
import { Server } from 'socket.io'
import WebSocketcon from './sockets/sockets.js'
import fs from 'fs'
import https from 'https'
import morgan from 'morgan'
import cors from 'cors'
/*import { networkInterfaces } from 'os'

import path from 'path'
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));*/

const app = express();
const server = https.createServer({
    /*cert: fs.readFileSync('./certs/mi_certificado.crt'),
    key:fs.readFileSync('./certs/mi_certificado.key'),
    passphrase:'123456'*/
    pfx: fs.readFileSync( './certs/mi_certificado.pfx'),    
    passphrase: 'Josefina123'
}, app)


//const http = require('http')
//const server = http.createServer(app)
const io = new Server(server)

//seteamos el motor de plantillas
//app.set('views', __dirname+'/views/');
app.set('views', './views');
app.set('view engine', 'ejs');


//seteamos la carpeta public para archivos estatios
app.use(express.static('./public'));
//app.use('/socket.io', express.static('node_modules/socket.io/dist'))

//middelware
//para procesa datos enviados desde forms
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());    //{origin:'https://www.pagina.com'}
app.use(morgan('dev'));
app.use(express.json());

//Servidor websoket
//require('/sockets')(io)
WebSocketcon.conn(io)

//seteamos las variables de entorno
dotenv.config({
    path: '../env/.env'
})

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router con autenticacion ntlm
app.use('/', router)

//Para eliminar el cache y que no sepueda volver con el boton de back luego de quehacemos un logout
app.use((req, res, next) => {
    if (!req.user) {
        res.header('Cache-Control', 'private, no chache, no-store, must-revalidate');
    }
    next();
})
//setting
app.set('port', process.env.PORT || 3500)

//para activar el socket se debe levantar el servidor desde server no de app https://www.npmjs.com/package/socket.io
//server.listen(app.get('port'),'127.0.0.1', () => {
server.listen(app.get('port'), () => {
    console.log('Server UP on port', app.get('port'));    
})