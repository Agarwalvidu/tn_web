require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
});

const programRoutes = require("./routes/programRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

app.use("/api/programs", programRoutes);
app.use("/api/resources", resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
