export const GOOGLE_AUTH_CONFIG = {
  // These will be used in the OAuth flow
  scopes: [
    'openid',
    'email',
    'profile'
  ],
  queryParams: {
    access_type: 'offline',    // Get refresh token
    prompt: 'consent'          // Force consent screen
  }
}; 