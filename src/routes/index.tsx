import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import { AuthCallback } from '../pages/AuthCallback';
import SignupPage from '../pages/SignupPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: 'signup',
    element: <SignupPage />,
  }
  // Example protected route:
  // {
  //   path: '/dashboard',
  //   element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  // },
]);

export default router;
