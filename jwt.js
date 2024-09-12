const jwt=require('jsonwebtoken');


const jwtMiddleware=function(req,res,next){

    const authorization=req.headers.authorization;
    if(!authorization) return res.status(401).json({err:"Token not found"});;
    const token=req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({err:"Unauthorized"});
    try{
        const jwtauth=jwt.verify(token,process.env.JWT_SECRET);
        req.user=jwtauth;
        next();
    }
    catch(err){
        console.log(err+" Invalid token");
        res.status(401).json({err:"Invalid token"});
    }
}

const generatetoken = (userdata) => {
    return jwt.sign(userdata, process.env.JWT_SECRET, { expiresIn:'12h' });
};


module.exports=({jwtMiddleware,generatetoken});