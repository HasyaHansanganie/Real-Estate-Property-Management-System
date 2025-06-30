const express = require("express");
const router = express.Router();
const { imageUpload, addProperty, getProperties, updateProperty, deleteProperty } = require("../controllers/propertiesController");
const verifyToken = require("../middlewares/auth");

router.post("/", verifyToken, imageUpload, addProperty);
router.get("/", getProperties);
router.put("/:id", verifyToken, imageUpload, updateProperty);
router.delete("/:id", verifyToken, deleteProperty);

module.exports = router;
