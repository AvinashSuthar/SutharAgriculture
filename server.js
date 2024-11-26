const mongoose = require("mongoose");
const connectDB = () => {
  mongoose
    .connect(
      "mongodb+srv://avinashsuthar19hmh:5b63cLcdlTN1IgUR@sutharagriculturedataba.vgrtj.mongodb.net/?retryWrites=true&w=majority&appName=SutharAgricultureDatabase"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = connectDB;