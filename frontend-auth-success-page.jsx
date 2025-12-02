// Create this file in your frontend: src/pages/AuthSuccess.jsx or pages/auth/success.jsx

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get tokens and user from URL
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userString = searchParams.get('user');

    if (accessToken && refreshToken && userString) {
      try {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Parse and store user data
        const user = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem('user', JSON.stringify(user));

        console.log('✅ User logged in successfully:', user);

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/home'); // Change '/home' to your actual home route
          window.location.reload(); // Reload to update auth state
        }, 500);
      } catch (error) {
        console.error('❌ Error processing auth tokens:', error);
        navigate('/login');
      }
    } else {
      console.error('❌ Missing auth tokens in URL');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <div
        className="spinner"
        style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p style={{ marginTop: '20px', fontSize: '18px' }}>
        Completing sign in...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
