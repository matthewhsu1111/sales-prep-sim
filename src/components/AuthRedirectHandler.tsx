import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export function AuthRedirectHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Only handle redirect on certain paths
    const shouldRedirect = 
      location.pathname === '/' || 
      location.pathname === '/signin' || 
      location.pathname === '/signup';

    if (!shouldRedirect) return;

    // Check if user has a profile and redirect accordingly
    const checkProfileAndRedirect = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, target_role, has_completed_setup')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // If profile exists and has required fields, go to dashboard
        if (profile?.name && profile?.target_role) {
          navigate('/dashboard', { replace: true });
        } else {
          // Otherwise go to profile setup
          navigate('/profile-setup', { replace: true });
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        navigate('/profile-setup', { replace: true });
      }
    };

    checkProfileAndRedirect();
  }, [user, location.pathname, navigate]);

  return null; // This component doesn't render anything
}
