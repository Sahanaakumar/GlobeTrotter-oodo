const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

// Import routes
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const activityRoutes = require("./routes/activities");
const countryRoutes = require("./routes/countries");
const cityRoutes = require("./routes/cities");
const hotelRoutes = require("./routes/hotels");
const foodRoutes = require("./routes/foods");

//const suggestionRoutes = require("./routes/suggestions");
const suggestionRoutes = require("./routes/suggestions");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ======================
// AUTH ROUTES (LOGIN)
// ======================
app.use("/api/auth", authRoutes);

// ======================
// SIGNUP ROUTE (OLD – KEEP)
// ======================
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "User already exists" });
        }
        res.json({ message: "User created successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// TRIP ROUTES
// ======================
app.use("/api/trips", tripRoutes);

// ======================
// ACTIVITY ROUTES
// ======================
app.use("/api/activities", activityRoutes);

// ======================
// COUNTRY ROUTES
// ======================
app.use("/api/countries", countryRoutes);


app.use("/api/cities", cityRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/foods", foodRoutes);

//app.use("/api/suggestions", suggestionRoutes);
app.use("/api/suggestions", suggestionRoutes);

// ======================
// START SERVER (MUST BE LAST)
// ======================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
