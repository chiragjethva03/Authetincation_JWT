const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash"); 
const userRouter = require("./routes/user.js");
const resultRouter = require("./routes/result.js");
const jwt = require("jsonwebtoken");
const methodOverride = require("method-override");
const requireAuthentication = require("./middleware.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// app.use(requireAuthentication());


//store session 
const sessionOption = {
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

//for flash message
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//Routers
app.use("/", userRouter);
app.use("/", resultRouter)

app.get("/", (req, res) => {
    const user = req.session.cookie;
    res.render("index.ejs", {user});    
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server start on port number ${PORT}`);
});