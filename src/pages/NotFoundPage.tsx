import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <Result
        status="404"
        title={<span className="text-4xl font-extrabold text-slate-900 dark:text-white">404</span>}
        subTitle={<span className="text-slate-600 dark:text-slate-400">Xin lỗi, trang bạn tìm không tồn tại.</span>}
        extra={
          <div className="flex gap-3 justify-center flex-wrap">
            <Button type="primary" onClick={() => navigate('/')}>Về trang chủ</Button>
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        }
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm w-full max-w-xl p-6"
      />
    </div>
  );
}
