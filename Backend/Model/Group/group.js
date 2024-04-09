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
    language:{
        type: String,
        required: true

    },
    level:{
        type: String,
        required: true
    },
    info:{
        type: String,
        required: true
    }
    

},{ timestamps: true })

const group = mongoose.model('group',gs);

module.exports = group;