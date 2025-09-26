import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [background, setBackground] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setExistingProfile(data);
      setName(data.name || "");
      setTargetRole(data.target_role || "");
      setBackground(data.background || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        name: name.trim(),
        target_role: targetRole,
        background: background.trim()
      };

      let error;
      if (existingProfile) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Profile saved successfully!",
        description: "Your profile has been updated."
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about yourself to get personalized interview practice
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="targetRole">Target Role</Label>
              <Select value={targetRole} onValueChange={setTargetRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SDR">SDR (Sales Development Representative)</SelectItem>
                  <SelectItem value="AE">AE (Account Executive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="background">Current/Most Recent Background</Label>
              <Textarea
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="ex: Server at Olive Garden, hospitality"
                className="min-h-[80px]"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Include your role and industry to help personalize your interview practice
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : existingProfile ? "Update Profile" : "Complete Setup"}
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              onClick={handleSkip}
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}