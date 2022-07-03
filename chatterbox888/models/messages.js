const mongoose = require ('mongoose') ; 
const schema = mongoose.Schema ; 


const messagesSchema = new schema({
    sender :{
        type : String , 
        required : true 
    } , 
    reciever :{
        type : String , 
        required : true 
    } , 
    message :{
        type : String , 
        required : true  
    } , 
    time :{
        type : Date , 
        required : true  
    }
}) ; 



const messages = mongoose.model('messages' , messagesSchema) ;

module.exports = messages ; 
