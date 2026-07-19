import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ticketApi, departmentApi } from '@/services/api';
import { getPriorityColor, formatDate } from '@/lib/utils';
import { ClipboardList, UserPlus, CheckCircle } from 'lucide-react';

export default function UnassignedTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await departmentApi.getAll();
        setDepartments(deptRes.data);

        // Find department name from user's departmentId
        const myDept = deptRes.data.find(d => d.id === user.departmentId);
        if (myDept) {
          const ticketsRes = await ticketApi.getUnassigned(myDept.name);
          setTickets(ticketsRes.data);
        }

        // Fetch employees in department
        if (user.departmentId) {
          const membersRes = await departmentApi.getMembers(user.departmentId);
          const deptEmployees = membersRes.data.filter(
            u => u.role === 'EMPLOYEE' || u.role === 'DEPT_HEAD'
          );
          setEmployees(deptEmployees);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.departmentId]);

  const handleAssign = async (ticketId) => {
    if (!selectedEmployee) return;
    try {
      await ticketApi.assign(ticketId, { assignedToUserId: selectedEmployee });
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      setAssigning(null);
      setSelectedEmployee('');
      setSuccessMsg('Ticket assigned successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

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
        <ClipboardList size={24} className="text-amber-400" />
        Unassigned Tickets
        <span className="text-sm font-normal text-gray-500 ml-2">({tickets.length})</span>
      </h1>

      {successMsg && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-sm animate-slide-up">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CheckCircle size={48} className="mx-auto mb-3 text-emerald-400 opacity-30" />
          <p className="text-gray-500">All tickets have been assigned! 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{ticket.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{ticket.description}</p>
                  <p className="text-xs text-gray-600">
                    Created: {formatDate(ticket.createdAt)} · SLA Deadline: {formatDate(ticket.slaDeadline)}
                  </p>
                </div>

                {assigning === ticket.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50 appearance-none"
                    >
                      <option value="" className="bg-gray-900">Select employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id} className="bg-gray-900">
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssign(ticket.id)}
                      disabled={!selectedEmployee}
                      className="px-3 py-2 rounded-lg text-white text-xs font-medium disabled:opacity-50 transition-all"
                      style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => { setAssigning(null); setSelectedEmployee(''); }}
                      className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAssigning(ticket.id)}
                    className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                  >
                    <UserPlus size={14} />
                    Assign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
