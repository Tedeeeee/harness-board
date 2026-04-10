import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchType, keyword });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 flex-col sm:flex-row">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-2 py-1.5 border border-gray-200 text-sm rounded bg-white"
      >
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="author">작성자</option>
      </select>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 px-3 py-1.5 border border-gray-200 text-sm rounded"
      />
      <button
        type="submit"
        className="px-4 py-1.5 border border-gray-200 bg-gray-50 text-sm rounded hover:bg-gray-100"
      >
        검색
      </button>
    </form>
  );
}
