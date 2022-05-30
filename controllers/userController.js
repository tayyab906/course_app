const jwt = require("jsonwebtoken");
const userModule = require('../models/User');


var checkUserAuth = async(req,res, next) => {
    let token ;
    const { authorization } = req.headers
    if(authorization && authorization.startswith('Bearer')){
        try{

            token = authorization.split('')[1]

            // verify token
            const {userId} = jwt.verify(token, process.env.JWT_S_K)
            req.user = await userModule.findById(userId).select('-password');
            next()

        } catch(err){
            res.status(401).send({"status": "faild"})

        }
    }
}


module.exports = checkUserAuth;