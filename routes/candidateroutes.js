const express=require('express');
const router=express.Router();
const User=require('./../models/user.js');
const Candidate=require('./../models/candidate.js');
const {jwtMiddleware,generatetoken}=require('./../jwt.js');

const checkRole=async(userId)=>{
    try{
        console.log("User fetched: ", userId);
        const user=await User.findById(userId);
        console.log("User fetched: ", user);
        if(user && user.Role=='Admin'){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

router.post('/',jwtMiddleware,async(req,res)=>{
    
    try{
        if (!(await checkRole(req.user.id))) {
            return res.status(403).json({ message: "You are not an Admin" });
        }
        

        const data=req.body;
        const newCandidate=Candidate(data);
        const response= await newCandidate.save();
        console.log('Data saved');
        
        res.status(200).json({response:response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
    
});


router.put('/:candidateId',jwtMiddleware,async(req,res)=>{
    try{
        if (!(await checkRole(req.user.id))) {
            return res.status(403).json({ message: "You are not an Admin" });
        }
        
        const candidateId=req.params.candidateId;
        const updateddata=req.body;
        
        const response= await Candidate.findByIdAndUpdate(candidateId,updateddata);
        if(!response){
        
            return res.status(404).json({error:"Candidate not found "});
        }
        console.log("data is updataed");
        res.status(200).json({response});


    }
    catch(err){
        console.log("error occur in this "+err);
        res.status(500).json({err:"Internal server error "});
    }
})

router.delete('/:candidateId',jwtMiddleware,async(req,res)=>{
    try{
        if (!(await checkRole(req.user.id))) {
            return res.status(403).json({ message: "You are not an Admin" });
        }
        const deleteid=req.params.candidateId;
        const response=await Candidate.findByIdAndDelete(deleteid);
            
        
        if(!response){
            return res.status(404).json({error:"candidate not found"});
        }
        console.log("candidate deleted successfully");
        res.status(200).json({response});
    }
    catch(err){
        console.log("error occur in this "+err);
        res.status(500).json({err:"Internal server error "});
    }
})

// start  voting
router.post('/vote/:candidateid',jwtMiddleware,async(req,res)=>{
   const candidateId=req.params.candidateid;
   const userid=req.user.id;
    try{
        const candidate= await Candidate.findById(candidateId);
        if(!candidate){
           return res.status(400).json({meassage:"candidate not found"});
        }

        const user=await User.findById(userid);
        if(!user){
           return  res.status(400).json({meassage:"user not found"});
        }

        if(user.isVoted){
            return res.status(400).json({message:"You are already voted"});
        }
        if(user.Role=='Admin'){
           return res.status(403).json({message:"You are not allowed"});
        }
      // Candidate updated
        candidate.Votes.push({user:userid});
        candidate.votecount++;
        await candidate.save();

    // user updated
     user.isVoted=true;
     await user.save();
     //voted
     res.status(200).json({message:"Your vote is registered"});





    }
    catch(err){
        console.log("error occur in this "+err);
        res.status(500).json({err:"Internal server error "});
    }
})

//vote count
router.get('/vote/count',async(req,res)=>{
    try{
        const candidatelist= await Candidate.find().sort({voteCount:'desc'});
        const voterecord=candidatelist.map((data)=>{
            return{
                party:data.Party,
                NumberofVotes:data.votecount
            }
        })
        return res.status(200).json(voterecord);
    }
    catch(err){
        console.log("error occur in this "+err);
        res.status(500).json({err:"Internal server error "});
    }
})

router.get('/candidatelist',async(req,res)=>{
    try{
        const candidatelist=await Candidate.find();
        return res.status(200).json({"List of candidates is ":candidatelist});
    }
    catch(err){
        console.log("error occur in this "+err);
        res.status(500).json({err:"Internal server error "});
    }
})
module.exports=router;
