const express = require('express')
const router = express.Router();
const user = require('../schema/signupschema');

const mongoose = require('mongoose');
const zod = require('zod')


router.post('/',async (req,res)=>{
    const data = req.body;
    let new_data = "";
    try{
        new_data = new user(data);
        await new_data.save();
        res.send(new_data)
        console.log(new_data);
    }
    catch (err) {

        console.error('Error saving user:', err);
        res.status(500).json({
            msg: "Internal Server Error",
            error: err.message
        });
    }
})

module.exports = router
