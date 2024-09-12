const mongoose=require('mongoose');
require('dotenv').config();
const mongoURL=process.env.local_url;

// const mongoURL=process.env.db_url;
mongoose.connect(mongoURL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('connected to mongo db server ');
});

db.on('error',(err)=>{
    console.log('not connected to mongo db server ');
});

db.on('disconnected',()=>{
    console.log('Disconnected to mongo db server ');
})

module.exports=db;