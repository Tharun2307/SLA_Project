import { useEffect } from 'react';

export default function PenaltyAnimation({ points, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      {/* Floating -points text with shake */}
      <div
        className="text-center"
        style={{
          animation: 'float-up-fade 2.5s ease-out forwards',
        }}
      >
        <div className="text-7xl font-black text-red-500 mb-2 animate-shake"
          style={{ textShadow: '0 0 40px rgba(239, 68, 68, 0.6)' }}>
          -{points}
        </div>
        <div className="text-xl font-bold text-red-400 animate-pulse">
          ⚠️ SLA BREACHED ⚠️
        </div>
        <div className="text-sm text-red-300 mt-1">
          Penalty Applied to Department
        </div>
      </div>

      {/* Red edge flash */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(239, 68, 68, 0.4)',
          animation: 'fade-in 0.2s ease-out, fade-in 0.3s ease-out 2.5s reverse forwards',
        }} />
    </div>
  );
}
