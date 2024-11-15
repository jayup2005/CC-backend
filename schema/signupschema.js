const mongoose = require('mongoose')

const user_schema = {
    Name:{
        type: String,
        required:true,
       
        
    },
    Contact:{
        type: String,
        required:true
    },
    SAP:{
        type: String,
        required:true
    },
    Email:{
        type: String,
        required:true
    },
    Password:{
        type: String,
        required: true
     
    }
}

const users_data = mongoose.model('User Data',user_schema);

module.exports = users_data;