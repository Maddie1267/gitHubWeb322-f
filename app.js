const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const selected = [];
app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }))
let date = new Date;
let f_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() 

app.get("/",(req,res)=>
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

if(errors.length > 1)
{

    res.render("register",
    {
       error:errors 
    })
}  
else
{
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
