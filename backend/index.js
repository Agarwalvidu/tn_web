require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/programs", require("./routes/programRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/mentors", require("./routes/mentorRoutes"));

app.get("/", (req, res) => res.send("Mentorship API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));