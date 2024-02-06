import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import connection from '../database/db.js'
import { promisify } from 'util'
import dotenv from 'dotenv'
import emailer from '../mail/emailer.js'
import path from 'path'

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import WebSocketcon from '../sockets/sockets.js'

//import ActiveDirectory from 'activedirectory'
import ldap from 'ldapjs'

//import { equal } from 'assert'
//seteamos las variables de entorno
dotenv.config({
    path: path.join(__dirname,'../../env/.env')
})

const client = ldap.createClient({
    url:[process.env.LDAP_URL,process.env.LDAP_URL2],        
    timeout:9000,
    connectTimeout:9000,
    idleTimeout:9000,
    reconnect:true
})

client.on('error', (err) => {
    console.log('ERROR client',err)
})

//const ad = new ActiveDirectory(config)
const config = {
    url:process.env.LDAP_URL,
    baseDN:process.env.LDAP_BASEDN
}

//procedimiento para registrarnos
/*
const register = async (req, res) => {
    try{
        const user = req.body.user;
        const name = req.body.name;
        const pass = req.body.pass;

        let passHash = await bcryptjs.hash(pass,8)

        connection.query('INSERT INTO users SET ?', {
            user:user,
            name:name,
            pass:passHash
        }, (error, result) => {
            if(error){
                console.log(error)                
            }
            res.redirect('/')            
        })
    } catch (error){
        console.log(error)
    }    
}
*/

function getProperObject(entry) {
    var obj = {
      dn: entry.dn.toString(),
      controls: []
    };
    entry.attributes.forEach(function (a) {
      var buf = a.buffers;
      var val = a.vals;
      var item;
      if ( a.type == 'thumbnailPhoto' )
        item = buf;
      else
        item = val;
      if (item && item.length) {
        if (item.length > 1) {
          obj[a.type] = item.slice();
        } else {
          obj[a.type] = item[0];
        }
      } else {
        obj[a.type] = [];
      }
    });
    entry.controls.forEach(function (element, index, array) {
      obj.controls.push(element.json);
    });
    return obj;
  }

const login = async (req, res) => {    
    try {
        const user = req.body.USR_Cod;
        const pass = req.body.USR_Pass;        
        
        const pool = await connection();
        const result = await pool
            .request()
            .input("USR_Cod",user)
            .query("exec [spUsuario_ConsultarPorLogin] @USR_Cod");
        
        if(result.recordset.length==0){            
            res.json({
                state:3,
                msg:'Usuario no existe'
            })        
        }else{
            const reg = result.recordset[0];            
            if(reg.USR_Estado==1 && reg.PER_Estado==1){
                if (reg.USR_LDAP==1){                                   
                    //Autenticacion con LDAP                    
                    //const username=user+process.env.LDAP_DOMINIO
                    client.bind('cn=tic, OU=Informatica,OU=MINTRAB_GENERICOS,DC=MINTRAB,DC=MS','Usuario2018', (err) => {
                        if(err){
                            console.log('ERROR bind:',err);
                            if(err.errno==-4078){
                                res.json({
                                    state:5,
                                    msg:'Error de servidor 4078 - inicial'
                                })  
                            }else{
                                console.log(err)
                                res.json({
                                    state:6,
                                    msg:'Error de configuración inicial'
                                })  
                            }
                            return;
                        }else{
                            client.bind(user+process.env.LDAP_DOMINIO,pass,(err) => {
                                if(err){
                                    if(err.errno==-4078){
                                        res.json({
                                            state:7,
                                            msg:'Error de servidor 4078'
                                        })  
                                    }else{
                                        console.log(err)
                                        res.json({
                                            state:8,
                                            msg:'Error de autenticación '
                                        })  
                                    } 
                                    return                                    
                                }else{                                    
                                    session(res,result);
                                    res.json({
                                        state:1,
                                        msg:'Usuario LDAP Autenticado'
                                    })
                                }
                                return
                            })
                        }
                    })                                                          
                }else{                    
                    //console.log(await bcryptjs.hash(pass,8));
                    if(!(await bcryptjs.compare(pass, reg.USR_Pass))){
                        res.json({
                            state:2,
                            msg:'Usuario LOCAL y/o Password incorrectas'
                        })                        
                    }else{
                        //inicio de sesion ok
                        session(res,result);
                        if(reg.USR_ClaveProvisoria==0){                                                  
                            res.json({
                                state:1,
                                msg:'Usuario LOCAL Autenticado'
                            })
                            //console.log(reg)
                        }else{
                            res.json({
                                state:0,
                                msg:'Usuario LOCAL Con clave Provisoria'
                            })
                        }                        
                    }                   
                }
            }else{                
                res.json({
                    state:4,
                    msg:'Usuario/Perfil Bloqueado'
                })        
            }			
        }                                    
    } catch (error) {        
        return res.status(500).json({ msg: "Error en la ejecución de la solicitud " + error });
    }
}

