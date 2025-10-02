import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isTriMonthly, setIsTriMonthly] = useState(true);

  const handleUpgrade = () => {
    const checkoutUrl = isTriMonthly
      ? "https://buy.stripe.com/6oU6oGdfQ5er8s0cZzdZ601"
      : "https://buy.stripe.com/eVq4gygs2eP18s07FfdZ600";
    
    window.open(checkoutUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upgrade Your Subscription</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've reached the maximum number of interviews for free users. Upgrade your subscription to practice unlimited interviews.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
            <span className={`text-sm font-medium ${!isTriMonthly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isTriMonthly}
              onCheckedChange={setIsTriMonthly}
            />
            <span className={`text-sm font-medium ${isTriMonthly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Tri-Monthly
            </span>
            {isTriMonthly && (
              <Badge variant="secondary" className="ml-1">
                Save 20%
              </Badge>
            )}
          </div>

          {/* Pricing Display */}
          <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">
              ${isTriMonthly ? '48' : '20'}
              <span className="text-lg font-normal text-muted-foreground">
                /{isTriMonthly ? '3 months' : 'month'}
              </span>
            </div>
            {isTriMonthly && (
              <p className="text-sm text-muted-foreground">
                Billed as $48 every 3 months
              </p>
            )}
          </div>

          {/* Upgrade Button */}
          <Button 
            onClick={handleUpgrade}
            className="w-full"
            size="lg"
          >
            Upgrade Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You'll be redirected to Stripe to complete your purchase
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
