import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ticketApi, departmentApi } from '@/services/api';
import { Ticket, ListTodo, CheckCircle, Clock, Trophy, ArrowRight, Zap } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ticketApi.getByUser(user.id),
      departmentApi.getScores(),
    ]).then(([ticketRes, lbRes]) => {
      setTickets(ticketRes.data);
      setLeaderboard(lbRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="glass-card p-6 neon-border-cyan">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap size={24} className="text-cyan-400" />
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Track your tickets and campus issues</p>
          </div>
          <Link
            to="/user/raise-ticket"
            className="gradient-btn flex items-center gap-2"
          >
            <Ticket size={18} />
            Raise a Ticket
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, icon: ListTodo, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Open', value: stats.open, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'In Progress', value: stats.inProgress, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((stat) => (
          <div key={stat.label} className={`glass-card p-5 border ${stat.border} hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
              <span className={`text-xs font-medium ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}>
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Tickets</h3>
            <Link to="/user/my-tickets" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {tickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Ticket size={40} className="mx-auto mb-3 opacity-30" />
              <p>No tickets yet. Raise your first ticket!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    ticket.status === 'RESOLVED' ? 'bg-emerald-400' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ticket.title}</p>
                    <p className="text-xs text-gray-500">{ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    ticket.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini Leaderboard */}
        <div className="glass-card p-6 neon-border-purple">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            Leaderboard
          </h3>
          <div className="space-y-3">
            {leaderboard.map((dept, index) => (
              <div key={dept.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-amber-500/20 text-amber-400' :
                  index === 1 ? 'bg-gray-500/20 text-gray-300' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{dept.name}</p>
                  <p className="text-xs text-gray-500">Honor Score</p>
                </div>
                <p className={`text-lg font-bold ${
                  index === 0 ? 'neon-text-green' : 'text-white'
                }`}>
                  {dept.honorScore}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/leaderboard"
            className="block mt-4 text-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Full Leaderboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
