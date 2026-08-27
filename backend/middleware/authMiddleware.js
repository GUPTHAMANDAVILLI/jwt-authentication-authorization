const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    
    const authHeader = req.headers.authorization
    console.log(authHeader)
    const token = authHeader.split(" ")[1];
    console.log(token)
    if(!token){
        return res.send('un-authorized request')
    }
    try{const decoded=jwt.verify(
        token,
        process.env.JWT_SECRETKEY
    )
    req.user=decoded}
    catch(err)
    {
        return res.send('un-authorized user')
    }
    next()
    
}
module.exports = authMiddleware