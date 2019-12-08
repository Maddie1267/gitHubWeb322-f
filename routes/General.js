const express = require('express')
const router = express.Router();
const citySelect = [];
let date = new Date;
let f_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() 
router.get('/', (req, res)=>{
    res.render('home')
})
router.get("/listing",(req,res)=>
{
    if(citySelect == "Toronto"){
        res.render('task/listing', {
            Toronto: true,
            city: citySelect
        })
    } else if(citySelect == "Hamilton"){
        res.render('task/listing', {
            Hamilton: true,
            city: citySelect
        })
    }else if(citySelect == "Muskoka"){
        res.render('task/listing', {
            Muskoka: true,
            city: citySelect
        })
    }else if(citySelect == "Ottawa"){
        res.render('task/listing', {
            Ottawa: true,
            city: citySelect
        })
    } 
    else
    res.render('task/listing', {
        empty: true
    })
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

        res.redirect("/listing")
    }   
})



module.exports=router;