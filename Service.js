const { RegistrationModel, BookingModel } =  require("./Schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const handleRegistration = async(req,res) => {


    console.log(req.body);
      
    const { username, password, phoneNumber, emailaddress } = req.body;
    if(username?.length && 
        password?.length && 
        emailaddress?.length && 
        phoneNumber?.length ) {
       
        const dbResponse = await RegistrationModel.create({
            username,
            emailaddress,
            password,
            phoneNumber
        });
        
        if (dbResponse?._id) {
            console.log("Created");
            res.send(dbResponse);
            return;
        }
    }
    res.send("Incorrect Data");
  
  }
  
  const handleLogin = async (username, password) => {
      try {
        // Find user by username
        const user = await RegistrationModel.findOne({ username });
  
        if (!user) {
          throw new Error("User not found");
        }
  

         
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          const token = jwt.sign({ data: username }, process.env.JWT_SECRET_KEY);
        
          return { success: true, username: user.username , token: token};
          
        } else {
          throw new Error("Incorrect password");
        }
      } catch (error) {
        throw new Error("Login failed");
      }
    }; 


    const handleBooking = async (req, res) => {
      console.log(req.body);
  
      const {busid,username, passengerName, busType, departureTime, From, To, numberOfSeats, totalPrice ,date , payment} = req.body;
  
      if (
          
          typeof busType === 'string' && busType.length 
      
      ) {
          try {
              const dbResponse = await BookingModel.create({
                  busid,
                  username,
                  passengerName,
                  busType,
                  departureTime,
                  From,
                  To,
                  numberOfSeats,
                  totalPrice,
                  date,
                  payment
              });
  
              if (dbResponse?._id) {
                  console.log("Created");
                  res.send(dbResponse);
                  return;
              }
          } catch (error) {
              console.error("Error creating booking:", error);
              res.status(500).send("Server error");
              return;
          }
      }
  
      res.status(400).send("Incorrect Data");
  };

  const fetchAccount = async(username) => {
    try {
      // Find user by username
      const dbResponse = await RegistrationModel.findOne({ username });
  
      // Count bookings by username
      const bookres = await BookingModel.countDocuments({ username });
  
      // Log results for debugging
      console.log(dbResponse, bookres);
  
      // Return both user details and booking count
      return {
        user: dbResponse,
        bookingCount: bookres
      };
      
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error; // Propagate the error to be handled by the caller
    }
  };

  const fetchBusSelection = async(Date,from ,to,Id) => {
    try {
      const dbSelection = await BookingModel.find({
        date: Date,
        From: from,
        To: to,
        busid :Id
      });
  
      return dbSelection;
    } catch (error) {
      console.error("Error fetching bus selection:", error);
      throw error;
    }
  };
  
  const handleUpdateAccount = async(userDataid, updatedData) =>{
    console.log(updatedData);
    try {
      const dbResponse = await RegistrationModel.findByIdAndUpdate(userDataid, updatedData);
      
      
      return dbResponse;
      
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  }

   const handleMyBookings = async(username) =>{
    try {
      const dbResponse = await BookingModel.find({ username });
      
      
      return dbResponse;
      
    } catch (error) {
      console.error("Error fetching my bookings:", error);
      throw error;
    }
   }

   const handlebookingsDeletion = async(id) =>{
    try {
      const dbResponse = await BookingModel.findByIdAndDelete(id);
      
      console.log(dbResponse);
      return dbResponse;
     
      
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
   }
module.exports =
{
    handleRegistration,
    handleLogin,
    handleBooking,
    fetchBusSelection,
    fetchAccount,
    handleUpdateAccount,
    handleMyBookings,
    handlebookingsDeletion
}