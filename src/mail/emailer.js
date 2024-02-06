import nodemailer from 'nodemailer'

const createTrans = () =>{
    const transport = nodemailer.createTransport({
        host: "10.0.0.145",
        port: 26,
        auth:{
            user:"lcastillo@mintrab.gob.cl",
            pass:"Josefina123"
        }
    });
    return transport;
};

const sendMail = async() =>{
    const transporter = createTrans()
    const info = await transporter.sendMail({
        from: 'Sistema Dialgo Social V6 <dialogosocial@mintrab.gob.cl',
        to: 'lcastillop1975@hotmail.com, lcastillop1975@gmail.com',
        subject:'Hola!!',
        html:'<b>Hola Mundo</b>',
        //attachments:[
        //    {
        //        filename:'',
        //        path:''
        //    },
        //]        
    });
    console.log("Mensaje enviado: %s", info.messageId);
    return;
}
    


export default {
    createTrans,
    sendMail
}