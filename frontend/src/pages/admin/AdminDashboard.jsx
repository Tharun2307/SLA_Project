import { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { LayoutDashboard, Ticket, Users, Clock, TrendingUp, Award, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6" style={{ border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: '0 0 15px rgba(245, 158, 11, 0.05)' }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LayoutDashboard size={24} className="text-amber-400" />
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-1">Global overview of the campus ticket system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: stats?.totalTickets || 0, icon: Ticket, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'Open Tickets', value: stats?.openTickets || 0, icon: Clock, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Resolved', value: stats?.resolvedTickets || 0, icon: Award, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-400', border: 'border-purple-500/20' },
        ].map((stat) => (
          <div key={stat.label} className={`glass-card p-5 border ${stat.border} hover:scale-[1.02] transition-transform`}>
            <stat.icon size={20} className={`${stat.color} mb-3`} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* SLA & Resolution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 neon-border-cyan">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-400" />
            SLA Compliance
          </h3>
          <p className="text-5xl font-bold neon-text-cyan">{stats?.slaComplianceRate || 0}%</p>
          <p className="text-xs text-gray-500 mt-2">Tickets resolved within SLA deadline</p>
        </div>
        <div className="glass-card p-6 neon-border-purple">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Clock size={20} className="text-purple-400" />
            Avg Resolution Time
          </h3>
          <p className="text-5xl font-bold neon-text-purple">{stats?.avgResolutionMinutes || 0}<span className="text-lg">min</span></p>
          <p className="text-xs text-gray-500 mt-2">Average time to resolve tickets</p>
        </div>
      </div>

      {/* Department Rankings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-amber-400" />
          Department Rankings
        </h3>
        <div className="space-y-3">
          {(stats?.departments || []).map((dept, index) => (
            <div key={dept.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                index === 0 ? 'bg-amber-500/20 text-amber-400' :
                index === 1 ? 'bg-gray-500/20 text-gray-300' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                #{index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{dept.name}</p>
                <p className="text-xs text-gray-500">
                  {dept.totalRewards} rewards · {dept.totalPenalties} penalties
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${index === 0 ? 'neon-text-green' : 'text-white'}`}>
                  {dept.honorScore}
                </p>
                <p className="text-xs text-gray-600">Honor Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
