"use client";

import { Image as ImageIcon } from "lucide-react";

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  type?: string;
  rows?: number;
  placeholder?: string;
}

export function AdminInput({ label, value, onChange, onFocus, onBlur, type = "text", rows, placeholder }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">{label}</label>}
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-all resize-none rounded-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full h-11 bg-white/5 border border-white/10 px-4 text-sm text-white outline-none focus:border-[#D4AF37] transition-all rounded-sm"
        />
      )}
    </div>
  );
}

interface FileUploadProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export function FileUpload({ onUpload, label = "Завантажити Фото" }: FileUploadProps) {
  return (
    <div className="relative overflow-hidden">
      <button className="w-full h-11 bg-white/10 text-white text-xs border border-white/10 font-bold uppercase cursor-pointer hover:bg-white/20 transition-all flex items-center justify-center gap-2 rounded-sm">
        <ImageIcon className="w-4 h-4" /> {label}
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}

export function SectionCard({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="space-y-5 p-5 border border-white/10 rounded-sm bg-white/[0.01]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
}
