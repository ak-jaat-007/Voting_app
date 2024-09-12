const express=require('express');
const router=express.Router();
const User=require('./../models/user.js');
const {jwtMiddleware,generatetoken}=require('./../jwt.js');

//User signup page
router.post('/signup',async(req,res)=>{
    
    try{
        const data=req.body;
        const newUser=User(data);
        const response= await newUser.save();
        console.log("successfull ");
        const payload={
            id:response.id
        }
        console.log("your payload is :"+JSON.stringify(payload));
        const token=generatetoken(payload);
        console.log("your generated token is: "+token);
        res.status(200).json({response:response,token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
    
});

//login page for user
router.post('/login',async(req,res)=>{
    try{
        const {Addhar_id,Password}=req.body;
        const user=await User.findOne({aadhar_id:Aadhar_id});
        const pass= await user.comparePassword(Password,user.Password);
        if(!user){
           return  res.status(400).json({err:"Either your username or password is incorrect"});
        }
       const payload={
           id:user.id,
           
       }
       //creating token for user
       const token= generatetoken(payload);
       res.status(200).json({token});

    }
    catch(err){
        console.log("error is: "+err);
        res.status(404).json({err:"Your are not a valid user"});
    }
})

// Get your profile 
router.get('/profile',jwtMiddleware,async(req,res)=>{
    try{
        const userdata=req.user;
        const userid=userdata.id;
        const user=await User.findById(userid);
        res.status(200).json({user});
    }
    catch(err){
        console.log(err+" user not found");
        res.status(400).json({err:" user not found"})
    }
})

// User have option to change his password

router.put('/user/password', jwtMiddleware, async (req, res) => {
    try {
        const userid = req.user.id;  // Get the user ID from JWT
        const { currentpassword, newpassword } = req.body;

        // Find the user by ID
        const user = await User.findById(userid);

        // Check if the current password matches
        if (!(await user.comparePassword(currentpassword))) {
            return res.status(400).json({ err: "Invalid current password" });
        }

        // Hash the new password before saving it
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        // Update user's password and save
        user.Password = hashedPassword;
        await user.save();

        console.log("Password is updated");
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.log("Error occurred: " + err);
        res.status(500).json({ err: "Internal server error" });
    }
});



module.exports=router;
