const express = require("express");
const mongoose = require("mongoose");
const electionRoute = require("./controller/databaseOperations");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;
db.on("open", () => console.log("Connected to DB"));
db.on("error", () => console.log("Failed to connect"));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded:true}));
app.use(cors());
app.use("/", electionRoute);

app.listen(4000, () => {
    console.log("Server started at 4000");
})