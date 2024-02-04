
const Program = require('../model/programs.model');
var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(require.main.filename);



exports.addNewProgram = async(req,res)=>{
try {
    let obj = {
        name: req.body.name,
        title: req.body.title,
        description : req.body.description,
        images: '/uploads/' + req.file.filename ,
        id : req.body.id
    };
    let newPrograms = new Program (obj);  //create a new instance of the model with data from req.body
    let data =  await newPrograms.save();   // save that new instance to the database and return it as a promise
    res.status(201).send({status:true,message:'program added Successfully',results:data})

} catch (err) {
    console.log("internal error server : ",err.message);
        res.status(400).send({ status: false, message: 'Failed ty add new program' });
}
};