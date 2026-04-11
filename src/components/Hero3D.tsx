"use client";

export default function Hero3D() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30 pointer-events-none z-0">
      {/* Animated gradient orb - 10x faster than Three.js */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D4AF37] via-[#8B6914] to-[#D4AF37] blur-3xl animate-pulse" />
      <div 
        className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#D4AF37]/50 via-transparent to-[#D4AF37]/30 blur-2xl"
        style={{ animation: 'spin 20s linear infinite' }}
      />
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
