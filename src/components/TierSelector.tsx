import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TierOption {
  id: string;
  name: string;
  description: string;
  price_per_km: number;
  base_price: number;
  capacity: number;
}

interface TierSelectorProps {
  tiers: TierOption[];
  selectedTier: string | null;
  onSelect: (tierId: string) => void;
  distance: number;
}

export const TierSelector = ({ tiers, selectedTier, onSelect, distance }: TierSelectorProps) => {
  const calculateFare = (tier: TierOption) => {
    return tier.base_price + (tier.price_per_km * distance);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Choose Your Flying Taxi</h3>
        <p className="text-sm text-muted-foreground">Select the tier that suits your needs</p>
      </div>
      
      <div className="grid gap-3">
        {tiers.map((tier) => {
          const fare = calculateFare(tier);
          const isSelected = selectedTier === tier.id;
          
          return (
            <Card
              key={tier.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-lg" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelect(tier.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{tier.name}</h4>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tier.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {tier.capacity} passengers
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ₹{tier.price_per_km}/km
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₹{fare.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total fare
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};