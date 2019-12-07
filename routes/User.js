const express = require('express')
const router = express.Router();
router.use(express.static('public'));
const path = require("path");
const Register = require("../models/User");
const sendgrid = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
require("dotenv").config({path:'./config/keys.env'});
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
router.get("/registeration",(req,res)=>
{
    //res.send("Hello")syy
    res.render("register")
   
}); 


router.post("/registeration",(req,res)=> {
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
                from: 'madeline.allinson@hotmail.com',
                subject: "Welcome To MaddieBnB",
                text: "Hello!",
                html: "Thanks for Joining! Finding a place to stay is easy with MaddieBnB"
              }
              sendgrid.send(msg).catch(err=>console.log(err))
              //   res.redirect('/');
              valid.push(`Success! Welcome ${req.body.fname}`)
              res.render("register",
              {
                 register:valid 
              })
        })
        .catch(err=>{
            console.log(err);
            errors.push("Email already in use");
            res.render("register",
            {
                error:errors
            })

        })
    }
    
    
    });

router.get("/login",(req,res)=>
{
    //res.send("Hello")
    res.render("home")
    
}); 
router.post("/login",(req,res)=>{
    const errors =[];    
    const formData = {
        email : req.body.l_email,
        password : req.body.l_pword
    }
    console.log(formData);
    Register.findOne({eMail:formData.email})
    .then(s_register=>{
     if(s_register==null){
         errors.push("Please Enter the email You signed up with!")
         
         res.render("home",{
             l_error:errors
             
         })
     }
     else {
         console.log("Valid email");
         bcrypt.compare(formData.password,s_register.password)
         .then(isMatched=>{

            if(isMatched==true)
            {
                //It means that the user is authenticated 
                    //console.log(req.session.firstName)
                //create session
               
               req.session.userInfo=s_register;
    
               console.log(req.session.userInfo);
             res.redirect("/user/profile")
            }

            else
            {
                errors.push("Sorry, your password does not match");
                res.render("home",{
                    l_error:errors
                })
            }

        })

        .catch(err=>console.log(`Error :${err}`));
     }
    })
    if (req.body.l_pword ==""){
        errors.push("Must enter a Password!");
    }
    if (req.body.l_email == "" ){
        errors.push("Please enter your email!");
    }


    if(errors.length >= 1 ){

        res.render("home",{
            l_error: errors,
        })

    }    
    
    

})
router.get("/profile",(req,res)=>
{
    res.render("userDashboard");
});

module.exports=router;