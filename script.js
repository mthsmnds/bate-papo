//UUID: 9860ca18-f538-4fd4-8a99-80eacf4f078f

let sentMessages = [];
let userName = prompt("Por favor insira seu nome para começar a conversar!");
let selectedUser = "Todos";
let messageType = "message";


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

function sideMenu(){
        let sideSelect = document.querySelector(".sidebar");
        sideSelect.classList.toggle("hidden");     

        if(!sideSelect.classList.contains("hidden")){
                getParticipants();
        }
}

function getParticipants(){
        const promise = axios.get("https:mock-api.driven.com.br/api/v6/uol/participants/9860ca18-f538-4fd4-8a99-80eacf4f078f");
        promise.then(renderParticipants);
        promise.catch(checkError);
}

function renderParticipants(response){
        let participants = response.data;
        const sideMenu = document.querySelector(".sidebar .users-list");
        sideMenu.innerHTML = "";

        for(let i = 0; i<participants.length; i++){
                sideMenu.innerHTML += `
                        <div class="item" onclick="selectUser('${participants[i].name}', this)">
                                <ion-icon name="person-circle"></ion-icon> <h2>${participants[i].name}</h2>
                        </div>
                `;
        }
        sideMenu.innerHTML = `
                <div class="item" onclick="selectUser('Todos', this)">
                        <ion-icon name="people"></ion-icon> <h2>Todos</h2>
                </div>
        ` + sideMenu.innerHTML;

}

function selectUser(userName, element){
        selectedUser = userName;
        const usersList = document.querySelectorAll(".sidebar .users-list .item");
        usersList.forEach(item => {
            item.classList.remove("selected");
            const checkmark = item.querySelector("ion-icon[name='checkmark-sharp']");
            if (checkmark) {
                checkmark.remove(); 
            }
        });
        
        element.classList.add("selected");
    
        element.innerHTML += `<ion-icon name="checkmark-sharp"></ion-icon>`;
        updateMsgStatus();
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

function renderMsgs() {
        const ul = document.querySelector(".messages");
        ul.innerHTML = "";
    
        for (let i = 0; i < sentMessages.length; i++) {
            const msg = sentMessages[i];
    
            if (msg.type === "status") {
                ul.innerHTML += `
                    <li class="msg ${msg.type}">
                        <p>(${msg.time})</p>
                        <div>
                            <strong>${msg.from}</strong> 
                            ${msg.text} 
                        </div>
                    </li>
                `;
            }
            else if (msg.type === "message" || (msg.type === "private_message" && (msg.from === userName || msg.to === userName))) {
                ul.innerHTML += `
                    <li class="msg ${msg.type}">
                        <p>(${msg.time})</p>
                        <div>
                            <strong>${msg.from}</strong> 
                            para
                            <strong>${msg.to}</strong>:
                            ${msg.text} 
                        </div>
                    </li>
                `;
            }
        }
    
        scrollToLastMsg();
    }

function sendMsg(){

        const msgText = document.querySelector(".msgInput");
        const newMsg = {from: userName, to: selectedUser, text: msgText.value, type: messageType,};
        
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/9860ca18-f538-4fd4-8a99-80eacf4f078f", newMsg);
        promise.then(getMsgs);
        promise.catch(checkError);
        document.querySelector(".msgInput").value = "";
}

function selectMsgType(type, element){
        messageType = type
        const messageTypes = document.querySelectorAll(".sidebar .item");
        messageTypes.forEach(item => {
                item.classList.remove("selected");
                const checkmark = item.querySelector("ion-icon[name='checkmark-sharp']");
                if (checkmark) {
                    checkmark.remove();
                }
            });

        element.classList.add("selected");
        element.innerHTML += `<ion-icon name= "checkmark-sharp"></ion-icon>`;

        updateMsgStatus();
}

function updateMsgStatus() {
        const msgStatus = document.querySelector(".msgStatus");
        if (messageType === "private_message") {
            msgStatus.innerHTML = `Enviando mensagem para ${selectedUser} (Reservadamente)`;
        } else {
            msgStatus.innerHTML = `Enviando mensagem para ${selectedUser} (Público)`;
        }
    }

function scrollToLastMsg() {
        const ul = document.querySelector(".messages");
        const lastMsg = ul.querySelector("li:last-child");
        if (lastMsg) {
            lastMsg.scrollIntoView();
        }
    }

function checkOnline(){
        let isOnline = axios.get("https:mock-api.driven.com.br/api/v6/uol/participants/9860ca18-f538-4fd4-8a99-80eacf4f078f");
        if(userName != isOnline){
                userLogin();
        }
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