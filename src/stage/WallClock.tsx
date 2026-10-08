import React, { useState, useEffect } from 'react';

export const WallClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Konversi ke WIB (UTC+7)
  const utc = time.getTime() + time.getTimezoneOffset() * 60000;
  const wibTime = new Date(utc + 3600000 * 7);

  const seconds = wibTime.getSeconds();
  const minutes = wibTime.getMinutes();
  const hours = wibTime.getHours() % 12;

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div 
      className="relative w-12 h-12 rounded-full border-2 border-amber-900/60 bg-amber-50 shadow-md flex items-center justify-center select-none"
      title={`Jam Kantor WIB: ${wibTime.toLocaleTimeString('id-ID')} WIB`}
    >
      {/* Jam markers */}
      <div className="absolute inset-1 rounded-full border border-amber-900/20" />
      
      {/* 12, 3, 6, 9 ticks */}
      <div className="absolute top-0.5 w-0.5 h-1.5 bg-amber-900/70" />
      <div className="absolute bottom-0.5 w-0.5 h-1.5 bg-amber-900/70" />
      <div className="absolute left-0.5 h-0.5 w-1.5 bg-amber-900/70" />
      <div className="absolute right-0.5 h-0.5 w-1.5 bg-amber-900/70" />

      {/* Jarum Jam */}
      <div
        className="absolute w-1 h-3.5 bg-amber-950 rounded-full origin-bottom"
        style={{
          bottom: '50%',
          transform: `rotate(${hourDeg}deg)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Jarum Menit */}
      <div
        className="absolute w-0.5 h-4.5 bg-slate-800 rounded-full origin-bottom"
        style={{
          bottom: '50%',
          transform: `rotate(${minDeg}deg)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Jarum Detik */}
      <div
        className="absolute w-[1px] h-5 bg-rose-500 rounded-full origin-bottom"
        style={{
          bottom: '50%',
          transform: `rotate(${secDeg}deg)`,
        }}
      />

      {/* Titik Tengah */}
      <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-600 shadow" />
    </div>
  );
};
