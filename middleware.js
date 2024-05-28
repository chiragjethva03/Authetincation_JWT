const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");  

module.exports.requireAuthentication = (req, res, next) => {
    console.log('Headers:', req.headers.cookie);
    const token = req.cookie.jwt;
    console.log(token);
    if(token){
        jwt.verify(token, "veryTopSecret", (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
                next();
            } else {
                console.log(decodedToken);
                next();
            }
        }); 
    }
    else{
        res.redirect("/login");
    }
    console.log(token);
    next();
}







