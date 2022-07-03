import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
let room_id = "" ; 
let contactingPerson ; 
const userLogo = document.getElementById('userLogo') ; 
const dropdown = document.getElementById('dropdown') ; 
const chatApp = document.getElementById('chatApp')  ;  
userLogo.addEventListener('mouseover' , (e) =>{
    dropdown.classList.add('active') ; 
}) ; 

chatApp.addEventListener('mouseover' , (e)=>{
dropdown.classList.remove('active') ; 
}) ; 

const socket = io('http://localhost:3000') ; 
//const socket = io('https://chatterbox888.herokuapp.com/') ; 



//code for the livesearch 
const contacts = document.getElementById('contacts') ; 
const searchBar = document.getElementById('searchBar') ; 
const searchForm = document.getElementById('searchForm') ; 
const chatSection = document.getElementById('chatSection') ; 
const chatAcknowledge = document.getElementById('chatAcknowledge') ; 
const contactName = document.getElementById('contactName') ; 
const username = document.getElementById('username');  
const chats = document.getElementById('chats') ; 
const contactItems = document.getElementsByClassName('contactItem') ; 

function eventAddingFunction(){
    for(let i = 0 ; i<contactItems.length ; i++){
        contactItems[i].addEventListener('click' , async (e) =>{
            contactingPerson = e.currentTarget.title ; 
            chatSection.style.display = 'block' ; 
            const parent = document.querySelector(`div[title=${username.innerHTML}]`) ; 
            const child = document.querySelector(`div[title=${username.innerHTML}] i`) ;

            chatAcknowledge.style.display = 'none' ; 
            chats.innerHTML = `<h2 id = 'contactName'>${e.currentTarget.title}</h2>` ; 
    
            let user1 = username.innerHTML ; 
            let user2 = contactingPerson ; 

            e.currentTarget.innerHTML = `<h3>${contactingPerson}</h3>` ; 

            if(user1.localeCompare(user2) == -1){
                let temp = user1 ; 
                user1 = user2 ; 
                user2 = temp ; 
            }
            let room_response = await fetch('/getRoomId' , {
                method : 'POST' , 
                headers : {'Content-Type' : 'application/json'} , 
                body : JSON.stringify({user  : user1 })
            }); 
            let room_data = await room_response.json() ; 
            let room_id1 = (room_data[0]._id)  ; 
            room_response = await fetch('/getRoomId' , {
                method : 'POST' , 
                headers : {'Content-Type' : 'application/json'} , 
                body : JSON.stringify({user : user2})
            })
            room_data = await room_response.json() ; 
            let room_id2 = (room_data[0]._id) ; 
            room_id = room_id1 + room_id2 ; 

            socket.emit('join-room' , (room_id)) ; 
            //fetch all the messages from the mongo db and display  ;

            const response = await fetch('/getMessages' , {
                method : 'POST' , 
                headers : {'Content-Type' : 'application/json'} , 
                body : JSON.stringify({sender : contactingPerson , reciever : username.innerHTML}) 
            }) ; 
            const data = await response.json() ; 

            if(data.length == 0 ){
                const empty = document.createElement('p') ; 
                empty.setAttribute('id', 'empty') ; 
                empty.classList.add('empty') ; 
                empty.innerHTML = "No messages yet , start your conversation"  ; 
                chats.appendChild(empty) ;
            }
            
    
            for(let i = 0 ; i < data.length ; i++){
                const sendMsgDiv = document.createElement('div') ; 
                if(data[i].sender == username.innerHTML){
                    sendMsgDiv.classList.add('send-message') ; 
                    sendMsgDiv.innerHTML = `<div class="chat-wrapper">
                    <p> ${data[i].message} </p>
                </div>` ; 
                }
                else{
                    sendMsgDiv.classList.add('recieve-message') ; 
                    sendMsgDiv.innerHTML = `<div class="chat-wrapper">
                    <p> ${data[i].message} </p>
                    </div>` ; 
                }
                chats.appendChild(sendMsgDiv) ; 
            }
    
            $(document).ready(function(){
                $('#chats').animate({scrollTop:1000000} , 800)
            });
    
        }); 
    }    
}


