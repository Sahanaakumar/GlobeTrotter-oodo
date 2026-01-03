const express = require("express");
const db = require("../db");

const router = express.Router();

// CREATE TRIP
router.post("/", (req, res) => {
  const { user_id, trip_name, start_date, end_date, description } = req.body;

  const sql = `
    INSERT INTO trips (user_id, trip_name, start_date, end_date, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, trip_name, start_date, end_date, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error creating trip" });
      }
      res.json({ message: "Trip created successfully" });
    }
  );
});

module.exports = router;
