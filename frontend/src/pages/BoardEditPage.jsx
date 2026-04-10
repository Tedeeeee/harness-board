import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, updatePost } from '../api/posts';

export default function BoardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', password: '' });
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getPost(id);
        setForm({ title: data.title, content: data.content, password: '' });
        setAuthor(data.author);
      } catch {
        setErrors({ load: '게시글을 불러올 수 없습니다.' });
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = '제목을 입력해주세요.';
    else if (form.title.trim().length > 100) e.title = '제목은 100자 이내로 입력해주세요.';
    if (!form.content.trim()) e.content = '내용을 입력해주세요.';
    if (!form.password) e.password = '비밀번호를 입력해주세요.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      await updatePost(id, form);
      navigate(`/board/${id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors({ password: '비밀번호가 일치하지 않습니다.' });
      } else {
        setErrors({ submit: err.response?.data?.error || '수정에 실패했습니다.' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  if (loading) {
    return <p className="max-w-4xl mx-auto px-6 py-8 text-sm text-gray-400">로딩 중...</p>;
  }

  if (errors.load) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-gray-500 mb-4">{errors.load}</p>
        <Link to="/board" className="text-sm text-gray-900 underline">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">글 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
          <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500">{author}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="작성 시 입력한 비밀번호"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea
            value={form.content}
            onChange={handleChange('content')}
            rows={12}
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-y"
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
        </div>

        {errors.submit && <p className="text-xs text-red-500">{errors.submit}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? '수정 중...' : '수정'}
          </button>
          <Link
            to={`/board/${id}`}
            className="px-6 py-2 border border-gray-200 text-sm rounded hover:bg-gray-50"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
