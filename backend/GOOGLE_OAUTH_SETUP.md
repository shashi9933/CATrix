# Google OAuth Setup Guide

## Steps to Enable Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   http://localhost:5173
   http://localhost:3000
   https://ca-trix.vercel.app
   ```
7. Copy the **Client ID** and **Client Secret**

### Step 2: Frontend Setup - Add Google Sign-In Button

Install the Google Sign-In library in frontend:
```bash
npm install @react-oauth/google
```

### Step 3: Update Frontend Login Component

```typescript
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../utils/api';

export function Login() {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      // Send to backend
      const response = await authAPI.googleLogin(
        decoded.email,
        decoded.name,
        decoded.sub,
        decoded.picture
      );
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Redirect
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </GoogleOAuthProvider>
  );
}
```

### Step 4: Environment Variables

**Frontend (.env.local):**
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_API_URL=https://catrix.onrender.com/api
```

**Vercel Dashboard:**
```
VITE_GOOGLE_CLIENT_ID = your_client_id_here
```

### Step 5: Backend - Google OAuth Endpoint Already Ready

The backend now has `/api/auth/google` endpoint ready to receive:
- `email` - User's email
- `name` - User's name
- `googleId` - Google's unique ID
- `picture` - User's profile picture URL

---

## Testing Locally

1. Add your Google Client ID to `.env`
2. Run frontend and backend locally
3. Click Google Sign-In button
4. Should redirect to dashboard with token stored

---

## Production Deployment

After getting Google credentials:

1. **Vercel Dashboard** → Environment Variables
   - Add: `VITE_GOOGLE_CLIENT_ID=your_production_client_id`

2. **Google Console** → Authorized redirect URIs
   - Add: `https://ca-trix.vercel.app`

3. Redeploy frontend

---

## Troubleshooting

- **"Google Sign-In button not showing"** → Verify Client ID is correct
- **"Google auth popup blocked"** → Check browser popup settings
- **"Token not stored"** → Check browser console for errors
- **"Backend returns error"** → Check Render logs for database issues
