import { useState, useEffect } from 'react';
import { adminApi, departmentApi } from '@/services/api';
import { getRoleColor } from '@/lib/utils';
import { UserCog, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editDeptId, setEditDeptId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([adminApi.getUsers(), departmentApi.getAll()])
      .then(([usersRes, deptRes]) => {
        setUsers(usersRes.data);
        setDepartments(deptRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (userId) => {
    try {
      await adminApi.updateUserRole(userId, {
        role: editRole,
        departmentId: editDeptId || null,
      });
      // Refresh
      const res = await adminApi.getUsers();
      setUsers(res.data);
      setEditingUser(null);
      setSuccessMsg('User updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update user');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user.id);
    setEditRole(user.role);
    setEditDeptId(user.departmentId || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <UserCog size={24} className="text-amber-400" />
        User Management
        <span className="text-sm font-normal text-gray-500 ml-2">({users.length} users)</span>
      </h1>

      {successMsg && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-sm animate-slide-up">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div className="glass-card overflow-hidden shadow-xl border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="text-left px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</th>
                <th className="text-left px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">System Role</th>
                <th className="text-left px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department Assignment</th>
                <th className="text-left px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal Honor</th>
                <th className="text-left px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-inner"
                           style={{ background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)' }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-sm text-slate-400">{u.email}</td>
                  <td className="px-6 py-4.5">
                    {editingUser === u.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      >
                        {['USER', 'EMPLOYEE', 'DEPT_HEAD', 'ADMIN'].map(r => (
                          <option key={r} value={r} className="bg-slate-900">{r.replace('_', ' ')}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 ${getRoleColor(u.role)}`}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4.5">
                    {editingUser === u.id ? (
                      <select
                        value={editDeptId}
                        onChange={(e) => setEditDeptId(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="" className="bg-slate-900">None / Student</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        {departments.find(d => d.id === u.departmentId)?.name || '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="text-sm font-bold text-slate-200">{u.personalHonorScore || 0} <span className="text-xs text-slate-500 font-normal">pts</span></span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    {editingUser === u.id ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleSave(u.id)}
                          className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                        >
                          <Save size={12} /> Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(u)}
                        className="px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all cursor-pointer"
                      >
                        Edit Assignments
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
