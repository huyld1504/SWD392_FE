import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 32,
  text = 'Đang tải...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-teal-600" size={size} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">{content}</div>
    );
  }

  return <div className="flex items-center justify-center py-12">{content}</div>;
}
