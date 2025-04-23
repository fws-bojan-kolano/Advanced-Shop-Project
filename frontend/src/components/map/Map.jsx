import './map.scss';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/layers.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useState } from 'react';
import { SERVER } from '../../utils/utils';

const blueMarker = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const redMarker = new L.Icon({
    iconUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function Map() {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(`${SERVER}locations`);
                if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                console.log(data);
                setMarkers(data.locations)
            } catch (error) {
                console.error('Error loading locations:', error);
            }
        }

        fetchLocations();
    }, []);

    return (
        <div className="map">
            <MapContainer center={[51.505, -0.09]} zoom={4} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                {markers.map((marker, index) => (
                    <Marker key={marker.id} position={marker.position} icon={index === 0 ? redMarker : blueMarker}>
                        <Popup>
                            <strong>{marker.title}</strong>
                            {marker.description}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}