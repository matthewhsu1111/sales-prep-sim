-- Upgrade matthewhsu10@gmail.com to pro tier
UPDATE profiles 
SET 
  subscription_tier = 'pro',
  subscription_status = 'active',
  subscription_end_date = '2099-12-31 23:59:59+00',
  updated_at = now()
WHERE user_id = '7ad90e52-ea60-427a-bd4b-dd00fb38a6f2';