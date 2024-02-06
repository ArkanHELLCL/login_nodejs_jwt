import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()
//const fs = require('fs');
import fs from 'fs'
import path from 'path'

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

//router para las vistas
router.get('/', authController.isAuthenticaded, (req, res) => {
    res.render('index', { user: req.user, nickname: req.nickname, usrid: req.usrid })
})
router.get('/login', (req, res) => {
    //res.render('login',{alert:false})
    res.render('login');
})

//router para los metodos del controller
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.get('/logout', authController.logout);
router.get('/login/usrPhoto/:id', authController.usrPhoto);
router.get('/favicon.ico', (req, res) => {    
    fs.readFile('./public/img/favicon.ico', function (err, data) {
        if (err) {
            console.log(err);            
        } else {            
            res.setHeader("Content-Type", "image/x-icon");
            res.end(data);
        };
    });
})
//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
    res.status(404).send('Recurso no encontrado');
    //res.sendFile(__dirname,'/404.html')
    //res.render('404',{title:'404 page'})
});
export default router