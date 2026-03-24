// lib/billing.ts - Stripe integration
// Works in mock mode without real key

const isMockMode = !process.env.STRIPE_SECRET_KEY || 
                   process.env.STRIPE_SECRET_KEY.includes('your_') ||
                   process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');

const STRIPE_PRICES = {
  free: null,
  pro: 'price_pro_monthly', // $29/mo
  enterprise: 'price_enterprise_monthly', // $99/mo
};

// Mock checkout for development
function mockCreateCheckout(priceId: string, customerId?: string) {
  console.log('💳 Stripe: Creating mock checkout for', priceId);
  return Promise.resolve({
    url: 'https://buy.stripe.com/test/mock-checkout-session',
    sessionId: 'mock_session_' + Date.now(),
  });
}

function mockCreatePortal(customerId: string) {
  return Promise.resolve({
    url: 'https://billing.stripe.com/mock-portal',
  });
}

function mockGetSubscription(customerId: string) {
  return Promise.resolve({
    status: 'active',
    plan: 'pro',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

// Real Stripe integration
async function realCreateCheckout(priceId: string, customerId?: string) {
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    customer: customerId,
  });
  
  return { url: session.url, sessionId: session.id };
}

async function realCreatePortal(customerId: string) {
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.NEXT_PUBLIC_APP_URL + '/settings',
  });
  
  return { url: session.url };
}

async function realGetSubscription(customerId: string) {
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });
  
  if (!subscriptions.data[0]) return null;
  
  const sub = subscriptions.data[0];
  return {
    status: sub.status,
    plan: sub.items.data[0].price.id,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
  };
}

// Export API
export async function createCheckoutSession(
  plan: 'pro' | 'enterprise',
  customerId?: string
) {
  const priceId = plan === 'pro' 
    ? 'price_pro_monthly' 
    : 'price_enterprise_monthly';
  
  if (isMockMode) {
    // Use the existing Stripe checkout link from memory
    return {
      url: 'https://buy.stripe.com/cNi14pfIt3jm5Cx79O2Fa00',
      sessionId: 'mock_' + Date.now(),
    };
  }
  return realCreateCheckout(priceId, customerId);
}

export async function createCustomerPortal(customerId: string) {
  if (isMockMode) return mockCreatePortal(customerId);
  return realCreatePortal(customerId);
}

export async function getSubscription(customerId: string) {
  if (isMockMode) return mockGetSubscription(customerId);
  return realGetSubscription(customerId);
}

export async function cancelSubscription(subscriptionId: string) {
  if (isMockMode) {
    console.log('💳 Stripe: Mock cancel subscription', subscriptionId);
    return { success: true };
  }
  
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  await stripe.subscriptions.cancel(subscriptionId);
  return { success: true };
}

export const mockMode = isMockMode;
console.log(isMockMode ? '💳 Stripe: MOCK mode (test key)' : '💳 Stripe: Connected');

export default { createCheckoutSession, createCustomerPortal, getSubscription, cancelSubscription };