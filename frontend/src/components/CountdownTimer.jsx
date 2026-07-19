import { useState, useEffect } from 'react';

export default function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  function getTimeLeft(deadline) {
    const now = new Date().getTime();
    const end = new Date(deadline).getTime();
    const diff = end - now;

    if (diff <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0, percentage: 0 };

    const totalSla = 4 * 60 * 60 * 1000; // 4 hours in ms
    const percentage = Math.min(100, Math.max(0, (diff / totalSla) * 100));

    return {
      expired: false,
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      percentage,
    };
  }

  // Determine color based on time remaining
  const getColor = () => {
    if (timeLeft.expired) return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'text-red-400' };
    if (timeLeft.percentage > 50) return { stroke: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', text: 'text-emerald-400' };
    if (timeLeft.percentage > 25) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'text-amber-400' };
    return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'text-red-400' };
  };

  const color = getColor();
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft.percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg" style={{ background: color.bg }}>
      {/* Circular Progress */}
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          {/* Background circle */}
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 6px ${color.stroke})`,
            }}
          />
        </svg>
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${color.text}`}>
            {timeLeft.expired ? '!' : `${Math.round(timeLeft.percentage)}%`}
          </span>
        </div>
      </div>

      {/* Time Display */}
      <div>
        <p className={`text-sm font-bold ${color.text} ${
          timeLeft.expired || timeLeft.percentage < 15 ? 'animate-pulse' : ''
        }`}>
          {timeLeft.expired
            ? '⚠️ SLA EXPIRED'
            : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
          }
        </p>
        <p className="text-xs text-gray-500">
          {timeLeft.expired ? 'Penalty will apply on resolution' : 'Time remaining'}
        </p>
      </div>
    </div>
  );
}
