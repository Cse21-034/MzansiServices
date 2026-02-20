"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import Input from "@/shared/Input";
import Label from "@/components/Label";

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

// Inner component to handle map interactions
const MapClickHandler: React.FC<{
  onMapClick: (latlng: LatLng) => void;
}> = ({ onMapClick }) => {
  useMapEvent("click", (e) => {
    onMapClick(e.latlng);
  });
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  address,
  city,
  onCoordinatesChange,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    latitude || -22.5597,
    longitude || 17.0832,
  ]);
  const [inputLat, setInputLat] = useState<string>(
    latitude?.toString() || "-22.5597"
  );
  const [inputLng, setInputLng] = useState<string>(
    longitude?.toString() || "17.0832"
  );

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
      setInputLat(latitude.toString());
      setInputLng(longitude.toString());
    }
  }, [latitude, longitude]);

  const handleMapClick = (latlng: LatLng) => {
    const newLat = Math.round(latlng.lat * 10000) / 10000;
    const newLng = Math.round(latlng.lng * 10000) / 10000;

    setPosition([newLat, newLng]);
    setInputLat(newLat.toString());
    setInputLng(newLng.toString());
    onCoordinatesChange(newLat, newLng);
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputLat(value);

    const lat = parseFloat(value);
    if (!isNaN(lat)) {
      const lng = parseFloat(inputLng);
      if (!isNaN(lng)) {
        setPosition([lat, lng]);
        onCoordinatesChange(lat, lng);
      }
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputLng(value);

    const lng = parseFloat(value);
    if (!isNaN(lng)) {
      const lat = parseFloat(inputLat);
      if (!isNaN(lat)) {
        setPosition([lat, lng]);
        onCoordinatesChange(lat, lng);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Location on Map</Label>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          Click on the map to pin your exact location, or enter coordinates
          manually. Current location: {address || city}
        </p>

        <div className="h-80 ring-1 ring-black/10 rounded-xl overflow-hidden z-0">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && (
              <Marker position={position}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">Business Location</p>
                    <p>Lat: {position[0].toFixed(4)}</p>
                    <p>Lng: {position[1].toFixed(4)}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Click on map to change location
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          💡 Tip: Click anywhere on the map to set your business location
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            step="0.0001"
            placeholder="e.g., -22.5597"
            value={inputLat}
            onChange={handleLatChange}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Current: {parseFloat(inputLat).toFixed(4)}
          </p>
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            step="0.0001"
            placeholder="e.g., 17.0832"
            value={inputLng}
            onChange={handleLngChange}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Current: {parseFloat(inputLng).toFixed(4)}
          </p>
        </div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <span className="font-semibold">📍 Current Coordinates:</span>
          <br />
          Latitude: {parseFloat(inputLat).toFixed(4)} | Longitude:{" "}
          {parseFloat(inputLng).toFixed(4)}
        </p>
      </div>
    </div>
  );
};

export default MapPicker;
