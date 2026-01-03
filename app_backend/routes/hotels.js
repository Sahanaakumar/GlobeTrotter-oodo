const express = require("express");
const router = express.Router();

// Demo hotel data
const hotels = [
  { id: 1, name: "Taj Hotel", cityId: 1, price: 5000 },
  { id: 2, name: "ITC Grand", cityId: 1, price: 4500 },
  { id: 3, name: "Leela Palace", cityId: 2, price: 6000 },
  { id: 4, name: "Paris Inn", cityId: 3, price: 7000 },
  { id: 5, name: "Tokyo Stay", cityId: 5, price: 8000 }
];

// ✅ GET all hotels
router.get("/", (req, res) => {
  res.json(hotels);
});

// ✅ GET hotels by cityId
router.get("/city/:cityId", (req, res) => {
  const cityHotels = hotels.filter(
    h => h.cityId === parseInt(req.params.cityId)
  );

  if (cityHotels.length === 0) {
    return res.status(404).json({ message: "No hotels found for this city" });
  }

  res.json(cityHotels);
});

module.exports = router;
