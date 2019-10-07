const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }))

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
app.post("/registeration",(req,res)=> {


const errors =[];


if 
(req.body.fname=="")
{
    errors[0] = "Please Enter: ";
    errors.push(" • Your first name")
}
if 
(req.body.lname=="")
{
    errors[0] = "Please Enter: ";
    errors.push(" • Your Last name")
}
if 
(req.body.email=="")
{
    errors[0] = "Please Enter: ";
    errors.push(" • Your Email ")
}
if(errors.length > 0)
{

    res.render("register",
    {
       register:errors 
    })
}



});

app.listen("3000", ()=>{
    console.log("Connected");
})
