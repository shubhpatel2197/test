const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.DBURL;
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