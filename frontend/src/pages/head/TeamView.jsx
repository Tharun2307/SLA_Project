import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { departmentApi } from '@/services/api';
import { getRoleColor } from '@/lib/utils';
import { Users, Award } from 'lucide-react';

export default function TeamView() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!user.departmentId) return;
        const res = await departmentApi.getMembers(user.departmentId);
        setMembers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [user.departmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Users size={24} className="text-purple-400" />
        Team Members
        <span className="text-sm font-normal text-gray-500 ml-2">({members.length})</span>
      </h1>

      {members.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users size={48} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">No team members found. Ask the admin to assign employees to your department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-5 hover:border-purple-500/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 245, 255, 0.2))' }}>
                  {member.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Award size={14} className="text-amber-400" />
                  <span className="text-sm font-bold text-white">{member.personalHonorScore || 0}</span>
                  <span className="text-xs text-gray-600">pts</span>
                </div>
                <span className={`text-xs font-medium ${getRoleColor(member.role)} bg-white/5 px-2 py-1 rounded-full`}>
                  {member.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
