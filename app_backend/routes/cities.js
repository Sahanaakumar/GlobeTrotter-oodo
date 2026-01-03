const express = require("express");
const router = express.Router();

// Demo cities data
const cities = [
  { id: 1, name: "Chennai", countryId: 1 },
  { id: 2, name: "Bangalore", countryId: 1 },
  { id: 3, name: "Paris", countryId: 2 },
  { id: 4, name: "Lyon", countryId: 2 },
  { id: 5, name: "Tokyo", countryId: 3 },
  { id: 6, name: "New York", countryId: 4 },
  { id: 7, name: "Rome", countryId: 5 }
];

// GET all cities
router.get("/", (req, res) => {
  res.json(cities);
});

// GET cities by countryId
router.get("/country/:countryId", (req, res) => {
  const filteredCities = cities.filter(
    city => city.countryId === parseInt(req.params.countryId)
  );

  res.json(filteredCities);
});

// GET city by city ID
router.get("/:id", (req, res) => {
  const city = cities.find(
    c => c.id === parseInt(req.params.id)
  );

  if (!city) {
    return res.status(404).json({ message: "City not found" });
  }

  res.json(city);
});


module.exports = router;
