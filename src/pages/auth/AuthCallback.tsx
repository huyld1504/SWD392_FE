import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth2 Login Failed:', decodeURIComponent(error));
      navigate('/login?error=' + error);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        // Store in Zustand (persisted to localStorage)
        setAuth(user, token);

        // Redirect based on role
        const role = user.role;
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'LECTURE') navigate('/lecture/dashboard');
        else navigate('/student/dashboard');
      } catch (err) {
        console.error('Failed to parse user data:', err);
        navigate('/login?error=invalid_response');
      }
    } else {
      navigate('/login?error=missing_credentials');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing login...</p>
      </div>
    </div>
  );
}
