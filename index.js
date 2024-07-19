const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser");
const connectdb = require("./DB");


app.use(cors());
app.use(bodyParser.json());
connectdb();

app.get("/", function(req, res) {
    res.send("Welcome to the BusVoyage Page!");
})



app.listen( 5000, () => {
    console.log("Server is running on port 5000")
})