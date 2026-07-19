import { useState, useEffect } from 'react';
import { departmentApi } from '@/services/api';
import { Building2, Trophy, Award, AlertTriangle } from 'lucide-react';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentApi.getScores()
      .then((res) => setDepartments(res.data))
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

  const deptIcons = { IT: '🖥️', HOUSEKEEPING: '🧹', ELECTRICAL: '⚡' };
  const deptColors = {
    IT: { border: 'border-sky-500/25', shadow: 'shadow-neon-cyan', glow: 'text-sky-400' },
    HOUSEKEEPING: { border: 'border-emerald-500/25', shadow: 'shadow-neon-green', glow: 'text-emerald-400' },
    ELECTRICAL: { border: 'border-amber-500/25', shadow: 'shadow-neon-amber', glow: 'text-amber-400' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Building2 size={24} className="text-amber-400" />
        Department Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept, index) => {
          const colors = deptColors[dept.name] || deptColors.IT;
          return (
            <div key={dept.id} className={`glass-card p-6 border ${colors.border} ${colors.shadow} hover:scale-[1.02] transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{deptIcons[dept.name] || '🏢'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{dept.name}</h3>
                    <p className="text-xs text-gray-500">Department</p>
                  </div>
                </div>
                {index === 0 && (
                  <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
                    👑 Leader
                  </span>
                )}
              </div>

              <div className="text-center py-4 mb-4 rounded-lg bg-white/3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Honor Score</p>
                <p className={`text-4xl font-bold ${colors.glow}`}
                  style={{ textShadow: `0 0 20px currentColor` }}>
                  {dept.honorScore}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award size={14} className="text-emerald-400" />
                    <span className="text-xs text-gray-500">Rewards</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">{dept.totalRewards}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={14} className="text-red-400" />
                    <span className="text-xs text-gray-500">Penalties</span>
                  </div>
                  <p className="text-lg font-bold text-red-400">{dept.totalPenalties}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
