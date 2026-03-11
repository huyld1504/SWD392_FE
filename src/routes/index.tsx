import { createBrowserRouter, Navigate } from 'react-router';

// Layout
import MainLayout from '@/components/layout/MainLayout';

// Public pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard';
import ArticleListPage from '@/pages/student/ArticleListPage';
import StudentArticleDetailPage from '@/pages/student/ArticleDetailPage';
import BookmarkPage from '@/pages/student/BookmarkPage';
import WalletPage from '@/pages/student/WalletPage';
import StudentMyArticlesPage from '@/pages/student/MyArticlesPage';
import StudentCreateArticlePage from '@/pages/student/CreateArticlePage';
import StudentEditArticlePage from '@/pages/student/EditArticlePage';

// Lecture pages
import LectureDashboard from '@/pages/lecture/LectureDashboard';
import MyArticlesPage from '@/pages/lecture/MyArticlesPage';
import CreateArticlePage from '@/pages/lecture/CreateArticlePage';
import EditArticlePage from '@/pages/lecture/EditArticlePage';
import LectureArticleDetailPage from '@/pages/lecture/ArticleDetailPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminArticlesPage from '@/pages/admin/AdminArticlesPage';

// Guards
import ProtectedRoute from '@/components/common/ProtectedRoute';

const router = createBrowserRouter([
  // ─── Public routes ───────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },

  // ─── Student routes ──────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/student',
            element: <Navigate to="/student/dashboard" replace />,
          },
          {
            path: '/student/dashboard',
            element: <StudentDashboard />,
          },
          {
            path: '/student/articles',
            element: <ArticleListPage />,
          },
          {
            path: '/student/articles/:id',
            element: <StudentArticleDetailPage />,
          },
          {
            path: '/student/bookmarks',
            element: <BookmarkPage />,
          },
          {
            path: '/student/wallet',
            element: <WalletPage />,
          },
          {
            path: '/student/my-articles',
            element: <StudentMyArticlesPage />,
          },
          {
            path: '/student/my-articles/new',
            element: <StudentCreateArticlePage />,
          },
          {
            path: '/student/my-articles/:id/edit',
            element: <StudentEditArticlePage />,
          },
        ],
      },
    ],
  },

  // ─── Lecture routes ──────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['LECTURE', 'ADMIN']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/lecture',
            element: <Navigate to="/lecture/dashboard" replace />,
          },
          {
            path: '/lecture/dashboard',
            element: <LectureDashboard />,
          },
          {
            path: '/lecture/articles',
            element: <MyArticlesPage />,
          },
          {
            path: '/lecture/articles/new',
            element: <CreateArticlePage />,
          },
          {
            path: '/lecture/articles/:id/edit',
            element: <EditArticlePage />,
          },
          {
            path: '/lecture/articles/:id',
            element: <LectureArticleDetailPage />,
          },
        ],
      },
    ],
  },

  // ─── Admin routes ────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/admin',
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: '/admin/dashboard',
            element: <AdminDashboard />,
          },
          {
            path: '/admin/articles',
            element: <AdminArticlesPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
