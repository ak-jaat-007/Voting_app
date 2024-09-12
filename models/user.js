const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({

    Name:{
        type:String,
        required:true
    },
    
    Age:{
        type:Number,
        required:true
    },
    
    Aadhar_id:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);  // Regular expression to check if it's 12 digits
            },
            message: props => `${props.value} is not a valid 12-digit Aadhar ID!`
        }
    },
    
    Mobile:{
        type:String,
        required:true
    },
    
    Email:{
        type:String,
        
    },
    Address:{
        type:String,
        required:true
    },
    
    Password:{
        type:String,
        required:true
    },
    
    Role:{
        type:String,
        enum:['Voter','Admin'],
        default:'Voter'
    },
    
    isVoted:{
        type:Boolean,
        default:false
    },
})
userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('Password')) return next();
    try{
     const salt= await bcrypt.genSalt(10);
     const hashPassword=await bcrypt.hash(user.Password,salt);
      user.Password=hashPassword;
      next();
     
    }
    catch(err){
     next(err);
    }
 })
 
 userSchema.methods.comparePassword=async function(candidatePassword){
     try{
         const isMatch= await bcrypt.compare(candidatePassword,this.Password);
         return isMatch;
 
     }
     catch(err){
         throw err;
     }
 }
 

const User=mongoose.model('User',userSchema);
module.exports=User;