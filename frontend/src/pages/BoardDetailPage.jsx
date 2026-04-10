import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '');
}

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (err) {
        setError(err.response?.status === 404
          ? '존재하지 않는 게시글입니다.'
          : '게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  async function handleDelete() {
    const password = window.prompt('비밀번호를 입력하세요');
    if (!password) return;

    try {
      await deletePost(id, { password });
      navigate('/board');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('비밀번호가 일치하지 않습니다.');
      } else {
        alert('삭제에 실패했습니다.');
      }
    }
  }

  if (loading) {
    return <p className="max-w-4xl mx-auto px-6 py-8 text-sm text-gray-400">로딩 중...</p>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Link to="/board" className="text-sm text-gray-900 underline">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="flex gap-4 text-xs text-gray-400">
          <span>작성자: {post.author}</span>
          <span>작성일: {formatDate(post.createdAt)}</span>
          <span>조회수: {post.views}</span>
        </div>
      </div>

      <div className="min-h-[200px] p-4 border border-gray-100 bg-white rounded text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
        {post.content}
      </div>

      <div className="flex gap-2">
        <Link
          to="/board"
          className="px-4 py-2 border border-gray-200 text-sm rounded hover:bg-gray-50"
        >
          목록
        </Link>
        <div className="flex-1" />
        <Link
          to={`/board/${id}/edit`}
          className="px-4 py-2 border border-gray-200 text-sm rounded hover:bg-gray-50"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
