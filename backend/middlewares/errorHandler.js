const multerErrorHandler = (err, req, res, next) => {
    console.error("Multer/Upload error:", err);
    res.status(500).json({ message: "File upload error", error: err.message });
};

module.exports = multerErrorHandler;
