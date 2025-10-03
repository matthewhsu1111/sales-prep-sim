import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import JobPostingModal from "@/components/JobPostingModal";
import { User, Briefcase, Plus, Trash2, Calendar } from "lucide-react";

interface Profile {
  name: string;
  target_role: string;
  background: string;
  subscription_tier?: 'free' | 'pro';
}

interface JobPosting {
  id: string;
  company_name: string;
  job_title: string;
  level: string | null;
  description: string | null;
  requirements: string[] | null;
  skills: string[] | null;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({ name: "", target_role: "", background: "", subscription_tier: "free" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isTriMonthly, setIsTriMonthly] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchJobPostings();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, target_role, background, subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || "",
          target_role: data.target_role || "",
          background: data.background || "",
          subscription_tier: (data.subscription_tier as 'free' | 'pro') || 'free'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    }
  };

  const fetchJobPostings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      toast({
        title: "Error",
        description: "Failed to load job postings",
        variant: "destructive"
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          target_role: profile.target_role,
          background: profile.background
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setJobPostings(prev => prev.filter(job => job.id !== jobId));
      toast({
        title: "Success",
        description: "Job posting deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting job posting:', error);
      toast({
        title: "Error",
        description: "Failed to delete job posting",
        variant: "destructive"
      });
    }
  };

  const handleJobSaved = (newJob: JobPosting) => {
    setJobPostings(prev => [newJob, ...prev]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUpgrade = () => {
    const checkoutUrl = isTriMonthly
      ? "https://buy.stripe.com/6oU6oGdfQ5er8s0cZzdZ601"
      : "https://buy.stripe.com/eVq4gygs2eP18s07FfdZ600";
    
    window.open(checkoutUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and job applications
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <Badge variant={profile.subscription_tier === 'pro' ? 'default' : 'secondary'} className="mt-2">
                {profile.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </Badge>
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-sm font-medium py-2">{profile.name || "Not set"}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <p className="text-sm font-medium py-2 text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="target_role">Target Role</Label>
            {isEditing ? (
              <Select
                value={profile.target_role}
                onValueChange={(value) => setProfile(prev => ({ ...prev, target_role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SDR">SDR - Sales Development Representative</SelectItem>
                  <SelectItem value="BDR">BDR - Business Development Representative</SelectItem>
                  <SelectItem value="AE">AE - Account Executive</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium py-2">{profile.target_role || "Not set"}</p>
            )}
          </div>

          <div>
            <Label htmlFor="background">Background</Label>
            {isEditing ? (
              <Textarea
                id="background"
                value={profile.background}
                onChange={(e) => setProfile(prev => ({ ...prev, background: e.target.value }))}
                placeholder="Tell us about your professional background..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm py-2">{profile.background || "Not set"}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Section for Free Users */}
      {profile.subscription_tier === 'free' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upgrade Your Subscription</CardTitle>
            <p className="text-base text-muted-foreground pt-2">
              You've reached the maximum number of interviews for free users. Upgrade your subscription to practice unlimited interviews.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Badge 
                variant="secondary" 
                className={`ml-1 ${isTriMonthly ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-100/50 text-green-700/50 border-green-200/50'}`}
              >
                Save 20%
              </Badge>
            </div>

            {/* Upgrade Button */}
            <Button 
              onClick={handleUpgrade}
              className="w-full"
              size="lg"
            >
              Upgrade Now (${isTriMonthly ? '40' : '50'}/month)
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You'll be redirected to Stripe to complete your purchase
            </p>
          </CardContent>
        </Card>
      )}

      {/* Job Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Job Postings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage your job postings
              </p>
            </div>
          </div>
          <Button onClick={() => setIsJobModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </CardHeader>
        <CardContent>
          {loadingJobs ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobPostings.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">No job postings yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your job postings by adding your first one.
                </p>
                <Button onClick={() => setIsJobModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Job
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{job.job_title}</h3>
                        {job.level && (
                          <Badge variant="secondary">{job.level}</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground font-medium">{job.company_name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Added {formatDate(job.created_at)}</span>
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this job posting for <strong>{job.job_title}</strong> at <strong>{job.company_name}</strong>? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteJob(job.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <JobPostingModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleJobSaved}
      />
    </div>
  );
}