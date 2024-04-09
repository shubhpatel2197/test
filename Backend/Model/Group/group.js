const mongoose = require('mongoose');
const group = mongoose.model('group',{
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

});

module.exports = group;