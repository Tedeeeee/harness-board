import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-sm text-gray-500 mb-6">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-sm text-gray-900 underline">홈으로 돌아가기</Link>
    </div>
  );
}
