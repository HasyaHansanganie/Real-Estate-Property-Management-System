import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { X, Eye, EyeOff } from 'lucide-react';

const AuthModal = ({ onClose, setIsUser }) => {

    // State to control whether the modal is in login or register mode
    const [mode, setMode] = useState("login");

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // Form state to store user input
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Handle input field changes
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle successful authentication (login or register)
    const handleAuthSuccess = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem("authToken", token);
        onClose();
        setIsUser(payload.role === 'user');
        navigate(payload.role === 'admin' ? "/admin" : "/");
    };

    // Handle form submission for login or registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Email and password are required.");
            return;
        }
        if (mode === "register") {
            if (!formData.name) return toast.error("Name is required.");
            if (formData.password !== formData.confirmPassword)
                return toast.error("Passwords do not match.");
        }

        try {
            if (mode === "register") {
                // First, register the user
                await axios.post("/auth/register", formData);
                toast.success("Account created successfully");

                // Then log in automatically
                const { data } = await axios.post("/auth/login", {
                    email: formData.email,
                    password: formData.password
                });

                handleAuthSuccess(data.token);
            } else {
                // Login flow
                const { data } = await axios.post("/auth/login", formData);
                toast.success("Logged in successfully");
                handleAuthSuccess(data.token);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                {/* Close button */}
                <button className="absolute top-2 right-3 text-gray-500" onClick={onClose}><X size={20} /></button>

                {/* Modal title */}
                <h2 className="text-xl font-semibold mb-4">{mode === "login" ? "Login to HomeHive" : "Create an Account"}</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border p-2 rounded pr-10"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>
                    {mode === "register" && (
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border p-2 rounded pr-10"
                                required
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>
                    )}

                    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        {mode === "login" ? "Login" : "Create Account"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    {mode === "login" ? (
                        <>
                            New to HomeHive?{" "}
                            <button onClick={() => setMode("register")} className="text-blue-600 underline">Create an account</button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button onClick={() => setMode("login")} className="text-blue-600 underline">Login</button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
