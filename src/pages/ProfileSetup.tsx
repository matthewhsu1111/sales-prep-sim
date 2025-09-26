import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
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
    
    setLoading(true);
    
    try {
      const profileData = {
        user_id: user.id,
        name,
        target_role: targetRole,
        background
      };

      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert(profileData);
        
        if (error) throw error;
      }

      toast({
        title: "Profile saved successfully!",
        description: "Your profile has been updated."
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about yourself to get personalized interview practice
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="targetRole">What role are you targeting?</Label>
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SDR">SDR (Sales Development Representative)</SelectItem>
                  <SelectItem value="AE">AE (Account Executive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="background">What's your current/most recent role and industry?</Label>
              <Textarea
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="ex: Server at Olive Garden, hospitality"
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : existingProfile ? "Update Profile" : "Save Profile"}
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