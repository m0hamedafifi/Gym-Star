const express = require('express');
const router = express.Router();
const programsController = require('../controller/programs.controller');
const upload = require('../util/uploadImg');


router.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the Gym Star' });
    });

    // Create a new book
    router.post("/programs/add",upload.single('image') ,programsController.addNewProgram);

    module.exports = router;