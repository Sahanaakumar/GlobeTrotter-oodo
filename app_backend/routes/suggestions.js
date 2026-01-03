const express = require("express");
const router = express.Router();

// Demo data (same as your existing)
const activities = [
  { id: 1, name: "Beach Walk", cityId: 1 },
  { id: 2, name: "Temple Visit", cityId: 1 }
];

const hotels = [
  { id: 1, name: "Sea View Hotel", cityId: 1 },
  { id: 2, name: "City Inn", cityId: 2 }
];

const foods = [
  { id: 1, name: "Dosa", cityId: 1 },
  { id: 2, name: "Sushi", cityId: 5 }
];

// ✅ GET suggestions by cityId
router.get("/city/:cityId", (req, res) => {
  const cityId = parseInt(req.params.cityId);

  res.json({
    activities: activities.filter(a => a.cityId === cityId),
    hotels: hotels.filter(h => h.cityId === cityId),
    foods: foods.filter(f => f.cityId === cityId)
  });
});

module.exports = router;
