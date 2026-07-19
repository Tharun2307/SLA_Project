import { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { Settings, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({ slaHours: 4, rewardPoints: 10, penaltyPoints: -5, personalRewardPoints: 2 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getSettings()
      .then((res) => setSettings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await adminApi.updateSettings(settings);
      setSettings(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings size={24} className="text-amber-400" />
        System Settings
      </h1>

      {success && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-sm animate-slide-up">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="glass-card p-8">
        <h2 className="text-lg font-semibold text-white mb-6">SLA & Gamification Configuration</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">SLA Hours</label>
            <p className="text-xs text-gray-500 mb-2">Maximum hours allowed to resolve a ticket before penalty</p>
            <input
              type="number"
              value={settings.slaHours}
              onChange={(e) => setSettings({ ...settings, slaHours: parseInt(e.target.value) || 0 })}
              min={1}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reward Points (Department)</label>
            <p className="text-xs text-gray-500 mb-2">Points added to department honor score for on-time resolution</p>
            <input
              type="number"
              value={settings.rewardPoints}
              onChange={(e) => setSettings({ ...settings, rewardPoints: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Penalty Points (Department)</label>
            <p className="text-xs text-gray-500 mb-2">Points deducted from department honor score for late resolution (negative value)</p>
            <input
              type="number"
              value={settings.penaltyPoints}
              onChange={(e) => setSettings({ ...settings, penaltyPoints: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Personal Reward Points</label>
            <p className="text-xs text-gray-500 mb-2">Points added to employee's personal honor score on-time</p>
            <input
              type="number"
              value={settings.personalRewardPoints}
              onChange={(e) => setSettings({ ...settings, personalRewardPoints: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
