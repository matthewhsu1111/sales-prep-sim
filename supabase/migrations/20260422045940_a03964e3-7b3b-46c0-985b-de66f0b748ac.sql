
CREATE OR REPLACE FUNCTION public.prevent_profile_billing_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service role (Stripe webhook) to update anything
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Block changes to billing/subscription fields from non-service-role contexts
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.subscription_end_date IS DISTINCT FROM OLD.subscription_end_date
     OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
     OR NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id
  THEN
    RAISE EXCEPTION 'Billing fields can only be updated by the billing system';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_billing_update_trigger ON public.profiles;

CREATE TRIGGER prevent_profile_billing_update_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_billing_update();