//this section decides whether to re-render the contatcItems 

let contact_arr_response = await fetch('/getUsers' , {
    method : 'POST' , 
    headers : {'Content-Type' : 'application/json'} , 
    body : JSON.stringify({username : username.innerHTML})
}) ; 
let contact_arr = await contact_arr_response.json() ; 

function isSame(arr1 ,arr2 ){
    if(arr1.length != arr2.length) return false ; 
    for(let i = 0 ; i<arr1.length ; i++){
        if(arr1[i] !== arr2[i]) return false ; 
    }
    return true ; 
}



async function searcher(e){
    const searchData = searchBar.value ; 
    const username = document.getElementById('username').innerHTML ; 
    const response = await fetch('/searchBar' , {
        method : 'POST'  , 
        headers : {'Content-Type' : 'application/json'} , 
        body : JSON.stringify({search : searchData , username : username})
    }) ; 
    const data = await response.json() ; 
    contacts.innerHTML = "" ; 
    const contactHeader = document.createElement('h2') ; 
    contactHeader.innerHTML = 'Your Contacts' ; 
    contacts.appendChild(contactHeader) ; 

    if(data.length == 0){
        const noResults = document.createElement('p') ; 
        noResults.classList.add('no-result') ; 
        noResults.innerHTML = 'Sorry , No results Found' ; 
        contacts.appendChild(noResults) ; 
    }
    else if(data[0].username){
        for(let i = 0 ; i<data.length ; i++){
            const contactDiv = document.createElement('div') ; 
            contactDiv.title = data[i].username ; 
            contactDiv.classList.add('contactItem') ; 
            const contactName = document.createElement('h3') ; 
            contactName.innerHTML = data[i].username ; 
            contactDiv.appendChild(contactName) ; 
            contacts.appendChild(contactDiv) ; 
        }
    }
    else{
        //querying again to get all the users that our current user has interacted with 
        const response = await fetch('/getUsers' , {
            method : 'POST'  , 
            headers : {'Content-Type' : 'application/json'} , 
            body : JSON.stringify({username : username}) 
        }) ; 
        const data = await response.json() ; 
        for(let i = 0 ; i < data.length ; i++){
            const contactDiv = document.createElement('div') ; 
            contactDiv.title = data[i]; 
            //const contact =document.createElement('input') ; 
            contactDiv.classList.add('contactItem') ; 
            const contactName = document.createElement('h3') ; 
            contactName.innerHTML = data[i]; 
            contactDiv.appendChild(contactName) ; 
            contacts.appendChild(contactDiv) ;  
        }
    }
    eventAddingFunction() ;  
}

eventAddingFunction() ; 

searchBar.addEventListener('keyup', (e)=>{
    searcher(e) ; 
}) ; 

searchForm.addEventListener('submit' , (e)=>{
    e.preventDefault() ; 
    searcher(e) ; 
} )

const contactItem = document.getElementById('contactItem') ; 


// important event listener 
for(let i = 0 ; i<contactItems.length ; i++){
    contactItems[i].addEventListener('click' , async (e) =>{
        chatSection.style.display = 'block' ; 
        chatAcknowledge.style.display = 'none' ; 
         const ourContact = e.currentTarget.title ; 
         contactName.innerHTML = ourContact ; 
    }); 
}

//function to display and recieve the messages 
function displayMessage(message){
    const empty = document.getElementById('empty')  ; 
    if(empty) empty.style.display = 'none' ; 
    const sendMsgDiv = document.createElement('div') ; 
    sendMsgDiv.classList.add('send-message') ; 
    sendMsgDiv.innerHTML =`<div class="chat-wrapper">
                <p>${message}</p>
                    </div>`
    chats.appendChild(sendMsgDiv) ; 
    $(document).ready(function(){
        $('#chats').animate({scrollTop:1000000} , 800)
    });
   
}

