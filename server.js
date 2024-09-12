const express=require('express');
const app=express();
const db=require('./db');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
const {jwtMiddleware,generatetoken}=require('./jwt.js');
require('dotenv').config();
const Port=process.env.Port || 3000;
//user routes
const userroutes=require('./routes/userroutes.js');
app.use('/user',userroutes);
//candidate routes
const candidateroutes=require('./routes/candidateroutes.js');
app.use('/candidate',candidateroutes);
app.listen(Port,()=>{
    console.log("we are listening on port 3000");
})