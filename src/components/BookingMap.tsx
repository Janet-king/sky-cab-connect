import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface BookingMapProps {
  onLocationSelect: (start: Location | null, end: Location | null) => void;
}

const LocationMarker = ({ onLocationSet, locationType }: { 
  onLocationSet: (location: Location, type: 'start' | 'end') => void;
  locationType: 'start' | 'end';
}) => {
  useMapEvents({
    click(e) {
      const location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address: `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`
      };
      onLocationSet(location, locationType);
    },
  });

  return null;
};

export const BookingMap = ({ onLocationSelect }: BookingMapProps) => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [selectingType, setSelectingType] = useState<'start' | 'end' | null>(null);
  
  // Bengaluru coordinates
  const bengaluruCenter: [number, number] = [12.9716, 77.5946];

  useEffect(() => {
    onLocationSelect(startLocation, endLocation);
  }, [startLocation, endLocation, onLocationSelect]);

  const handleLocationSet = (location: Location, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartLocation(location);
    } else {
      setEndLocation(location);
    }
    setSelectingType(null);
  };

  const clearLocations = () => {
    setStartLocation(null);
    setEndLocation(null);
    setSelectingType(null);
  };

  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="relative w-full h-full">
      <Card className="absolute top-4 left-4 z-[1000] p-4 bg-card/95 backdrop-blur-sm shadow-lg">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Select Locations</h3>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant={selectingType === 'start' ? 'default' : 'outline'}
              onClick={() => setSelectingType('start')}
              disabled={!!startLocation}
            >
              {startLocation ? '✓ Start Set' : 'Set Start Point'}
            </Button>
            <Button
              size="sm"
              variant={selectingType === 'end' ? 'default' : 'outline'}
              onClick={() => setSelectingType('end')}
              disabled={!startLocation || !!endLocation}
            >
              {endLocation ? '✓ End Set' : 'Set End Point'}
            </Button>
            {(startLocation || endLocation) && (
              <Button
                size="sm"
                variant="destructive"
                onClick={clearLocations}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </Card>

      <MapContainer
        center={bengaluruCenter}
        zoom={12}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '500px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {selectingType && (
          <LocationMarker 
            onLocationSet={handleLocationSet} 
            locationType={selectingType}
          />
        )}
        
        {startLocation && (
          <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
            <Popup>Start: {startLocation.address}</Popup>
          </Marker>
        )}
        
        {endLocation && (
          <Marker position={[endLocation.lat, endLocation.lng]} icon={endIcon}>
            <Popup>End: {endLocation.address}</Popup>
          </Marker>
        )}
        
        {startLocation && endLocation && (
          <Polyline 
            positions={[
              [startLocation.lat, startLocation.lng],
              [endLocation.lat, endLocation.lng]
            ]}
            color="#0EA5E9"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};