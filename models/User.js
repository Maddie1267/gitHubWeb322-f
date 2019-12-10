  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


    const loginSchema = new Schema({
        firstName : String,
        lastName: String,
        eMail:{
            type: String,
            unique: true
        } ,
        password: String,
        Status: {
            type: String,
            default: "User"
        },
        booking: {
            type: Array,
            default: [],

        //DOB: Date
        }
    })

    loginSchema.pre("save",function(next){
  
        bcrypt.genSalt(10)
        .then(salt=>{
            bcrypt.hash(this.password,salt)
            .then(hash=>{
                this.password=hash
                // The below code is a call back function that does the following :
                 //It forces the code of execution to  move onto the next code in the execution queue 
                next();
            })
        })

})


const Register = mongoose.model('Register', loginSchema);
module.exports=Register;
