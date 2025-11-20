import { useState, useEffect } from "react";
import { BookingMap } from "@/components/BookingMap";
import { TierSelector } from "@/components/TierSelector";
import { BookingSummary } from "@/components/BookingSummary";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plane, User, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface TierOption {
  id: string;
  name: string;
  description: string;
  price_per_km: number;
  base_price: number;
  capacity: number;
}

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [tiers, setTiers] = useState<TierOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    const { data, error } = await supabase
      .from("taxi_tiers")
      .select("*")
      .order("price_per_km");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load taxi tiers",
        variant: "destructive",
      });
      return;
    }

    setTiers(data || []);
  };

  const calculateDistance = (start: Location, end: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((end.lat - start.lat) * Math.PI) / 180;
    const dLon = ((end.lng - start.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((start.lat * Math.PI) / 180) *
        Math.cos((end.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance =
    startLocation && endLocation
      ? calculateDistance(startLocation, endLocation)
      : 0;

  const selectedTierData = tiers.find((t) => t.id === selectedTier);
  const fare = selectedTierData
    ? selectedTierData.base_price + selectedTierData.price_per_km * distance
    : 0;

  const handleBooking = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a taxi",
      });
      window.location.href = "/auth";
      return;
    }

    if (!startLocation || !endLocation || !selectedTier) {
      toast({
        title: "Missing Information",
        description: "Please select both locations and a taxi tier",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: session.user.id,
      tier_id: selectedTier,
      start_lat: startLocation.lat,
      start_lng: startLocation.lng,
      start_address: startLocation.address || "",
      end_lat: endLocation.lat,
      end_lng: endLocation.lng,
      end_address: endLocation.address || "",
      distance_km: distance,
      fare: fare,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking Confirmed! 🚁",
      description: "Your flying taxi is on the way!",
    });

    // Reset form
    setStartLocation(null);
    setEndLocation(null);
    setSelectedTier(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
  };

  const handleLocationSelect = (start: Location | null, end: Location | null) => {
    setStartLocation(start);
    setEndLocation(end);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-primary to-primary-glow p-6 rounded-full shadow-2xl">
              <Plane className="h-20 w-20 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SkyTaxi Bengaluru
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Experience the future of urban transportation. Book your flying taxi and soar above traffic.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl transition-all text-lg px-8"
            onClick={() => (window.location.href = "/auth")}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-primary-glow p-2 rounded-lg">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SkyTaxi
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{session.user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary-glow rounded-full" />
                Select Your Route
              </h2>
              <div className="h-[500px]">
                <BookingMap onLocationSelect={handleLocationSelect} />
              </div>
            </div>

            {startLocation && endLocation && (
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <TierSelector
                  tiers={tiers}
                  selectedTier={selectedTier}
                  onSelect={setSelectedTier}
                  distance={distance}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              startLocation={startLocation}
              endLocation={endLocation}
              distance={distance}
              selectedTierName={selectedTierData?.name || null}
              fare={fare}
              onBook={handleBooking}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;