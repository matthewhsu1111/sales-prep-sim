import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found');
      return new Response('No signature', { status: 400 });
    }

    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const body = await req.text();
    
    // Verify webhook signature
    const encoder = new TextEncoder();
    const parts = signature.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const signatureHash = parts.find(p => p.startsWith('v1='))?.split('=')[1];
    
    if (!timestamp || !signatureHash) {
      console.error('Invalid signature format');
      return new Response('Invalid signature', { status: 400 });
    }

    const payload = `${timestamp}.${body}`;
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(STRIPE_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );
    
    const expectedHash = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedHash !== signatureHash) {
      console.error('Signature verification failed');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Stripe webhook event:', event.type);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const status = subscription.status; // active, past_due, canceled, etc.
        const endDate = new Date(subscription.current_period_end * 1000).toISOString();

        // Find user by customer email
        const customerEmail = subscription.metadata?.email || event.data.object.customer_email;
        
        if (!customerEmail) {
          console.error('No customer email found in subscription');
          break;
        }

        // Update profile with subscription data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: status,
            subscription_end_date: endDate,
            subscription_tier: 'pro'
          })
          .eq('user_id', (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === customerEmail)?.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log(`Updated subscription for customer ${customerId}: ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            subscription_tier: 'free'
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (updateError) {
          console.error('Error updating canceled subscription:', updateError);
        } else {
          console.log(`Canceled subscription ${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active'
            })
            .eq('stripe_subscription_id', subscriptionId);

          if (updateError) {
            console.error('Error updating payment success:', updateError);
          } else {
            console.log(`Payment succeeded for subscription ${subscriptionId}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due'
            })
            .eq('stripe_subscription_id', subscriptionId);

          if (updateError) {
            console.error('Error updating payment failure:', updateError);
          } else {
            console.log(`Payment failed for subscription ${subscriptionId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
