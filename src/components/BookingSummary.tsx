import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface BookingSummaryProps {
  startLocation: Location | null;
  endLocation: Location | null;
  distance: number;
  selectedTierName: string | null;
  fare: number;
  onBook: () => void;
  loading: boolean;
}

export const BookingSummary = ({
  startLocation,
  endLocation,
  distance,
  selectedTierName,
  fare,
  onBook,
  loading
}: BookingSummaryProps) => {
  const canBook = startLocation && endLocation && selectedTierName && distance > 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-xl sticky top-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Navigation className="h-5 w-5 text-primary" />
        Booking Summary
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="text-sm font-medium truncate">
                {startLocation?.address || "Not selected"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="text-sm font-medium truncate">
                {endLocation?.address || "Not selected"}
              </p>
            </div>
          </div>
        </div>

        {distance > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Distance</span>
              <span className="text-sm font-medium">{distance.toFixed(2)} km</span>
            </div>
            
            {selectedTierName && (
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tier</span>
                <span className="text-sm font-medium">{selectedTierName}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-3 border-t">
              <span className="text-base font-semibold">Total Fare</span>
              <span className="text-2xl font-bold text-primary">₹{fare.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all"
          size="lg"
          onClick={onBook}
          disabled={!canBook || loading}
        >
          {loading ? "Booking..." : "Book Now"}
        </Button>
        
        {!canBook && (
          <p className="text-xs text-center text-muted-foreground">
            Select locations and a tier to continue
          </p>
        )}
      </div>
    </Card>
  );
};