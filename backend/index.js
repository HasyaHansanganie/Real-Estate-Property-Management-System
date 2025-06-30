const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const User = require('./models/User');
const bcrypt = require('bcrypt');
const multerErrorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://real-estate-property-management-system-o3og7oqfk.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use(multerErrorHandler);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const createInitialAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: "admin@homehive.com" });
        if (!adminExists) {
            const hashed = await bcrypt.hash("Admin@123", 10);
            await User.create({
                name: "Admin",
                email: "admin@homehive.com",
                password: hashed,
                role: "admin"
            });
            console.log("Admin account created: admin@homehive.com / Admin@123");
        } else {
            console.log("Admin already exists.");
        }
    } catch (error) {
        console.error("Error creating initial admin:", error);
    }
};

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
        createInitialAdmin();
    })
    .catch(err => console.error(err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
