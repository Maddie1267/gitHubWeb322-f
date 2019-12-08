const express = require('express')
const router = express.Router();
const User = require("../models/User");
const Room = require('../models/room')
const citySelect = [];

let date = new Date;
let f_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() 
const path = require("path");
const auth = require("../middleware/auth")
const sendgrid = require('@sendgrid/mail');
router.get('/', (req, res)=>{
    res.render('home')
})
router.post("/",(req,res)=>{
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
        citySelect.pop();
        citySelect.push(`${req.body.c_city}`)

        res.redirect("/task/listing")
    }   
})
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

router.get('/dashboard', auth, (req, res)=>{
    User.findById(req.session.userInfo._id)
    .then(task=>{ 
        if (task.Status == "Admin"){
        res.render('task/adminDashboard'),{
            userInfo: task
        }}
        else{
            res.render(`task/dashboard`),{
                userInfo: task
            }
        }
    })
    
})
router.get('/add',auth,(req,res)=>{
    if(req.session.userInfo.Status == "Admin"){
        res.render('task/addForm')
    }
})
router.post('/add',auth,(req,res)=>{
    const errors = [];
    
    const roomInfo = {
        roomName: req.body.roomName,
        roomPrice: req.body.roomPrice,
        roomDesc: req.body.roomDesc,
        roomLocation: req.body.roomLocation
    };
    if (req.files==null){
        errors.push("Upload a picture!")
    }

    if(errors.length > 0)
    {
        res.render("task/addForm",{
            errors:errors
        })
    }
else{
    const addRoom = new Room(roomInfo)
    addRoom.save({validateBeforeSave: true})
    .then(()=>{
        console.log(`${req.files.roomPic.name}`);
        console.log(`${req.files.roomPic}`);
        req.files.roomPic.name = `pic_${req.files.roomPic.name}`
        req.files.roomPic.mv(`public/img/${req.files.roomPic.name}`)
        console.log(`${roomInfo.roomName} Saved!`)
        res.redirect(`/task/dashboard`)
    })
    .catch(err=> console.log(err))
}
})

router.get("/listing",(req,res)=>
{
    Room.find()
    .then((addRoom)=>{
    if(citySelect == "Toronto"){
        res.render('task/listing', {
            Toronto: true,
            city: citySelect
            roomList :addRoom
        })
    } else if(citySelect == "Hamilton"){
        res.render('task/listing', {
            Hamilton: true,
            city: citySelect,
            roomList:addRoom
        })
    }else if(citySelect == "Muskoka"){
        res.render('task/listing', {
            Muskoka: true,
            city: citySelect,
            roomList:addRoom
        })
    }else if(citySelect == "Ottawa"){
        res.render('task/listing', {
            Ottawa: true,
            city: citySelect,
            roomList :addRoom
        })
    } 
    else
    res.render('task/listing', {
        empty: true
    })
})
})


module.exports = router;