// lib/auth.ts - Supabase authentication (mock mode compatible)

const isMockMode = !process.env.SUPABASE_URL || 
                   process.env.SUPABASE_URL.includes('your_');

// Mock auth for development
const mockUser = {
  id: 'mock_user_123',
  email: 'demo@reviewability.app',
  name: 'Demo User',
};

function mockSignUp(email: string, password: string) {
  return Promise.resolve({ data: { user: mockUser }, error: null });
}

function mockSignIn(email: string, password: string) {
  return Promise.resolve({ data: { user: mockUser, session: { access_token: 'mock' } }, error: null });
}

function mockSignOut() {
  return Promise.resolve({ error: null });
}

function mockGetUser() {
  return Promise.resolve({ data: { user: mockUser }, error: null });
}

function mockGetSession() {
  return Promise.resolve({ data: { session: { user: mockUser } }, error: null });
}

// Real Supabase integration
async function realSignUp(email: string, password: string) {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  return supabase.auth.signUp({ email, password });
}

async function realSignIn(email: string, password: string) {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  return supabase.auth.signInWithPassword({ email, password });
}

async function realSignOut() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  return supabase.auth.signOut();
}

async function realGetUser() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  return supabase.auth.getUser();
}

async function realGetSession() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  return supabase.auth.getSession();
}

// Export mock-compatible API
export const auth = {
  async signUp(email: string, password: string) {
    if (isMockMode) return mockSignUp(email, password);
    return realSignUp(email, password);
  },
  async signIn(email: string, password: string) {
    if (isMockMode) return mockSignIn(email, password);
    return realSignIn(email, password);
  },
  async signOut() {
    if (isMockMode) return mockSignOut();
    return realSignOut();
  },
  async getUser() {
    if (isMockMode) return mockGetUser();
    return realGetUser();
  },
  async getSession() {
    if (isMockMode) return mockGetSession();
    return realGetSession();
  },
  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Mock: just call with logged in state
    setTimeout(() => callback('SIGNED_IN', { user: mockUser }), 0);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
};

export async function getServerUser() {
  if (isMockMode) return mockUser;
  const { data: { user }, error } = await realGetUser();
  if (error || !user) return null;
  return user;
}

export const mockMode = isMockMode;
console.log(isMockMode ? '🔐 Auth: MOCK mode (no Supabase)' : '🔐 Auth: Supabase connected');

export default auth;