"use client";

import { MapPinIcon } from "@heroicons/react/24/solid";
import Label from "@/components/Label";
import React, { FC } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing2Props {}

const PageAddListing2: FC<PageAddListing2Props> = () => {
  const { formData, updateFormData } = useAddListing();
  
  // Default center for the map
  const mapCenter: [number, number] = formData.latitude && formData.longitude 
    ? [formData.latitude, formData.longitude]
    : [-24.6282, 25.9245]; // Botswana center

  // Custom Leaflet icon (using default Leaflet marker for now)
  const customIcon = new L.Icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <>
      <h2 className="text-2xl font-semibold">Your place location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <ButtonSecondary>
          <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          <span className="ml-3">Use current location</span>
        </ButtonSecondary>
        {/* ITEM */}
        <FormItem label="Country/Region">
          <Select value={formData.country} onChange={(e) => updateFormData({ country: e.target.value })}>
            <option value="">Select country</option>
            <option value="Botswana">Botswana</option>
            <option value="South Africa">South Africa</option>
            <option value="Namibia">Namibia</option>
            <option value="Zimbabwe">Zimbabwe</option>
          </Select>
        </FormItem>
        <FormItem label="Street">
          <Input 
            placeholder="Street address"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
          />
        </FormItem>
        <FormItem label="Room number (optional)">
          <Input placeholder="Apt, Suite, etc." />
        </FormItem>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          <FormItem label="City">
            <Input 
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
            />
          </FormItem>
          <FormItem label="State">
            <Input 
              placeholder="State/Province" 
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
            />
          </FormItem>
          <FormItem label="Postal code">
            <Input 
              placeholder="Postal code" 
              value={formData.postalCode}
              onChange={(e) => updateFormData({ postalCode: e.target.value })}
            />
          </FormItem>
        </div>
        <div>
          <Label>Detailed address</Label>
          <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {formData.address && formData.city 
              ? `${formData.address}, ${formData.state ? formData.state + ", " : ""}${formData.city}, ${formData.country}` 
              : "Enter your address above"}
          </span>
          <div className="mt-4">
            <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
              <div className="rounded-xl overflow-hidden">
                <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false} className="w-full h-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={mapCenter} icon={customIcon} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing2;
