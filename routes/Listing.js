const express = require('express')
const router = express.Router();

router.get("/listing",(req,res)=>
{
    //res.send("Hello")
    res.render("listings")
   
}); 
module.exports=router;