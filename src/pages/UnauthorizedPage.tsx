import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <ShieldOff className="mx-auto text-red-400 mb-4" size={64} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
        <p className="text-gray-500 mb-6">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
