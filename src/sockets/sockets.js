let users = {

};
function conn(io){    
    io.on('connection', (socket) => {        
        console.log('Usuario conectado');
        socket.on('new user', (data, cb) => {            
            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data
                users[socket.nickname] = socket;
                updateNicknames();
            }            
        })
        socket.on('send message', (data, cb) => {       
            var msg = data.trim();
            //console.log(msg.substr(0, 3))
            if(msg.substr(0, 3) === '/w '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substr(0, index);
                    var msg = msg.substr(index + 1);
                    if(name in users){
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname       //Quien lo envia
                        });
                    }else{
                        cb('Error! Ingresa un usuario válido');
                    }
                }else{
                    cb('Error! Entra tu mensaje')
                }
            }else{
                //io tiene todos los socket conectados, es decir a todos los usuarios
                io.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }            
        });
        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });
        function updateNicknames(){
            io.emit('usernames',Object.keys(users));
        }
    })
}
/*function addNickNames(data, cb){
    console.log(data)
    if(nicknames.indexOf(data) != -1){
        cb(false);
    }else{
        cb(true);
        socket.nickname = data
        nicknames.push(socket.nickname);
        io.emit('usernames',nicknames)
    }
    console.log(nicknames)
}*/

export default {
    conn//,
    //addNickNames
}