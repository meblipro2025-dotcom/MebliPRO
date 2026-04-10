"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Невірний пароль");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
      <div className="w-full max-w-md p-12 border border-[#D4AF37]/30 bg-black/80 space-y-8">
        <div className="text-center space-y-4">
          <Lock className="w-12 h-12 text-[#D4AF37] mx-auto" />
          <h1 className="text-3xl font-heading italic text-white">Адмін-Панель</h1>
          <p className="text-zinc-600 text-xs uppercase tracking-widest">MEBLI-PRO</p>
        </div>
        <div className="space-y-4">
          <input 
            type="password" 
            value={password} 
            onChange={e => { setPassword(e.target.value); setError(""); }} 
            onKeyDown={e => e.key === "Enter" && handleLogin()} 
            placeholder="Введіть пароль..." 
            className="w-full h-14 bg-white/5 border border-white/10 px-6 text-white outline-none focus:border-[#D4AF37]" 
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button 
            onClick={handleLogin} 
            className="w-full h-14 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs cursor-pointer hover:opacity-90"
          >
            Увійти
          </button>
        </div>
      </div>
    </div>
  );
}
