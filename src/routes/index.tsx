import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;
