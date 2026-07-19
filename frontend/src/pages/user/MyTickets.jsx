import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ticketApi } from '@/services/api';
import { getStatusColor, getPriorityColor, formatDate } from '@/lib/utils';
import { ListTodo, Search, Filter } from 'lucide-react';

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    ticketApi.getByUser(user.id)
      .then((res) => setTickets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  const filtered = tickets
    .filter(t => filterStatus === 'ALL' || t.status === filterStatus)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ListTodo size={24} className="text-cyan-400" />
          My Tickets
        </h1>
        <span className="text-sm text-gray-500">{filtered.length} tickets</span>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                filterStatus === status
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">No tickets found</td>
                </tr>
              ) : (
                filtered.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{ticket.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-300 bg-white/5 px-2 py-1 rounded">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {formatDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
