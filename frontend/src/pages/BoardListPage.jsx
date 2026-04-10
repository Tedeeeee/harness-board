import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../api/posts';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '');
}

export default function BoardListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState({
    searchType: searchParams.get('searchType') || '',
    keyword: searchParams.get('keyword') || '',
  });

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    const searchType = searchParams.get('searchType') || '';
    const keyword = searchParams.get('keyword') || '';
    setCurrentPage(page);
    setSearchState({ searchType, keyword });
    fetchPosts(page, searchType, keyword);
  }, [searchParams]);

  async function fetchPosts(page, searchType, keyword) {
    setLoading(true);
    try {
      const data = await getPosts({ page, searchType, keyword });
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalCount(data.totalCount);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  }

  function handleSearch({ searchType, keyword }) {
    const params = new URLSearchParams();
    if (searchType && keyword) {
      params.set('searchType', searchType);
      params.set('keyword', keyword);
    }
    params.set('page', '1');
    setSearchParams(params);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">자유게시판</h1>
        <Link
          to="/board/write"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
        >
          글쓰기
        </Link>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">로딩 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          {searchState.keyword ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="hidden md:table-cell px-3 py-2.5 text-xs text-gray-400 font-medium text-center w-12">번호</th>
                  <th className="px-3 py-2.5 text-xs text-gray-400 font-medium text-left">제목</th>
                  <th className="px-3 py-2.5 text-xs text-gray-400 font-medium text-left w-20">작성자</th>
                  <th className="hidden md:table-cell px-3 py-2.5 text-xs text-gray-400 font-medium text-center w-14">조회</th>
                  <th className="px-3 py-2.5 text-xs text-gray-400 font-medium text-left w-24">작성일</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="hidden md:table-cell px-3 py-2.5 text-sm text-gray-400 text-center">{post.id}</td>
                    <td className="px-3 py-2.5 text-sm">
                      <Link to={`/board/${post.id}`} className="text-gray-700 hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">{post.author}</td>
                    <td className="hidden md:table-cell px-3 py-2.5 text-sm text-gray-400 text-center">{post.views}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-400">{formatDate(post.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
