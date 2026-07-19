import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ticketApi } from '@/services/api';
import { getStatusColor, getPriorityColor } from '@/lib/utils';
import CountdownTimer from '@/components/CountdownTimer';
import RewardAnimation from '@/components/RewardAnimation';
import PenaltyAnimation from '@/components/PenaltyAnimation';
import { ClipboardList, Play, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function AssignedTickets() {
  const { refreshUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolveModal, setResolveModal] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reward, setReward] = useState(null);
  const [penalty, setPenalty] = useState(null);

  const fetchTickets = useCallback(() => {
    ticketApi.getMy()
      .then((res) => setTickets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStartProgress = async (ticketId) => {
    try {
      await ticketApi.updateStatus(ticketId, { status: 'IN_PROGRESS' });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async () => {
    if (!resolveModal) return;
    setSubmitting(true);
    try {
      const res = await ticketApi.resolve(resolveModal, { resolutionNotes });
      const result = res.data;

      if (result.rewarded) {
        setReward({ points: result.pointsAwarded, personal: result.personalPoints });
      } else {
        setPenalty({ points: result.pointsDeducted });
      }

      setResolveModal(null);
      setResolutionNotes('');
      fetchTickets();
      refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Animations */}
      {reward && <RewardAnimation points={reward.points} onComplete={() => setReward(null)} />}
      {penalty && <PenaltyAnimation points={penalty.points} onComplete={() => setPenalty(null)} />}

      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <ClipboardList size={24} className="text-emerald-400" />
        Assigned Tickets
        <span className="text-sm font-normal text-gray-500 ml-2">({tickets.length})</span>
      </h1>

      {tickets.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ClipboardList size={48} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">No tickets assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="glass-card p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="text-sm font-semibold text-white truncate">{ticket.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ticket.description}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border shrink-0 ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">{ticket.category}</span>
              </div>

              {/* Countdown Timer */}
              {ticket.status !== 'RESOLVED' && (
                <div className="mb-4">
                  <CountdownTimer deadline={ticket.slaDeadline} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {ticket.status === 'OPEN' && (
                  <button
                    onClick={() => handleStartProgress(ticket.id)}
                    className="flex-1 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    Start Working
                  </button>
                )}
                {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                  <button
                    onClick={() => setResolveModal(ticket.id)}
                    className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}
                  >
                    <CheckCircle size={16} />
                    Resolve
                  </button>
                )}
                {ticket.status === 'RESOLVED' && (
                  <div className="flex-1 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium text-center">
                    ✓ Resolved
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md mx-4 animate-slide-up neon-border-green">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-400" />
                Resolve Ticket
              </h3>
              <button onClick={() => setResolveModal(null)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Resolution Notes</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe what was done to resolve this issue..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setResolveModal(null)}
                className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}
              >
                {submitting ? 'Resolving...' : 'Confirm & Resolve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