const isAuthenticaded = async (req, res, next) => {    
    if(req.cookies.jwt){        
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            //console.log(decodificada)

            /*const pool = await connection();
            const resultUser = await pool
                .request()
                .input("USR_Id",decodificada.USR_Id)                
                .query("exec [spUsuario_Consultar] @USR_Id");
           
            if(!resultUser){
                return next()
            }*/

            //req.user = resultUser.recordset[0].USR_Nombre + ' ' + resultUser.recordset[0].USR_Apellido;
            req.user = decodificada.USR_Nombre;
            req.nickname = decodificada.USR_Usuario;
            req.usrid = decodificada.USR_Id;
            //console.log(resultUser.recordset[0])   //habra que evitar enviar todos los datos al index?????
            return next()
            
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
}

const changePassword = async (req, res) => {
    try {        
        const user = req.body.USR_Cod;        
        const pass = req.body.USR_Pass;
        const inpPass = req.body.inputPassword;        

        const pool = await connection();
        const resultUser = await pool 
            .request()
            .input("USR_Cod",user)
            .query("exec [spUsuario_ConsultarPorLogin] @USR_Cod");

        if(!resultUser){
            res.json({
                state:3,
                msg:'Error en la obtencion de los datos del usuario'
            }) 
            return
        }
        
        //const conPass = req.body.inputPasswordConfirm;
        //console.log(req.body,await bcryptjs.hash(pass,8));
        const usrTok = resultUser.recordset[0].USR_Identificador;
        const usrId  = resultUser.recordset[0].USR_Id;
        
        if(!(await bcryptjs.compare(pass, resultUser.recordset[0].USR_Pass))){
            res.json({
                state:4,
                msg:'Password incorrecta'
            })
            return
        }
        
        await pool
            .request()
            .input("USR_PassOld",'')
            .input("USR_PassNew",await bcryptjs.hash(inpPass,8))
            .input("USR_Id",usrId)
            .input("USR_Token", usrTok)
            .query("exec [spUsuario_PassCambiar] @USR_PassOld, @USR_PassNew, @USR_Id, @USR_Token");

        session(res,resultUser);
        
        res.json({
            state:1,
            msg:'Cambio de Clave satisfactoria'
        })  
    }catch (err){
        res.json({
            state:3,
            msg:'Error en la actualizacion ' + err
        }) 
    }                
}

const forgotPassword = async (req, res) => {
    try{
        const USR_Mail = req.body.USR_Mail

        const pool = await connection();
        //Generando clave aleatore
        const resultPass = await pool 
            .request()            
            .query("SELECT dbo.fnUsuario_PassGenerar() as Pass");

        if(!resultPass){
            res.json({
                state:6,
                msg:'Generacion de clave aleatoria fallida'
            }) 
            return
        }

        const pass = resultPass.recordset[0].Pass
        const passHash = await bcryptjs.hash(pass,8)

        //Cambiando clave
        const resultUser = await pool 
            .request()
            .input("USR_Mail",USR_Mail)
            .input("Pass", pass)
            .input("passHash", passHash)
            .query("exec [spUsuario_PassOlvidoNodejs] @USR_Mail, @Pass, @passHash");


        if(!resultUser){
            res.json({
                state:3,
                msg:'Correo no registrado en el sistema'
            }) 
            return
        }else{
            emailer.sendMail();
            console.log('Envio de correo');
            //evniocorreo('lcastillop1975@gmail.com');
        }
        //console.log(resultUser.recordset)
        if(resultUser.recordset[0].Result==1){
            res.json({
                state:1,
                msg:'Solicitud de cambio de clave enviada'
            })             
        }else{
            if(resultUser.recordset[0].Result==2){
                res.json({
                    state:4,
                    msg:'Usuario LDAP debe cambiar su clave en computador local conectado a la red interna'
                })                 
            }else{
                res.json({
                    state:5,
                    msg:'Correo no registrado en el sistema'
                })                 
            }
        }   
        return
    }catch(err){
        res.json({
            state:2,
            msg:'Error en la solicitud ' + err
        }) 
    }
}

const session = async(res, resultUser) => {
    const reg = resultUser.recordset[0]
        //console.log(usrTok,usrId)
        const token = jwt.sign({
            USR_Id:reg.USR_Id,
            PER_Id:reg.PER_Id,
            PER_Nombre:reg.PER_Nombre,
            USR_Usuario:reg.USR_Usuario,
            USR_Nombre:reg.USR_Nombre + ' ' + reg.USR_Apellido,
            USR_Identificador: reg.USR_Identificador,
            DEP_Descripcion: reg.DEP_Descripcion,
            DEP_Id: reg.DEP_Id,
            USR_LDAP: reg.USR_LDAP
        },process.env.JWT_SECRETO,{
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        })
        const cookieOptions = {
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.cookie('jwt',token,cookieOptions)
}

const logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

const usrPhoto = async(req, res) => {
    //console.log(res.body,req.params)
    try{
        client.bind('cn=tic, OU=Informatica,OU=MINTRAB_GENERICOS,DC=MINTRAB,DC=MS','Usuario2018', (err) => {
        })
        var opts = {
            filter: '(mail=' + req.params.id + '@*)',
            scope: 'sub',
            //attributes: ['cn','sn','thumbnailPhoto']
            attributes: ['cn','sn','mail','givenname','department','extensionAttribute1','extensionAttribute2','thumbnailPhoto']
        };
        
        //client.search('OU=Informatica,OU=MINTRAB_GENERICOS,DC=MINTRAB,DC=MS', opts, function(err, res) {
        client.search('OU=MINTRAB,DC=MINTRAB,DC=MS', opts, function(err, resx) {
            //console.log(err);
        
            resx.on('searchEntry', function(entry){                
                const file = entry.object.thumbnailPhoto;                                
                const imgbase64 = getProperObject(entry).thumbnailPhoto
                //const imgbase64 = getProperObject(entry).thumbnailPhoto.toString('base64')

                res.set({
                    'Content-Type': 'image/jpg',
                    'Content-Length': imgbase64.length
                });
                res.send(imgbase64);
                return
            });
            resx.on('searchReference', function(referral) {
                console.log('referral: ' + referral.uris.join());                
                return
            });
            resx.on('error', function(err) {
                console.error('error: ' + err.message);
                //res.sendStatus(404);
                return
            });
            resx.on('end', function(result) {
                console.log('status: ' + result.status);
                //res.sendStatus(200);
                return
            });
            
        });
    }catch(err){
        console.log(err)
    }
}

export default {
    //register,
    forgotPassword,
    changePassword,
    login,
    isAuthenticaded,
    logout,
    usrPhoto
}