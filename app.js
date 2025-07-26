const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./network/connection');
const { sendResponse } = require('./utils/helpers');
const taskOneRoute = require('./taskOne/route')
const taskTwoRoute = require('./taskTwo/route')
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


connectDB();
app.use('/api', taskOneRoute,taskTwoRoute);

// app.use((err,req,res,next)=>{
//    if(err){
//      sendResponse(res, {message : "Something went wrong,Please try after some time"},500,false)
//    }
// }) 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
