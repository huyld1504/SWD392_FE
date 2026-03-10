import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error');
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success(`Chào mừng, ${data.user.fullName}!`);
      const role = data.user.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'LECTURE') navigate('/lecture/dashboard');
      else navigate('/student/dashboard');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng nhập thất bại!';
      toast.error(message);
    },
  });

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'invalid_response':
        return 'Unable to process login response. Please try again.';
      case 'missing_credentials':
        return 'Login incomplete. Please try again.';
      default:
        return errorCode ? `Login failed: ${errorCode}` : '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-purple-50/30 flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold text-teal-600">
            StudyShare
          </Link>
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Log in to continue sharing knowledge</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{getErrorMessage(error)}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit((data) => login(data))}
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="you@fpt.edu.vn"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Đang đăng nhập...' : 'Log in'}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <GoogleLoginButton />
                <button
                  type="button"
                  className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Facebook
                  </span>
                </button>
              </div>
            </form>

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
