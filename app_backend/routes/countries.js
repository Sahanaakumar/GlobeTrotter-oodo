const express = require("express");
const router = express.Router();

// Demo countries data
const countries = [
  { id: 1, name: "India" },
  { id: 2, name: "France" },
  { id: 3, name: "Japan" },
  { id: 4, name: "USA" },
  { id: 5, name: "Italy" }
];

// GET all countries
router.get("/", (req, res) => {
  res.json(countries);
});

// GET country by ID
router.get("/:id", (req, res) => {
  const country = countries.find(
    c => c.id === parseInt(req.params.id)
  );

  if (!country) {
    return res.status(404).json({ message: "Country not found" });
  }

  res.json(country);
});

module.exports = router;
