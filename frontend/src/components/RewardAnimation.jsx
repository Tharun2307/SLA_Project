import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function RewardAnimation({ points, onComplete }) {
  useEffect(() => {
    // Trigger confetti burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#00f5ff', '#22c55e', '#a855f7', '#f59e0b'],
    });

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      {/* Floating +points text */}
      <div
        className="text-center"
        style={{
          animation: 'float-up-fade 2.5s ease-out forwards',
        }}
      >
        <div className="text-7xl font-black neon-text-green mb-2"
          style={{ textShadow: '0 0 40px rgba(34, 197, 94, 0.6)' }}>
          +{points}
        </div>
        <div className="text-xl font-bold text-emerald-400 animate-pulse">
          🏆 ON TIME! 🏆
        </div>
        <div className="text-sm text-emerald-300 mt-1">
          Department Honor Score Updated
        </div>
      </div>

      {/* Green edge glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 80px rgba(34, 197, 94, 0.3)',
          animation: 'fade-in 0.3s ease-out, fade-in 0.3s ease-out 2.5s reverse forwards',
        }} />
    </div>
  );
}
