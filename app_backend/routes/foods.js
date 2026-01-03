const express = require("express");
const router = express.Router();

// Demo food data
const foods = [
  { id: 1, name: "Dosa & Idli", cityId: 1, price: 150 },
  { id: 2, name: "Chettinad Meals", cityId: 1, price: 300 },
  { id: 3, name: "Masala Dosa", cityId: 2, price: 200 },
  { id: 4, name: "Croissant", cityId: 3, price: 250 },
  { id: 5, name: "Sushi", cityId: 5, price: 600 }
];

// ✅ GET all food items
router.get("/", (req, res) => {
  res.json(foods);
});

// ✅ GET food by cityId
router.get("/city/:cityId", (req, res) => {
  const cityFoods = foods.filter(
    f => f.cityId === parseInt(req.params.cityId)
  );

  if (cityFoods.length === 0) {
    return res.status(404).json({ message: "No food found for this city" });
  }

  res.json(cityFoods);
});

module.exports = router;
