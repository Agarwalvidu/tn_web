const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("Connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB; // This was likely missing