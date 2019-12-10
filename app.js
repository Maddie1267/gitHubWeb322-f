const express = require('express');
const exphbs = require('express-handlebars');
var helpers = require('handlebars-helpers')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const sendgrid = require('@sendgrid/mail');
const fileupload = require("express-fileupload");
const methodOverride = require ("method-override")
require("dotenv").config({path:'./config/keys.env'});

const userRoutes = require("./routes/User");
const taskRoutes = require("./routes/task");
const generalRoutes = require("./routes/task");

const app = express();

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileupload())

app.use(session({secret: 'ssshhhhh'}));
app.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/task",taskRoutes);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


const PORT = process.env.PORT || 3000;


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



//
app.listen(PORT, ()=>{
    console.log("Connected");
})