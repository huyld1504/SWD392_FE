import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } catch (err) {
        console.error('Failed to parse user data:', err);
        navigate('/login?error=invalid_response');
      }
    } else {
      navigate('/login?error=missing_credentials');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing login...</p>
      </div>
    </div>
  );
};
