//UUID: 9860ca18-f538-4fd4-8a99-80eacf4f078f

let sentMessages = [];

let userName = prompt("Por favor insira seu nome para começar a conversar!");


function userLogin(){
        let now = new Date();
        let nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        let user = {name: userName};
        const userLogged = axios.post("https:mock-api.driven.com.br/api/v6/uol/participants/9860ca18-f538-4fd4-8a99-80eacf4f078f", user);
        const userStatus = axios.post("https://mock-api.driven.com.br/api/v6/uol/status/9860ca18-f538-4fd4-8a99-80eacf4f078f", user);
        const login = {from: userName, to: "Todos", text: "entrou na sala...", type: "status", time: nowTime};

        userLogged.then(receiveMsg);
        userStatus.then(receiveMsg);
        userLogged.catch(checkError);
        userStatus.catch(checkError);
        sentMessages.push(login);
}

function checkOnline(){
        let isOnline = axios.get("https:mock-api.driven.com.br/api/v6/uol/participants/9860ca18-f538-4fd4-8a99-80eacf4f078f");

        if(userName != isOnline){
                userLogin();
        }

}

function sideMenu(){
        let sideSelect = document.querySelector(".sidebar");
        sideSelect.classList.toggle("hidden");     
}

function getMsgs(){
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/9860ca18-f538-4fd4-8a99-80eacf4f078f");
        promise.then(processMsgs);
        promise.catch(checkError);
}

function processMsgs(serverResponse){
        console.log(serverResponse);
        sentMessages = serverResponse.data;
        renderMsgs();
}

 function renderMsgs(){
         const ul = document.querySelector(".messages");
         ul.innerHTML = "";

                 for (let i=0; i < sentMessages.length; i++){
                        if(sentMessages[i].type === "status"){
                                ul.innerHTML += 
                                        `<li class="msg ${sentMessages[i].type}">
                                                 <p>(${sentMessages[i].time})</p>
                                                 <div>
                                                 <strong>${sentMessages[i].from}</strong> 
                                                ${sentMessages[i].text} 
                                                </div>
                                         </li>
                                        `;
                        }
                        else{
                         ul.innerHTML += `
                         <li class="msg ${sentMessages[i].type}">
                                 <p>(${sentMessages[i].time})</p>
                                 <div>
                                 <strong>${sentMessages[i].from}</strong> 
                                para
                                <strong>${sentMessages[i].to}</strong>:
                                ${sentMessages[i].text} 
                                </div>
                         </li>
                        `;
                 }
                }

                const lastMsg = ul.querySelector("li : last-child");
                lastMsg.scrollIntoView();
        
        }

function sendMsg(){

        const msgText = document.querySelector(".msgInput");
        const newMsg = {from: userName, to: "Todos", text: msgText.value, type: "message",};
        
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/9860ca18-f538-4fd4-8a99-80eacf4f078f", newMsg);
        promise.then(getMsgs);
        promise.catch(checkError);
        document.querySelector(".msgInput").value = "";

}

function receiveMsg(){
        console.log("Resposta recebida");
}

function checkError(error){
        console.log("Status code: " + error.response.status);
        console.log("Error message: " + JSON.stringify(error.response));
}


//------------------RUN ON PAGE LOAD----------------------

userLogin();
getMsgs();
setInterval(getMsgs, 3000);
setInterval(checkOnline, 5000);