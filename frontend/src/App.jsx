import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import BoardWritePage from './pages/BoardWritePage';
import BoardEditPage from './pages/BoardEditPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<AboutPage />} />
        <Route path="/board" element={<BoardListPage />} />
        <Route path="/board/write" element={<BoardWritePage />} />
        <Route path="/board/:id" element={<BoardDetailPage />} />
        <Route path="/board/:id/edit" element={<BoardEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
