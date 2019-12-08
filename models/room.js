const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const roomSchema = new Schema({
    roomName : String,
    roomPrice: Number,
    roomDesc : String,
    roomLocation : String,
    roomPic : String
})


const Room = mongoose.model('Room', roomSchema);
module.exports=Room;