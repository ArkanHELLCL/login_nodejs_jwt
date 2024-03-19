document.getElementById("forgot").addEventListener("click", () => {
    var element = document.getElementById("form-flipped");
    element.classList.toggle("flipped");
}); 

document.getElementById("forgot3").addEventListener("click", () => {
    var element = document.getElementById("form-flipped");
    element.classList.toggle("flipped2");
}); 

document.getElementById("forgot2").addEventListener("click", () => {
    var element = document.getElementById("form-flipped");
    element.classList.toggle("flipped");
}); 

//cambiando estado del label cuando se modifica el campo
const inputs = document.querySelectorAll('.form-control')
inputs.forEach((el) => {
    el.addEventListener("change", (e) => {            
        const element = document.getElementById(e.target.id);
        const siblings = getSiblings(element,'label');        
        if(element.value.length!=0){            
            if(siblings[0]){
                siblings[0].classList.add("active")
            }                        
        }else{
            if(siblings[0]){
                siblings[0].classList.remove("active")
            }     
        }
    });
    el.addEventListener("focus", (e) => {       
        //console.log("focus")     
        const element = document.getElementById(e.target.id);
        const siblings = getSiblings(element,'label');        
        if(element.value.length!=0){            
            if(siblings[0]){
                siblings[0].classList.add("active")
            }                        
        }else{
            if(siblings[0]){
                siblings[0].classList.remove("active")
            }     
        }
    }); 
    el.addEventListener("focusout", (e) => {       
        //console.log("focus-out")     
        const element = document.getElementById(e.target.id);
        const siblings = getSiblings(element,'label');        
        if(element.value.length!=0){            
            if(siblings[0]){
                siblings[0].classList.add("active")
            }                        
        }else{
            if(siblings[0]){
                siblings[0].classList.remove("active")
            }     
        }
    });
})

