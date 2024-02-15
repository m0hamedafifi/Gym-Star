const express = require('express')
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require('cors');
const dbConnection = require('./db/connection');
const programRouter = require('./router/programs.route');
// const userRouter = require('./router/users.route');
const exerciseRouter = require('./router/exercises.route');

dotenv.config();

const app = express()


app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json());
// enable all CORS requests
app.use(cors());

const port = process.env.PORT || 3000

// Db connection
dbConnection.run();

app.get('/', (req, res) => res.send('Welcome to the Gym Star'))
// routers
app.use("/gym-star", programRouter);
app.use("/gym-star", exerciseRouter);

// send back a 404 if no other route matches
app.use((req, res) => {
    res.status(404).send('<h1>Error</h1><p>Sorry, that route does not exist</p>')
})

app.listen(port, () => console.log(`server started listening on port ${port}!`))