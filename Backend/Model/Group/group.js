const mongoose = require('mongoose');
const gs = new mongoose.Schema({
    maxLimit:{
        type: Number,
        required:true,
    },
    avatar:[
        {
            url:{
            type: String
            }
        }
    ],
    name:[
        {
            username:{
                type: String,
            }
        }
    ],
    gid:{
        type:String
    },
    language:{
        type: String,
        required: false
    },
    level:{
        type: String,
        required: false
    },
    info:{
        type: String,
        required: false
    }
    

},{ timestamps: true })

const group = mongoose.model('group',gs);

module.exports = group;