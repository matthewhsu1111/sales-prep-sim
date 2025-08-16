export default function ProfileSetup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Complete your profile to get started
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-medium mb-4">Setup Steps</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Personal Information</li>
              <li>• Career Goals</li>
              <li>• Experience Level</li>
              <li>• Interview Preferences</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Profile setup coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}