import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ticketApi } from '@/services/api';
import { LayoutDashboard, ClipboardList, CheckCircle, Clock, Award, ArrowRight, TrendingUp } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
    ticketApi.getMy()
      .then((res) => setTickets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: tickets.length,
    active: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    onTime: tickets.filter(t => t.status === 'RESOLVED' && t.resolvedAt && t.slaDeadline &&
      new Date(t.resolvedAt) <= new Date(t.slaDeadline)).length,
  };

  const onTimeRate = stats.resolved > 0 ? Math.round((stats.onTime / stats.resolved) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 neon-border-green">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard size={24} className="text-emerald-400" />
              Employee Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your assigned tickets efficiently</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Personal Honor Score</p>
            <p className="text-3xl font-bold neon-text-green">{user?.personalHonorScore || 0}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Assigned', value: stats.total, icon: ClipboardList, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'Active', value: stats.active, icon: Clock, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'On-Time Rate', value: `${onTimeRate}%`, icon: TrendingUp, color: 'text-purple-400', border: 'border-purple-500/20' },
        ].map((stat) => (
          <div key={stat.label} className={`glass-card p-5 border ${stat.border} hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Tickets Preview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active Assignments</h3>
          <Link to="/employee/assigned" className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {tickets.filter(t => t.status !== 'RESOLVED').length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award size={40} className="mx-auto mb-3 opacity-30" />
            <p>No active assignments. Great job! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.filter(t => t.status !== 'RESOLVED').slice(0, 5).map((ticket) => {
              const timeLeft = new Date(ticket.slaDeadline) - new Date();
              const isUrgent = timeLeft < 60 * 60 * 1000 && timeLeft > 0;
              const isOverdue = timeLeft <= 0;

              return (
                <div key={ticket.id} className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  isOverdue ? 'bg-red-500/5 border border-red-500/20' :
                  isUrgent ? 'bg-amber-500/5 border border-amber-500/20' :
                  'bg-white/3 hover:bg-white/5 border border-transparent'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isOverdue ? 'bg-red-400 animate-pulse' :
                    isUrgent ? 'bg-amber-400 animate-pulse' :
                    'bg-emerald-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ticket.title}</p>
                    <p className="text-xs text-gray-500">{ticket.category} · {ticket.priority}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${
                      isOverdue ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      {isOverdue ? 'OVERDUE' :
                       isUrgent ? `${Math.floor(timeLeft / 60000)}min left` :
                       `${Math.floor(timeLeft / 3600000)}h left`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
