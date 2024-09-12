const mongoose=require('mongoose');


const candidateSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    
    Age:{
        type:Number,
        required:true
    },
    Party:{
        type:String,
        required:true
    },
    Votes:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },

        votedAt:{
            type:Date,
            default:Date.now()
        }

    }],

    votecount:{
        type:Number,
        default:0
    }
})

const Candidate=mongoose.model('Candidate',candidateSchema);
module.exports=Candidate;