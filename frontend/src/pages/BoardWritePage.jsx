import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../api/posts';

export default function BoardWritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', password: '', content: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = '제목을 입력해주세요.';
    else if (form.title.trim().length > 100) e.title = '제목은 100자 이내로 입력해주세요.';
    if (!form.author.trim()) e.author = '작성자명을 입력해주세요.';
    else if (form.author.trim().length > 20) e.author = '작성자명은 20자 이내로 입력해주세요.';
    if (!form.password || form.password.length < 4) e.password = '비밀번호는 4자리 이상 입력해주세요.';
    if (!form.content.trim()) e.content = '내용을 입력해주세요.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      const { id } = await createPost(form);
      navigate(`/board/${id}`);
    } catch (err) {
      const msg = err.response?.data?.error || '등록에 실패했습니다.';
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">글쓰기</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="제목을 입력하세요"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
            <input
              type="text"
              value={form.author}
              onChange={handleChange('author')}
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="작성자명"
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="수정/삭제 시 필요 (4자리 이상)"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea
            value={form.content}
            onChange={handleChange('content')}
            rows={12}
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-y"
            placeholder="내용을 입력하세요"
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
            {submitting ? '등록 중...' : '등록'}
          </button>
          <Link
            to="/board"
            className="px-6 py-2 border border-gray-200 text-sm rounded hover:bg-gray-50"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
