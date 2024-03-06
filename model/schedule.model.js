const mongoose =require('mongoose');

const scheduleSchema = new mongoose.Schema({
    scheduleId : { type: Number, required: true,unique: true }, 
    programId : { type: Number, required: true},   //programme ID from the Programs collection
    programName : { type: String, required: true}, //programme name from the Programs collection
    dayOfWeek : {type: String , enum: ['monday', 'tuesday','wednesday','thursday','friday','saturday','sunday'],lowerCase : true , trim:true, required: true},
    timeSession : {type: String, required: true},     //morning/afternoon/evening session 
    coach:{type:String ,required:true}//coach who is assigned to this session
});


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;

