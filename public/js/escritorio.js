$(function (){
    const socket = io()

    //Elementos DOM
    const messageForm = $('#message-form')
    const messageBox = $('#message')
    const chat = $('#chat')
    const users = $("#usernames")

    //Eventos
    messageForm.submit(e =>{
        e.preventDefault();
        console.log("enviado datos");
        socket.emit('send message',messageBox.val(), data => {
            chat.append(`<p class="error">${data}</p>`)
        });
        messageBox.val('');
    });
    socket.on('new message', data => {        
        chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>')
    })    
    socket.emit('new user', nick, data => {
        if(data){
            /*some stuf*/            
        }else{
            alert("Usuario ya existe");
        }
        console.log(data)
    });
    socket.on('usernames', data => {
        let html = '';
        for(let i = 0; i < data.length; i++){
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        users.html(html);
    });
    socket.on('whisper', data => {
        chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`)
    })
})
