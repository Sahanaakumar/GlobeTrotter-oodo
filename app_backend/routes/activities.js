const express = require("express");
const router = express.Router();
const db = require("../db");

// GET activities by city id
router.get("/:cityId", (req, res) => {
  const cityId = req.params.cityId;

  db.query(
    "SELECT id, name, cost FROM activities WHERE city_id = ?",
    [cityId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
