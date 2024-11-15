const user = require('../schema/signupschema')
const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
require('dotenv').config();


const key = process.env.JWT_SECRET;

router.post('/',async (req,res)=>{
    const data = req.body;
    console.log(data)
    try{
        const response = await user.find(data)
        if(response.length === 0){
            res.status(404).json({
                msg:'User not found'
            })
        }
        else{
            const token = jwt.sign(data,key);
            res.send(token);
            console.log(token);
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            msg:'Server error'
        })
    }

})

module.exports = router;