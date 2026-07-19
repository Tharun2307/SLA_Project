import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { departmentApi, ticketApi } from '@/services/api';
import { Shield, Trophy, ClipboardList, TrendingUp, Users, ArrowRight, Award, AlertTriangle } from 'lucide-react';

export default function HeadDashboard() {
  const { user } = useAuth();
  const [deptStats, setDeptStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          user.departmentId ? departmentApi.getStats(user.departmentId) : Promise.resolve({ data: null }),
          ticketApi.getMy(),
        ]);
        setDeptStats(statsRes.data);
        setTickets(ticketsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.departmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const dept = deptStats?.department;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Honor Score */}
      <div className="glass-card p-8 neon-border-purple">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield size={24} className="text-purple-400" />
              Department Head Dashboard
            </h1>
            <p className="text-gray-400 mt-1">{dept?.name || 'Your'} Department</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Department Honor Score</p>
            <div className="score-display">{dept?.honorScore || 100}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tickets', value: deptStats?.totalTickets || 0, icon: ClipboardList, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'Open', value: deptStats?.openTickets || 0, icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Resolved', value: deptStats?.resolvedTickets || 0, icon: Award, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Team Size', value: deptStats?.teamSize || 0, icon: Users, color: 'text-purple-400', border: 'border-purple-500/20' },
          { label: 'Avg Resolution', value: `${deptStats?.avgResolutionMinutes || 0}m`, icon: TrendingUp, color: 'text-cyan-400', border: 'border-cyan-500/20' },
        ].map((stat) => (
          <div key={stat.label} className={`glass-card p-4 border ${stat.border} hover:scale-[1.02] transition-transform`}>
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Rewards & Penalties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 neon-border-green">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Trophy size={20} className="text-emerald-400" />
            Total Rewards
          </h3>
          <p className="text-4xl font-bold text-emerald-400">{dept?.totalRewards || 0}</p>
          <p className="text-xs text-gray-500 mt-1">On-time resolutions</p>
        </div>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.05)' }}>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-400" />
            Total Penalties
          </h3>
          <p className="text-4xl font-bold text-red-400">{dept?.totalPenalties || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Late resolutions</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/head/unassigned" className="glass-card p-5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-3">
            <ClipboardList size={20} className="text-amber-400" />
            <div>
              <p className="text-sm font-medium text-white">Unassigned Tickets</p>
              <p className="text-xs text-gray-500">Assign tickets to your team</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
        </Link>
        <Link to="/head/team" className="glass-card p-5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Team Management</p>
              <p className="text-xs text-gray-500">View team performance</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
