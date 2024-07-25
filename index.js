const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser");
const connectdb = require("./DB");
const { handleRegistration, handleLogin, handleBooking }  = require("./Service")


app.use(cors());
app.use(bodyParser.json());
connectdb();


const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Call next() to move to the next middleware or route handler
  };


  app.use(logRequest)

app.get("/", function(req, res) {
    res.send("Welcome to the BusVoyage Page!");
})

app.post("/registration", async (req, res) => {
    handleRegistration(req, res)
    
})

app.get("/Login/:username/:password", async (req, res) => {
    const { username, password } = req.params;

    try {
      const loginResult = await handleLogin(username, password);
      res.send(loginResult);
      console.log(loginResult)
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(401).send("Login Failed: " + error.message);
    }
    }
)

app.post("/bookings" ,async (req, res) =>{
  
  handleBooking(req,res)

})



app.listen(4000, () => {
    console.log("Server is running on port 4000")
})