const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Get 'Authorization' header from request

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract the token string after 'Bearer '
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded payload (e.g., user id, email, role) to request object
        req.user = decoded;

        // Call next middleware or route handler
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