function displayRecieveMessage(message){
    const empty = document.getElementById('empty') ; 
    if(empty) empty.style.display = 'none' ; 
    const sendMsgDiv = document.createElement('div') ; 
    sendMsgDiv.classList.add('recieve-message') ; 
    sendMsgDiv.innerHTML =`<div class="chat-wrapper">
                <p>${message}</p>
                    </div>`
    chats.appendChild(sendMsgDiv) ; 
    $(document).ready(function(){
        $('#chats').animate({scrollTop:1000000} , 800)
    });
}

//important event listenere applied to the default load content 
//const contactItems = document.getElementsByClassName('contactItem') ; 


/// Socket.io codes 
const sendMsg = document.getElementById('sendMsg') ; 
const msg = document.getElementById('msg') ; 
socket.on('connect' , () =>{
    //console.log(`you connected with an id : ${socket.id}`) ; 
    console.log('connected') ; 
}) ; 

sendMsg.addEventListener('submit' , async (e)=>{
    e.preventDefault() ; 
    if(msg.value) socket.emit('send-message' , msg.value , room_id , username.innerHTML , contactingPerson ) ; 
    if(msg.value)displayMessage(msg.value) ; 
    searchBar.value= "" ;
    msg.value = "" ; 

    let data_arr_response = await fetch('/getUsers' , {
        method : 'POST' , 
        headers : {'Content-Type' : 'application/json'} , 
        body : JSON.stringify({username : username.innerHTML})
    }) ; 
    
    let data_arr = await data_arr_response.json() ; 
    if(!isSame(data_arr , contact_arr)){
        contacts.innerHTML = "" ; 
        const contactHeader = document.createElement('h2') ; 
        contactHeader.innerHTML = 'Your Contacts' ; 
        contacts.appendChild(contactHeader) ; 


        for(let i = 0 ; i < data_arr.length ; i++){
            const contactDiv = document.createElement('div') ; 
            contactDiv.title = data_arr[i]; 
            //const contact =document.createElement('input') ; 
            contactDiv.classList.add('contactItem') ; 
            const contactName = document.createElement('h3') ; 
            contactName.innerHTML = data_arr[i]; 
            contactDiv.appendChild(contactName) ; 
            contacts.appendChild(contactDiv) ;  
        }
        eventAddingFunction() ; 
        contact_arr = data_arr ; 
    }
}); 

socket.on('recieve-message' , (message , sender , reciever)=>{
        
    
    if(contactingPerson == sender) displayRecieveMessage(message) ;
    
}); 

socket.on('notify' , (sender , reciever) =>{
    if(reciever == username.innerHTML){
        if(contactingPerson != sender){
            let isContact = false ; 
            let position = 0 ; 
            for(let i =  0;  i<contact_arr.length ; i++){
                if(contact_arr[i] === sender ){
                    isContact = true ; 
                    position = i ; 
                }
            }
        
            if(!isContact){
                contact_arr.push(sender) ;  
                for(let i = contact_arr.length - 1 ; i>=1 ; i--) contact_arr[i] = contact_arr[i-1] ; 
                contact_arr[0] = sender ; 
                contacts.innerHTML = "" ; 
            }
            else{
                for(let i = position ; i>=1 ; i--) contact_arr[i] = contact_arr[i-1] ;  
                contact_arr[0] = sender ; 
            }

            contacts.innerHTML = "" ; 
            const contactHeader = document.createElement('h2') ; 
            contactHeader.innerHTML = 'Your Contacts' ; 
            contacts.appendChild(contactHeader) ; 

            for(let i = 0 ; i < contact_arr.length ; i++){
                const contactDiv = document.createElement('div') ; 
                contactDiv.title = contact_arr[i]; 
                //const contact =document.createElement('input') ; 
                contactDiv.classList.add('contactItem') ; 
                const contactName = document.createElement('h3') ; 
                contactName.innerHTML = contact_arr[i]; 
                contactDiv.appendChild(contactName) ; 
                contacts.appendChild(contactDiv) ;  
            }
            
                eventAddingFunction() ; 

            const render_postion = document.getElementsByClassName('contactItem') ; 
            render_postion[0].innerHTML+='<i class = \'sent-message\'>Sent you a message</i>' ; 
        }
    }
}) ; 


