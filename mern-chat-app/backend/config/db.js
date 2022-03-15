const mongoose = require("mongoose");
const colors = require("colors");

//  ----------------------------------- Connecting Mongo Db ------------------------------ //
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       useCreateIndex:true,
       useFindAndModify: false,
    });

    
    
    
  } catch (error) {
    
    process.exit();
  }
};

module.exports = connectDB;

//  ----------------------------------- Connecting Mongo Db ------------------------------ //



