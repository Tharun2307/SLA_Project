import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '@/services/api';
import { Ticket, Send, AlertCircle, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RaiseTicket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await ticketApi.create({ title, description, category, priority });
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f5ff', '#a855f7', '#22c55e'],
      });
      setTimeout(() => navigate('/user/my-tickets'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-96 animate-score-pop">
        <div className="text-center glass-card p-12 neon-border-green">
          <CheckCircle size={64} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ticket Raised! 🎉</h2>
          <p className="text-gray-400">Your issue has been submitted and auto-routed to the department.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Ticket size={22} className="text-cyan-400" />
          Raise a New Ticket
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the issue..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all appearance-none"
              >
                <option value="" className="bg-gray-900">Select category</option>
                <option value="IT" className="bg-gray-900">🖥️ IT (WiFi, Computers, Software)</option>
                <option value="HOUSEKEEPING" className="bg-gray-900">🧹 Housekeeping (Cleaning, Furniture)</option>
                <option value="ELECTRICAL" className="bg-gray-900">⚡ Electrical (Power, Lights, Fans)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all appearance-none"
              >
                <option value="LOW" className="bg-gray-900">🟢 Low</option>
                <option value="MEDIUM" className="bg-gray-900">🟡 Medium</option>
                <option value="HIGH" className="bg-gray-900">🔴 High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #a855f7)' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
