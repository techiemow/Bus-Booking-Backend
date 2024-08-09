const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectdb = require("./DB");
const { handleRegistration, handleLogin, handleBooking, fetchBusSelection, fetchAccount, handleUpdateAccount, handleMyBookings, handlebookingsDeletion } = require("./Service");
const { BookingModel, RegistrationModel } = require("./Schema");
const Razorpay = require('razorpay')

const crypto = require('crypto')
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { log } = require("console");


app.use(cors());
app.use(bodyParser.json());
connectdb();



const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
  key_secret:process.env.RAZORPAY_SECRET_KEY, // Replace with your Razorpay key_secret
});

const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

app.use(logRequest);
const verifyUser = async (username) => {
  try {
    const dbResponse = await RegistrationModel.findOne({ username });
     console.log(dbResponse);
     
    return dbResponse ? true : false;
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
};

const authorization = async (req, res, next) => {
  console.log(req.path, "req");

  // Allow these paths without authentication
  if (req.path.startsWith("/Login") || req.path === "/registration" || req.path.startsWith("/MyDeletes")) {
    return next();
  }

  // Extract token from headers
  const userToken = req.headers['auth']; // Use 'auth' as the header key

  if (!userToken) {
    return res.status(401).send("Authorization token is missing.");
  }

  try {
    // Verify the token
    const tokenDecoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    const username = tokenDecoded.data;

    // Verify user existence
    const isUserValid = await verifyUser(username);
    if (isUserValid) {
      return next();
    } else {
      return res.status(401).send("Invalid user.");
    }
  } catch (error) {
    console.error("Error in authorization middleware:", error);
    return res.status(401).send("Invalid token.");
  }
};

// Use the authorization middleware
app.use(authorization);



app.get("/", (req, res) => {
    res.send("Welcome to the BusVoyage Page!");
});

app.post("/registration", async (req, res) => {
    handleRegistration(req, res);
});

app.get("/Login/:username/:password", async (req, res) => {
    const { username, password } = req.params;

    try {
        const loginResult = await handleLogin(username, password);
        res.send(loginResult);
        console.log(loginResult);
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(401).send("Login Failed: " + error.message);
    }
});

app.post("/bookings", async (req, res) => {
    handleBooking(req, res);
});

app.get("/selection/:Date/:from/:to/:Id", async (req, res) => {
    const { Date ,from ,to , Id } = req.params;
  
    try {
      const busSelection = await fetchBusSelection(Date,from,to,Id);
      res.send(busSelection);
      console.log(busSelection);
    } catch (error) {
      console.error("Bus selection error:", error.message);
      res.status(500).send("Bus selection failed: " + error.message);
    }
  });

  app.get('/user/:username', async (req, res) => {
    const { username } = req.params;
    try {
      const user = await fetchAccount(username);
      res.send(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  app.put('/user/:userDataid', async (req, res) => {
       
    const {userDataid} = req.params;
    const updatedData = req.body;

    try {
        const updatedUser = await handleUpdateAccount(userDataid, updatedData);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

        


  }
    
)

app.get("/MyBookings/:username" , async (req, res) => {
    const { username } = req.params;
try{
    const MyBookings = await handleMyBookings(username);
    res.send(MyBookings);

}catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    
})

app.post('/payment/:bookingId', async (req, res) => {
  const { amount, currency } = req.body;

  try {
  
        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount,
          currency,
          receipt: 'order_rcptid_11',
          payment_capture: 1,
        });

        res.json(order);
 
      }
    catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Payment failed' });
    }
 
  }
);

app.delete("/MyDeletes/:id" , async(req, res) => {
  const { id } = req.params;
  try{
      const MyBookings = await handlebookingsDeletion(id); 
      res.send(MyBookings);
      console.log(MyBookings);
  }catch (error) {
          res.status(500).json({ message: 'Server error' });
      }


}
)
app.post('/payment/verify/:orderId', async (req, res) => {

  const { paymentId , signature, bookingId }= req .body
  const { orderId } = req.params;
 
  console.log(paymentId, orderId, signature);

  try {
    // Verify payment signature
    const generatedSignature = crypto.createHmac('sha256', 'ozspmFKoIn4xtZLmJsmXEVoR')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      const filter = { _id: new mongoose.Types.ObjectId(bookingId) };
      const update = { payment: true }; 

      const dbResponse = await BookingModel.findOneAndUpdate(filter, update);

      console.log(dbResponse);

      if (dbResponse) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Booking not found or could not be updated' });
      }
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});
  


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
