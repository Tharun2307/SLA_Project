import { useState, useEffect } from 'react';
import { departmentApi } from '@/services/api';
import { Trophy, Zap, Shield, TrendingUp } from 'lucide-react';

export default function Leaderboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    departmentApi.getScores()
      .then((res) => {
        setDepartments(res.data);
        // Trigger bar animation after data loads
        setTimeout(() => setAnimated(true), 100);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      departmentApi.getScores()
        .then((res) => setDepartments(res.data))
        .catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const maxScore = Math.max(...departments.map(d => d.honorScore), 1);
  const deptConfig = {
    IT: { icon: '🖥️', gradient: 'from-sky-500 to-indigo-600', glow: 'rgba(56, 189, 248, 0.25)', text: 'text-sky-400' },
    HOUSEKEEPING: { icon: '🧹', gradient: 'from-emerald-500 to-teal-600', glow: 'rgba(16, 185, 129, 0.25)', text: 'text-emerald-400' },
    ELECTRICAL: { icon: '⚡', gradient: 'from-amber-500 to-amber-600', glow: 'rgba(245, 158, 11, 0.25)', text: 'text-amber-400' },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-4 shadow-md">
          <Trophy size={16} className="text-amber-500" />
          <span className="text-slate-300 text-xs font-semibold tracking-wide uppercase">Live Standings</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Departmental <span className="text-indigo-400">Honor</span> Leaderboard
        </h1>
        <p className="text-slate-500 text-sm">Workspace performance ranking updated in real-time</p>
      </div>

      {/* Podium Visualization */}
      <div className="glass-card p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 80%) pointer-events-none" />

        {/* Bar Chart */}
        <div className="flex items-end justify-center gap-8 md:gap-12 mb-8 pt-8" style={{ height: '340px' }}>
          {departments.map((dept, index) => {
            const config = deptConfig[dept.name] || deptConfig.IT;
            const heightPercent = Math.max(25, (dept.honorScore / maxScore) * 100);
            const isLeader = index === 0;

            return (
              <div key={dept.id} className="flex flex-col items-center gap-3 flex-1 max-w-[180px]">
                {/* Crown for leader */}
                {isLeader ? (
                  <div className="text-2xl animate-float">👑</div>
                ) : (
                  <div className="h-8" />
                )}

                {/* Score */}
                <div className={`text-2xl font-extrabold ${isLeader ? 'neon-text-cyan' : 'text-slate-200'}`}>
                  {dept.honorScore}
                </div>

                {/* Bar */}
                <div className="w-full relative" style={{ height: '200px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-2xl bg-gradient-to-t ${config.gradient} transition-all duration-1000 ease-out`}
                    style={{
                      height: animated ? `${heightPercent}%` : '0%',
                      boxShadow: isLeader 
                        ? `0 0 40px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.2)` 
                        : `0 0 20px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 rounded-t-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        style={{
                          animation: 'shimmer 4s ease-in-out infinite',
                        }} />
                    </div>
                  </div>
                </div>

                {/* Department Name & Icon */}
                <div className="text-center mt-2">
                  <span className="text-2xl mb-1 block">{config.icon}</span>
                  <p className={`text-sm font-semibold tracking-wide text-slate-100`}>{dept.name}</p>
                  <p className={`text-xs font-bold mt-1 uppercase tracking-wider ${
                    isLeader ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : '3rd Place'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shimmer animation */}
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map((dept, index) => {
          const config = deptConfig[dept.name] || deptConfig.IT;
          const isLeader = index === 0;

          return (
            <div key={dept.id} className={`glass-card p-6 transition-all hover:scale-[1.02] ${
              isLeader ? 'neon-border-green' : ''
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${config.gradient}`}>
                  {config.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-white flex items-center gap-2">
                    {dept.name}
                    {isLeader && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">LEADER</span>}
                  </p>
                  <p className="text-xs text-gray-500">Department Performance</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-white/3">
                  <Shield size={16} className="mx-auto mb-1 text-cyan-400" />
                  <p className="text-lg font-bold text-white">{dept.honorScore}</p>
                  <p className="text-[10px] text-gray-600 uppercase">Score</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-emerald-500/5">
                  <TrendingUp size={16} className="mx-auto mb-1 text-emerald-400" />
                  <p className="text-lg font-bold text-emerald-400">{dept.totalRewards}</p>
                  <p className="text-[10px] text-gray-600 uppercase">Rewards</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-500/5">
                  <Zap size={16} className="mx-auto mb-1 text-red-400" />
                  <p className="text-lg font-bold text-red-400">{dept.totalPenalties}</p>
                  <p className="text-[10px] text-gray-600 uppercase">Penalties</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
