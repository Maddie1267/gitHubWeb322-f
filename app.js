const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }))
let date = new Date;
let f_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() 
const mongoose = require('mongoose');
const sendgrid = require('@sendgrid/mail');
require("dotenv").config({path:'./config/keys.env'});
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
pass = process.env.MONGO_DB_PASSWORD
user = process.env.MONGO_DB_USERNAME
let key = `mongodb+srv://${user}:${pass}@cluster0-toqlt.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(key, {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log(`Connection to database successful`);
})
.catch((err)=>{
    console.log(`ERROR: ${err}`);
})

const Schema = mongoose.Schema;
    const loginSchema = new Schema({
        firstName : String,
        lastName: String,
        eMail:{
            type: String,
            unique: true
        } ,
        password: String,
        //DOB: Date
    })


    const Register = mongoose.model('Register', loginSchema);

app.get("/",(req,res)=>
{
    //res.send("Hello")
    res.render("home")

}); 
app.get("/login",(req,res)=>
{
    //res.send("Hello")
    res.render("home")
    
}); 
app.get("/registeration",(req,res)=>
{
    //res.send("Hello")
    res.render("register")
   
}); 
app.get("/listing",(req,res)=>
{
    //res.send("Hello")
    res.render("listings")
   
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
app.post("/login",(req,res)=>{
    const errors =[];    
    if (req.body.l_pword ==""){
        errors.push("Must enter a Password!");
    }
    if (req.body.l_email == ""){
        errors.push("Please enter your email!");
    }

    if(errors.length >= 1 ){

        res.render("home",{
            l_error: errors,
        })

    }    
    

})
app.post("/registeration",(req,res)=> {
const errors =[];
const valid =[];
errors[0] = "Please Enter: ";
if 
(req.body.fname=="")
{
    
    errors.push(" • Your First name")
}
if 
(req.body.lname=="")
{
    errors.push("• Your Last name")
}
if 
(req.body.email=="")
{
    
    errors.push("• Your Email ")
}
if 
(req.body.pword == "")
{
    errors.push("• A valid Password")
} 
if(req.body.pword.length < 8)
{
    errors.push("Password must be minimum 8 Characters")
}
let validCheck = /[!@#$^&*]/;
if(!(req.body.pword.match(validCheck))){
        errors.push("Password MUST contain a special character only \"!@#$%^&*\" are valid");
    
} 

if(errors.length > 1)
{

    res.render("register",
    {
       error:errors 
    })
}  
else
{
    const w_register = {
        eMail : req.body.email,
        firstName : req.body.fname,
        lastName : req.body.lname,
        password : req.body.pword
    }
    const s_register = new Register(w_register);
    s_register.save()
    .then(()=>{
        const msg = {
            to: w_register.eMail,
            from: 'mallinson@myseneca.ca',
            subject: 'Welcome To MaddieBnB',
            text: '',
            html: 'Thanks for Joining! Finding a place to stay is easy with MaddieBnB',
          }
          sendgrid.send(msg)
       //   res.redirect('/');
    })
    valid.push(`Success! Welcome ${req.body.fname}`)
    res.render("register",
    {
       register:valid 
    })
}


});

app.listen(PORT, ()=>{
    console.log("Connected");
})
