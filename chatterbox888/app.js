//Utility modules 
const _ = require('lodash'); 

// Setting up express.js server and ejs template engine 

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on('connect', (socket) => {
    socket.on('send-message' , async (Message, room  , Sender , Reciever) =>{
        if(room && Message){

            const msg = new messages({
                sender : Sender ,
                reciever : Reciever , 
                message : Message , 
                time : new Date()  
            }); 
            msg.save().then(() =>{
                console.log('message Sent') ; 
            }).catch((err) => console.log(err)) ; 
            io.emit('notify' , Sender , Reciever) ; 
            socket.to(room).emit('recieve-message' , Message , Sender , Reciever); 

            
        }
        
    })
    socket.on('join-room' , (room) =>{
        socket.join(room) ; 
    })
});

httpServer.listen(process.env.PORT || 3000);
const bodyParser = require('body-parser') ; 
app.set('view engine' , 'ejs') ; 
app.use(express.static('public')) ; 
app.use(express.urlencoded({extended:true})) ;  
//app.use(bodyParser()) ; 
//this body parser is to get post data from the front end 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// the express and ejs setup code ends here 

//Code for setting up the mongoDb and Sessions starts here 
const mongoose = require('mongoose') ; 
//mongodb://127.0.0.1:27017/chatterBox
// mongoose.connect('mongodb+srv://sourav888:nrYD9NSQwX7ylbK8@bluecloud.gbx7e.mongodb.net/chatterBox?retryWrites=true&w=majority' , {
//     useNewUrlParser : true , 
//     useUnifiedTopology : true  
// }) ; 
mongoose.connect('mongodb://127.0.0.1:27017/chatterBox' , {
    useNewUrlParser : true , 
    useUnifiedTopology : true  
}) ; 
//catching errors for db connection 
const db = mongoose.connection ; 
db.on('error' , (err) => console.log(err)) ; 
db.once('open' , () => console.log('db connected!')) ; 

//MongoDb models 
const User = require('./models/user') ; 
const messages = require('./models/messages') ; 

//setting up the session 
const session = require('express-session') ; 
const { receiveMessageOnPort } = require("worker_threads");
const mongodbSession = require('connect-mongodb-session')(session) ; 
//uri : 'mongodb://127.0.0.1:27017/chatterBox'
const store = new mongodbSession({
    uri : 'mongodb+srv://sourav888:nrYD9NSQwX7ylbK8@bluecloud.gbx7e.mongodb.net/chatterBox?retryWrites=true&w=majority' , 
    collection : 'mySessions' , 
});
//creating the session  
app.use(session({
    secret : 'secsauce' , 
    resave : false ,  
    saveUninitialized : false ,
    store : store  
}));





//Middleware to check if someone has already logged in 
const isAuth = (req,  res, next)=>{
    if(req.session.isAuth){
        next() ; 
    }
    else{
        res.redirect('/') ; 
    }
}


//Code for setting up the mongoDb and Sessions ends here 

//Get requests 
app.get('/' , (req, res) =>{
    if(req.session.isAuth == true){
        res.redirect('/chat') ; 
    }
    else{
        res.render('login' , {title : 'Login Page'}) ; 
    }
    
}); 
app.get('/chat' , isAuth ,  async (req , res)=>{
    //const data = await messages.find({sender : req.session.username}) ; 
    const data = await messages.find({ $or : [{sender : req.session.username} , {reciever : req.session.username}] }).sort({time : -1}) ; 
    let arr = [] ; 
    for(let i = 0 ; i< data.length ; i++){
        if(data[i].reciever == req.session.username) arr.push(data[i].sender) ; 
        else arr.push(data[i].reciever) ; 
    }
    arr = _.uniq(arr) ; 
    res.render('chat' , {username : req.session.username , body : arr}) ; 
}); 

//POST requests 
//Code for registering the account
app.post('/register' , (req , res) =>{
    const newuser = new User(req.body) ; 

    newuser.save()
    .then(() => { res.send({registered : true })})
    .catch((err) => console.log(err)) ; 
}) ; 

app.post('/signUpAuth' , async (req , res) =>{
    const username =req.body.name ; 
    const search = await User.find({username : `${username}`}) ; 
    res.send(search) ;   
}) ; 

//Code for login validation 
app.post('/login' , async (req , res) =>{

    const username = req.body.username ;
    const pass = req.body.password ; 
    const search = await User.find({username : `${username}`}) ; 

    if(search.length == 0){
        res.send({ok : false , reason : 'Username not in Database' }) ; 
    }
    else{
        if(pass == search[0].password){
            res.send({ok : true , reason : 'success'}) ; 
        }
        else{
            res.send({ok : false , reason : 'Password Does not match'}) ; 
        }
    }
}); 

//Code for setting up the session once login validation is okay..
app.post('/loginSession' , (req , res)=>{
    const username = req.body.username  ; 
    const password = req.body.password ; 

    req.session.isAuth = true ; 
    req.session.username = username ; 
    res.send({ok : true}) ; 
}); 

//code for logout 
app.post('/logout' , (req, res) =>{
    req.session.destroy((err)=>{
        if(err) throw err ; 
        res.redirect('/') ; 
    }); 
} );

//Code for getting the data for livesearch 
app.post('/searchBar' , async (req , res)=>{
    const search = req.body.search ; 
    const user = req.body.username ; 
    if(search){
        const data = await User.find({username : {$regex : new RegExp('^' + search + '.*' , 'i')} }) ;
        res.send(data) ; 
    }
    else{
        const data = await messages.find( {sender : user }) ; 
        res.send(data) ; 
    }
});

app.post('/getUsers' , async(req , res) =>{
    const search = req.body.username ; 
    //const data = await messages.find({sender : `${search}`}) ; 
    const data = await messages.find({$or : [{sender : `${search}`} , {reciever : `${search}`}]}).sort({time : -1}) ; 
    let arr = [] ; 
    for(let i = 0 ; i < data.length ; i++){
        if(data[i].reciever == req.session.username) arr.push(data[i].sender) ; 
        else arr.push(data[i].reciever)
    }
    arr = _.uniq(arr) ; 
    res.send(arr) ; 
}); 

app.post('/getMessages' ,  async (req , res) =>{

    const sender = req.body.sender ;
    const reciever = req.body.reciever ; 

    //const search = await messages.find({sender : `${sender}` , reciever : `${reciever}`}) ; 
    const search = await messages.find(
        { $or : [{ sender : `${sender}` , reciever : `${reciever}` } , {sender : `${reciever}` , reciever : `${sender}` }]}
    ).sort({time : 1}) ; 
    res.send(search) ; 
})

app.post('/getRoomId' , async (req,res)=>{

    let user = req.body.user ; 
    user.trim()  ;
    const data = await User.find({username : user}) ; 
    res.send(data)  ;
})


  