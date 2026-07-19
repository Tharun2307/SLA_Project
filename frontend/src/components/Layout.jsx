import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Ticket, ListTodo, Trophy, Users, Settings, Building2,
  BarChart3, ClipboardList, UserCog, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const roleConfig = {
  USER: {
    label: 'Student / Faculty',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    navItems: [
      { to: '/user', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/user/raise-ticket', icon: Ticket, label: 'Raise Ticket' },
      { to: '/user/my-tickets', icon: ListTodo, label: 'My Tickets' },
      { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
  EMPLOYEE: {
    label: 'Employee',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    navItems: [
      { to: '/employee', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/employee/assigned', icon: ClipboardList, label: 'My Assignments' },
      { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
  DEPT_HEAD: {
    label: 'Department Head',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    navItems: [
      { to: '/head', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/head/unassigned', icon: ClipboardList, label: 'Unassigned Tickets' },
      { to: '/head/team', icon: Users, label: 'Team' },
      { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
  ADMIN: {
    label: 'Administrator',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    navItems: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/admin/users', icon: UserCog, label: 'User Management' },
      { to: '/admin/departments', icon: Building2, label: 'Departments' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
      { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const config = roleConfig[user?.role] || roleConfig.USER;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#030712]">
      {/* Sidebar */}
      <aside
        className="h-full shrink-0 transition-all duration-300 flex flex-col relative"
        style={{
          width: sidebarOpen ? '16rem' : '5rem',
          background: 'linear-gradient(180deg, #090d16 0%, #030712 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}>
            🎮
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in truncate">
              <h1 className="text-sm font-bold text-white tracking-tight">CampusTickets</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Workspace</p>
            </div>
          )}
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className={`mx-4 mt-4 px-3 py-2 rounded-lg ${config.bgColor} border ${config.borderColor} shrink-0`}>
            <p className={`text-xs font-semibold ${config.color}`}>{config.label}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.name}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-6 space-y-1 overflow-y-auto">
          {config.navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-500/10 text-white border-l-2 border-indigo-500 pl-2'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`
              }
            >
              <item.icon size={20} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {sidebarOpen && (
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Logout */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-50 cursor-pointer"
        >
          {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="h-full flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between shrink-0"
          style={{
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            paddingLeft: '3.5rem',
            paddingRight: '2rem',
            paddingTop: '1rem',
            paddingBottom: '1rem'
          }}
        >
          <div>
            <h2 className="text-lg font-semibold text-white">
              Welcome back, <span className={config.color}>{user?.name}</span>
            </h2>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bgColor} ${config.color} border ${config.borderColor}`}>
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </header>

        {/* Page Content (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto"
          style={{
            paddingLeft: '3.5rem',
            paddingRight: '2rem',
            paddingTop: '2rem',
            paddingBottom: '2rem'
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
