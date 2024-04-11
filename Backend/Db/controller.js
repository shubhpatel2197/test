const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = "mongodb+srv://raj21032003:1234@cluster0.wgonutm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
function fire(){
    mongoose.connect(url)
    .then(()=>{
        console.log("connected")  
    })
    .catch((err)=>{
        console.log(err)
        console.log("not connected")
        
    });
}
fire();

module.exports = fire;