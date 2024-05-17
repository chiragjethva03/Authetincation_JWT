const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Register = require("./models/signup.js");
const session = require("express-session");
const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const flash = require("connect-flash"); 
const bcrypt = require("bcrypt");
// const { requireAuth } = require("./middleware/middleware.js");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
            } else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect("/login");
    }
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));


const sessionOption = {
    // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}


main()
    .then(() => {
        console.log("connections Established");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/jwt_authentication');
}

//for the cookie passing 
app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const maxAge = 2 * 30 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn: maxAge
    });
}


app.get("/registration", (req, res) => {
    res.render("registration.ejs");
});

app.post("/registration", async (req, res) => {
    let {username, email, password} = req.body;
    try{
        let existingUser = await Register.findOne({username: username, email: email});
        if(existingUser){
            req.flash("error", "that user can already register please try to Login")
            console.log("user can alredy register");
            return res.redirect("/login");
        }
        let user = await Register.create({username, email, password});  
        const token = createToken(Register._id);
        res.cookie(username, token, { httpOnly: true, maxAge: maxAge * 1000});
        res.redirect("/login");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Register.findOne({ email: email });
        if (!user) {
            req.flash("error", "User not found. Please register first");
            return res.redirect('/registration'); 
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password.');
            req.flash("error", "Invalid fields");
            return res.redirect('/login'); 
        }

        const token = createToken(Register._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000});
        console.log('Login successful.');
        return res.redirect('/');
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send('Internal server error');
    }
});

app.get("/", requireAuth, (req, res) => {
    const user = req.session;
    console.log(user);
    res.render("index.ejs", {user: user}); 
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server start on port number ${PORT}`);
});