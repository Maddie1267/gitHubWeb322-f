  
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/login",(req,res)=>
{
    //res.send("Hello")
    res.render("user/login")
    
}); 
router.post("/login",(req,res)=>{
    const errors =[];    
    const formData = {
        email : req.body.l_email,
        password : req.body.l_pword
    }
    console.log(formData);
    User.findOne({eMail:formData.email})
    .then(user=>{
     if(user==null){
         errors.push("No account associated with that email!")
         
         res.render("user/login",{
             l_error:errors
             
         })
     }
     else {
         //console.log("Valid email");
         bcrypt.compare(formData.password,user.password)
         .then(isMatched=>{

            if(isMatched==true)
            {
               
                //It means that the user is authenticated 
                    //console.log(req.session.firstName)
                //create session
               req.session.userInfo=user;
                console.log("ismatched");
            console.log(req.session.userInfo);
             res.redirect("/task/profile")
            }

            else
            {
                errors.push("Incorrect Password! Try again");
                res.render("user/login",{
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

        res.render("user/login",{
            error: errors,
        })

    }    
    
    

})
router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/user/login");
})

module.exports=router;