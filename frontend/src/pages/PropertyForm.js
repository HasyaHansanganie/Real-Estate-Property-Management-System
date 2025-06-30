import React, { useState, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';
import axios from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PropertyForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get existing property data if editing (passed via location.state)
    const property = location.state?.property;
    const id = property?._id;
    const isEditing = Boolean(id);

    // Local state for managing images uploaded, listing type, extras, status, and all form fields
    const [images, setImages] = useState([]);
    const [listingType, setListingType] = useState('Buy');
    const [extras, setExtras] = useState({ parking: false, gym: false, pool: false });
    const [status, setStatus] = useState('Available');
    const [formData, setFormData] = useState({
        title: '', type: '', description: '',
        country: '', city: '', address: '', mapLink: '', latitude: '', longitude: '',
        bedrooms: '', bathrooms: '', size: '', price: '',
        contactName: '', phone: '', email: ''
    });

    // On component mount/update, if editing an existing property, populate form states with its data
    useEffect(() => {
        if (isEditing) {
            setFormData({
                ...property,
                bedrooms: property.bedrooms || '',
                bathrooms: property.bathrooms || '',
                size: property.size || '',
                price: property.price || ''
            });
            setExtras(property.extras || {});
            setStatus(property.status || 'Available');
            setListingType(property.listingType || 'Buy');

            // For images, store preview URLs and null file (because already uploaded)
            setImages((property.images || []).map(url => ({ preview: url, file: null })));
        }
    }, [property]);

    // Handler to update formData state on input change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler for when user uploads new images
    // Creates preview URLs for showing image thumbnails before upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...filePreviews]);
    };

    // Remove image from images array by index
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Toggle extras checkbox states
    const handleExtrasChange = (key) => {
        setExtras({ ...extras, [key]: !extras[key] });
    };

    // Reset form fields, images, and states to initial defaults
    const resetForm = () => {
        setFormData({
            title: '', type: '', description: '',
            country: '', city: '', address: '', mapLink: '', latitude: '', longitude: '',
            bedrooms: '', bathrooms: '', size: '', price: '',
            contactName: '', phone: '', email: ''
        });
        setImages([]);
        setExtras({ parking: false, gym: false, pool: false });
        setListingType('Buy');
        setStatus('Available');
    };

    // Handle form submission, either creating new or updating existing property
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();

            // Append new uploaded files only (file != null)
            images.forEach((img) => {
                if (img.file) {
                    form.append("images", img.file);
                }
            });

            // Append URLs of existing images to keep
            images
                .filter(img => img.file === null) // only existing images
                .forEach(img => {
                    form.append("existingImages[]", img.preview); // append URLs explicitly
                });

            // Append other form fields except listingType and status (appended separately)
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'listingType' || key === 'status') return;
                form.append(key, value);
            });

            // Append listingType and status fields explicitly
            form.append("listingType", listingType);
            form.append("status", status);

            // Append extras object fields as strings (required for backend form parsing)
            Object.entries(extras).forEach(([key, value]) => {
                form.append(`extras[${key}]`, value.toString());
            });

            if (isEditing) {
                // Send PUT request to update existing property
                await axios.put(`/properties/${id}`, form, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert('Property updated!');
                resetForm();
                navigate('/admin/manageProperties');
            } else {
                // Send POST request to create a new property
                await axios.post("/properties", form, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert('Property created!');
                resetForm();
            }

        } catch (err) {
            console.error(err);
            alert("Error submitting form");
        }
    };

    return (
        <form
            className="mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            {/* Title depending on mode */}
            <h2 className="text-2xl font-bold mb-6">
                {isEditing ? 'Edit Property' : 'Add New Property'}
            </h2>

            {/* Image Upload Section */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer bg-gray-50">
                    <UploadCloud className="w-10 h-10 text-blue-600" />
                    <input type="file" multiple className="hidden" id="images" name='images' onChange={handleImageChange} />
                    <label htmlFor="images" className="text-blue-600 cursor-pointer font-medium">Click to upload or drag & drop</label>
                </div>

                {/* Preview uploaded images with remove button */}
                {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group">
                                <img src={img.preview} alt="Preview" className="rounded-lg h-40 w-full object-cover" />
                                <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Basic Info Inputs */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" placeholder="E.g., Luxury Apartment in Dubai" required />
                </div>

                {/* Property Type and Listing Type Radio Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
                    <div >
                        <label className="block mb-1 text-sm font-medium text-gray-700">Property Type</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" required>
                            <option value="">Select Type</option>
                            <option>Apartment</option>
                            <option>Villa</option>
                            <option>House</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">Listing Type</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="listingType" value="Buy" checked={listingType === 'Buy'} onChange={(e) => setListingType(e.target.value)} /> Buy
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="listingType" value="Rent" checked={listingType === 'Rent'} onChange={(e) => setListingType(e.target.value)} /> Rent
                            </label>
                        </div>
                    </div>
                </div>

                {/* Description Textarea */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" rows="5" placeholder="Describe the property..." required />
                </div>

                {/* Address Fields: country, city, address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['country', 'city', 'address'].map((field, i) => (
                        <div key={field} className={i === 2 ? 'md:col-span-2' : ''}>
                            <label className="block mb-1 text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type="text" name={field} value={formData[field]} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" required />
                        </div>
                    ))}
                </div>

                {/* Google Maps Link */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Google Maps Link</label>
                    <input type="text" name="mapLink" value={formData.mapLink} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" />
                </div>

                {/* Latitude and Longitude Inputs */}
                <div className="grid grid-cols-2 gap-6">
                    {['latitude', 'longitude'].map((field, i) => (
                        <div key={field}>
                            <label className="block mb-1 text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type="text" name={field} value={formData[field]} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" required />
                        </div>
                    ))}
                </div>

                {/* Bedrooms, Bathrooms, Size, Price Inputs */}
                <div className="grid grid-cols-5 gap-6">
                    {['bedrooms', 'bathrooms', 'size', 'price'].map((field, i) => (
                        <div key={field} className={i === 3 ? 'col-span-2' : ''}>
                            <label className="block mb-1 text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type="number" name={field} value={formData[field]} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" required />
                        </div>
                    ))}
                </div>

                {/* Status Select and Extras Checkboxes */}
                <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="w-full border border-gray-600 rounded-lg px-4 py-2"
                            value={status}
                            required
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">Extras</label>
                        <div className="flex gap-4">
                            {['parking', 'gym', 'pool'].map((item) => (
                                <label key={item} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={extras[item]}
                                        onChange={() => handleExtrasChange(item)}
                                    />
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {['contactName', 'phone', 'email'].map((field) => (
                    <div key={field}>
                        <label className="block mb-1 text-sm font-medium text-gray-700">{field === 'contactName' ? 'Contact Name' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input type="text" name={field} value={formData[field]} onChange={handleInputChange} className="w-full border border-gray-600 rounded-lg px-4 py-2" required />
                    </div>
                ))}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => {
                        resetForm();
                        if (isEditing) {
                            navigate('/admin/manageProperties');
                        }
                    }}
                    className="px-6 py-2 rounded-lg border border-gray-300"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    {isEditing ? 'Update Property' : 'Publish Property'}
                </button>
            </div>
        </form>
    );
};

export default PropertyForm;
