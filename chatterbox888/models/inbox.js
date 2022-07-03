const mongoose = require ('mongoose') ; 
const schema = mongoose.Schema ; 


const inboxSchema = new schema({
    sender :{
        type : String , 
        required : true 
    } , 
    reciever :{
        type : String , 
        required : true 
    } , 
    time :{
        type : Date , 
        required : true  
    }
}) ; 


const inbox = mongoose.model('inbox' , inboxSchema) ;  

module.exports = inbox ; 