//busqueda de hermanos
const getSiblings = (e,s) => {
    //console.log(s)
    // for collecting siblings
    let siblings = []; 
    // if no parent, return no sibling
    if(!e.parentNode) {
        return siblings;
    }
    // first child of the parent node
    let sibling  = e.parentNode.firstChild;
    // collecting siblings
    while (sibling) {
        //console.log(sibling.tagName)
        if (sibling.nodeType === 1 && sibling !== e && ((s.toLowerCase()==sibling.tagName.toLowerCase()) || (!s))) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

//todos
//const siblings = getSiblings(document.getElementById('USR_Cod'));

//solo label
/*const siblings = getSiblings(document.getElementById('USR_Cod'),document.querySelector('label'));*/

const viewpass = document.querySelectorAll(".viewpass")
viewpass.forEach((el) => {
    el.addEventListener("mousedown",(e) =>{
        //console.log(e.path[0].getAttribute('data-key'))
        //console.log(e.path[0])
        if( document.getElementById(e.path[0].getAttribute('data-key')).type=="text"){
            document.getElementById(e.path[0].getAttribute('data-key')).type = "password"
            e.path[0].classList.add('fa-eye-slash')
            e.path[0].classList.remove('fa-eye')
        }else{
            document.getElementById(e.path[0].getAttribute('data-key')).type = "text"
            e.path[0].classList.remove('fa-eye-slash')
            e.path[0].classList.add('fa-eye')
        }
        
    });
})

document.getElementById("USR_Cod").addEventListener("focus" ,() => {
    usrPhoto();
})

document.getElementById("USR_Cod").addEventListener("change" ,() => {
    usrPhoto();
})

document.getElementById("USR_Pass").addEventListener("focus" ,() => {
    usrPhoto();
})

function usrPhoto(){
    const USR_Cod = document.getElementById("USR_Cod").value    
    if(USR_Cod.length>=5){
        fetch('/login/usrPhoto/' + USR_Cod)    
        //.then(response => response.blob())
        .then(response => {
            if(response.ok){
                document.getElementById("UsrPhoto").style.display = "block";
                 return response.blob()
            }else{
                return false
            }
        })
        .then(imgBlob => {                        
            var reader = new FileReader();
            console.log(imgBlob)
            if(imgBlob.size>0){
                reader.readAsDataURL(imgBlob); 
                reader.onloadend = function() {                
                    var base64data = reader.result;
                    document.getElementById("UsrPhoto").innerHTML = "<img src='" + base64data + "'>"
                }
            }else{
                document.getElementById("UsrPhoto").innerHTML = "<img src='./img/usericon.png'>"
            }
        })
        .catch((err)=> {
            console.log(err)
        })        
    }else{
        document.getElementById("UsrPhoto").innerHTML='';
    }
}
const validator = new VanillaValidator({
    selectors: {        
        error: 'is-invalid',
        messageError: 'invalid-feedback'
    },
    callbacks: {            
        requiredSuccess: function(element){            
            element.classList.add("is-valid");
        },
        requiredError: function(element){
            element.classList.remove("is-valid");
        }
    },
    customValidates:{
        'compareOldPass' : {
            message : 'De 8 y 16 carac. 1 may., 1 dig., 1 carac. y dist. a anterior',
            fn : function(field, container) {
                const regex = /(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}/g

                //console.log(field.value.match(regex));
                if((field.value === document.getElementById("USR_Pass").value) || field.value.match(regex)===null) return false                
                return true;
            }
        },
        'confirmPass' : {
            message : 'Las claves no coinciden',
            fn: function(field, container) {
                if(field.value === document.getElementById("inputPassword").value) return true
                return false;
            }
        }
    },
    onFormSubmit: function(container){
        var formId = container.id;
        var login = document.getElementById('USR_Cod').value;
        var password = document.getElementById('USR_Pass').value;
        var inputPassword = document.getElementById('inputPassword').value;
        var inputPasswordConfirm = document.getElementById('inputPasswordConfirm').value;
        var USR_Mail = document.getElementById("USR_Mail").value;

        var data = {
            "USR_Cod": login,
            "USR_Pass": password,
            "inputPassword" : inputPassword,
            "inputPasswordConfirm": inputPasswordConfirm,
            "USR_Mail": USR_Mail
        };
        
        if(formId=='login'){
            fetch('/login',{
                method:'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data),            
            })
            .then(res => res.json())
            .then(json => {
                if(json.state==0){
                    var element = document.getElementById("form-flipped");
                    element.classList.toggle("flipped2");                    
                }else{            
                    if(json.state==1){
                        Swal.fire({
                            title:"Excelente!",
                            text:'Te has autenticado correctamente.',
                            icon:'success',
                            showConfirmButton:false,
                            timer:1500
                        }).then(() => {
                            window.location = '/'
                        })
                    }else{
                        Swal.fire({
                            title:"ERROR!",
                            text:json.msg,
                            icon:'error',
                            showConfirmButton:true,
                            timer:false
                        }).then(() => {
                            window.location = '/'
                        })
                    }
                }
            })
        }
        if(formId=='new-pass'){
            fetch('/change-password',{
                method:'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data),
            })
            .then(res => res.json())
            .then(json => {
                if(json.state==1){
                    Swal.fire({
                        title:"Excelente!",
                        text:'Has cambiado exitosamente tu clave.',
                        icon:'success',
                        showConfirmButton:false,
                        timer:1500
                    }).then(() => {
                        window.location = '/'
                    })
                }else{
                    Swal.fire({
                        title:"ERROR!",
                        text:json.msg,
                        icon:'error',
                        showConfirmButton:true,
                        timer:false
                    }).then(() => {
                        window.location = '/'
                    })
                }
            })
        }

        if(formId=='forgot-pass'){
            fetch('/forgot-password',{
                method:'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data),            
            })
            .then(res => res.json())
            .then(json => {
                if(json.state==1){
                    Swal.fire({
                        title:"Excelente!",
                        text:'Se ha enviado la solicitud de cambio de clave a tu corre.',
                        icon:'success',
                        showConfirmButton:false,
                        timer:1500
                    }).then(() => {
                        //window.location = '/'
                        var element = document.getElementById("form-flipped");
                        element.classList.toggle("flipped");
                    })
                }else{
                    Swal.fire({
                        title:"ERROR!",
                        text:json.msg,
                        icon:'error',
                        showConfirmButton:true,
                        timer:false
                    }).then(() => {
                        //window.location = '/'
                        var element = document.getElementById("form-flipped");
                        element.classList.toggle("flipped");
                    })
                }
            })
        }
    }
});
