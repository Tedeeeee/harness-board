import { NavLink } from 'react-router-dom';

export default function Header() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium pb-1 ${
      isActive
        ? 'text-gray-900 border-b-2 border-gray-900'
        : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-bold tracking-tight text-gray-900">
          별소프트
        </NavLink>
        <nav className="flex gap-6">
          <NavLink to="/" end className={linkClass}>
            About
          </NavLink>
          <NavLink to="/board" className={linkClass}>
            Board
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
