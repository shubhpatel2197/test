require('./Db/controller')
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const CORS = require('cors')
dotenv.config();
const app = express();
const port = process.env.PORT;
const group = require('./Model/Group/group')
const grproute = require('./Routes/groups')
app.use(express.json());
app.use(CORS({
    origin: '*',
}));
app.use(cookieParser());
app.use((req,res,next)=>{
    if(mongoose.connection.readyState==3||mongoose.connection.readyState==0){
    fire();
    next();
    }
    else
    next();
})

app.use(grproute);

app.listen(port,()=>{
    console.log("Server is ON at "+port);
})
module.exports = app;