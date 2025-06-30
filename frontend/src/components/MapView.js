import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, DivIcon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fallback location (Dubai)
const defaultPosition = [25.276987, 55.296249];

// Format price like "2.3k", "1.1M"
const formatPrice = (price) => {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(1)}k`;
    return price.toString();
};

// Create combined marker: price on top + icon below
const createCombinedIcon = (price) => {
    const priceLabel = formatPrice(price);

    return L.divIcon({
        className: '',
        html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          background: #1d4ed8;
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 2px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        ">${priceLabel}</div>
        <img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" style="width: 25px; height: auto;" />
      </div>
    `,
        iconSize: [80, 40],
        iconAnchor: [40, 40], // aligns the icon tip with the location
    });
};

const MapView = ({ properties }) => {
    const positions = properties
        .map((p) => {
            const lat = parseFloat(p.latitude);
            const lng = parseFloat(p.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                return { ...p, coords: [lat, lng] };
            }
            return null;
        })
        .filter(Boolean);

    return (
        <MapContainer
            center={positions[0]?.coords || defaultPosition}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full rounded-r-2xl z-0"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {positions.map((p) => (
                <Marker
                    key={p._id}
                    position={p.coords}
                    icon={createCombinedIcon(p.price)}
                >
                    <Popup>
                        <strong>{p.title}</strong><br />
                        {p.city}<br />
                        {p.price.toLocaleString()} AED
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
