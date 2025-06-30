const Property = require("../models/Property");
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

// Middleware-compatible multer function to handle multiple image uploads (max 10)
const imageUpload = upload.array("images", 10);

const addProperty = async (req, res) => {
    try {
        // Extract uploaded image URLs from req.files
        const imageUrls = req.files.map(file => file.path);

        // Parse extras boolean fields sent as strings in the form data
        const extras = {
            parking: req.body["extras[parking]"] === "true",
            gym: req.body["extras[gym]"] === "true",
            pool: req.body["extras[pool]"] === "true",
        };

        // Create new Property document with form data, extras, and image URLs
        const newProperty = new Property({
            ...req.body,
            extras,
            images: imageUrls,
        });

        // Save new property in database
        await newProperty.save();

        res.status(201).json({ message: "Property saved successfully", property: newProperty });
    } catch (error) {
        console.error("Error adding property:", error.message);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Failed to save property", error: error.message });
    }
};

// Get all properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch properties" });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;

        // Find existing property by ID
        const existingProperty = await Property.findById(id);
        if (!existingProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Parse extras boolean fields from form data
        const extras = {
            parking: req.body["extras[parking]"] === "true",
            gym: req.body["extras[gym]"] === "true",
            pool: req.body["extras[pool]"] === "true",
        };

        // existingImages array sent from frontend contains URLs to keep (not removed)
        const existingImages = req.body.existingImages || [];

        // If new images are uploaded, extract their URLs
        let newUploads = [];
        if (req.files && req.files.length > 0) {
            newUploads = req.files.map(file => file.path);
        }

        // Combine images to keep with newly uploaded images for final images array
        const imageUrls = [...existingImages, ...newUploads];

        // Prepare the data to update in the property document
        const updatePayload = {
            ...req.body,
            extras,
            images: imageUrls,
        };

        // Update property in DB and return the new document
        const updatedProperty = await Property.findByIdAndUpdate(id, updatePayload, { new: true });

        res.status(200).json({ message: "Property updated successfully", property: updatedProperty });

    } catch (error) {
        console.error("Error updating property:", error.message);
        res.status(500).json({ message: "Failed to update property", error: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the property to delete
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        // Delete each image from Cloudinary
        const destroyPromises = property.images.map(async (imgUrl) => {
            try {
                // Extract public_id from Cloudinary URL for deletion
                const segments = imgUrl.split('/');
                const fileName = segments[segments.length - 1];
                const publicId = fileName.split('.')[0];

                const folder = segments[segments.length - 2];

                await cloudinary.uploader.destroy(`${folder}/${publicId}`);
            } catch (error) {
                console.error(`Failed to delete image ${imgUrl}`, error.message);
            }
        });

        // Wait for all images to be deleted from Cloudinary
        await Promise.all(destroyPromises);

        // Delete the property document from MongoDB
        await Property.findByIdAndDelete(id);

        res.status(200).json({ message: "Property and images deleted successfully" });
    } catch (err) {
        console.error("Error deleting property:", err.message);
        res.status(500).json({ message: "Failed to delete property", error: err.message });
    }
};

module.exports = { imageUpload, addProperty, getProperties, updateProperty, deleteProperty };
