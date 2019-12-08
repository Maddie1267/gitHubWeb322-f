const express = require('express')
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth")
const sendgrid = require('@sendgrid/mail');

router.get('/registeration',(req,res)=>
{
    //res.send("Hello")syy
    res.render('task/register')
   
});

router.post('/registeration',(req,res)=> {
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
    
        res.render("task/register",
        {
           error:errors 
        })
    }  
    else
    {
        const loginData = {
            eMail : req.body.email,
            firstName : req.body.fname,
            lastName : req.body.lname,
            password : req.body.pword
        }
        const saveLogin = new User(loginData);
        saveLogin.save()
        .then(()=>{
            const msg = {
                to: loginData.eMail,
                from: 'madeline.allinson@hotmail.com',
                subject: "Welcome To MaddieBnB",
                text: "Hello!",
                html: "Thanks for Joining! Finding a place to stay is easy with MaddieBnB"
              }
              sendgrid.send(msg).catch(err=>console.log(err))
              //   res.redirect('/');
            //  valid.push(`Success! Welcome ${req.body.fname}`)
              res.redirect("/user/login"); 
            //  {
               //  register:valid 
              //})
        })
        .catch(err=>{
            console.log(err);
            errors.push("Email already in use");
            res.render("task/register",
            {
                error:errors
            })

        })
    }
    
    
    });
    
router.get('/profile', auth, (req, res)=>{
    res.render('user/profile')
})

router.get('/dashboard/:id', auth, (req, res)=>{
    User.findById(req.params.id)
    .then(task=>{ 
       // if (task.Status == "Admin"){
       // res.render('task/adminDashboard'),{
         //   userInfo: task
      //  }}
       // else{
            res.render(`task/dashboard`),{
                userInfo: task
            }
       // }
    })
    
})

module.exports = router;