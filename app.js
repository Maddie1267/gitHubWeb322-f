const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const sendgrid = require('@sendgrid/mail');

require("dotenv").config({path:'./config/keys.env'});

const userRoutes = require("./routes/User");
const listingRoutes = require("./routes/Listing");
const generalRoutes = require("./routes/General");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true,  cookie: { secure: true }}));
app.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/listing",listingRoutes);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


const PORT = process.env.PORT || 3000;

let date = new Date;
let f_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() 
// Set up Mongoose and Sendgrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
pass = process.env.MONGO_DB_PASSWORD
user = process.env.MONGO_DB_USERNAME
mongo_key = process.env.MONGO_DB_KEY
let key = `mongodb+srv://${user}:${pass}${mongo_key}`;
mongoose.connect(key, {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log(`Connection to database successful`);
})
.catch((err)=>{
    console.log(`ERROR: ${err}`);
})
app.get("/",(req,res)=>
{
    //res.send("Hello")
    res.render("home")

}); 
app.post("/",(req,res)=>{
    const errors =[];    
    if (req.body.checkIn < f_date){
        errors.push("Invalid Checkin!");
    }
    if (req.body.checkOut <= req.body.checkIn){
        errors.push("Invalid Checkout!");
    }
    if(errors.length >= 1 ){

        res.render("home",{
            error: errors,
        })
    }
    else {
        res.redirect("/listing")
    }   
})

//
app.listen(PORT, ()=>{
    console.log("Connected");
})