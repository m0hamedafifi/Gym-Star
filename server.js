const express = require('express')
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require('cors');
const dbConnection = require('./db/connection');
const programRouter = require('./router/programs.route');
const userRouter = require('./router/users.route');
const exerciseRouter = require('./router/exercises.route');
const scheduleRouter = require('./router/schedule.route');

// const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

dotenv.config();
// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: "dphrkslty",
    api_key: "168239894649389",
    api_secret: "7Pqk54H1qYAnIqYDO4I6-U68NOk",
    secure: true,
  });

const app = express()


app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json());
// enable all CORS requests
app.use(cors());

// file upload 
// app.use(fileUpload());

const port = process.env.PORT || 3000

// Db connection
dbConnection.run();

app.get('/', (req, res) => res.send('Welcome to the Gym Star'))
// routers
app.use("/gym-star", programRouter);
app.use("/gym-star", exerciseRouter);
app.use("/gym-star", userRouter);
app.use("/gym-star", scheduleRouter);


// send back a 404 if no other route matches
app.use((req, res) => {
    res.status(404).send('<h1>Error</h1><p>Sorry, that route does not exist</p>')
})

app.listen(port, () => console.log(`server started listening on port ${port}!`))