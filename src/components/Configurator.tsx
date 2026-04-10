"use client";

import { useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, DoorOpen, Home, Tv, Baby, Briefcase, Ruler,
  ArrowLeft, ArrowRight, CheckCircle, Send,
  Upload, X, FileText, Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { recordEvent } from "@/lib/analytics";
import type { LucideIcon } from "lucide-react";

/* ─── TYPES ─────────────────────────────────────────────────── */
type CategoryId = 'kitchen'|'wardrobe'|'walkin'|'hallway'|'living'|'kids'|'office'|'measure';

interface FieldDef {
  key: string;
  label: string;
  type: 'text'|'number'|'select'|'checkbox'|'textarea';
  options?: string[];
  placeholder?: string;
  unit?: string;
  group?: string;
}

interface FormState {
  category: CategoryId | null;
  fields: Record<string, string>;
  name: string;
  phone: string;
  notes: string;
  budget: string;
  files: File[];
  step: 1|2|3|4;
}

/* ─── CATEGORY CONFIG ────────────────────────────────────────── */
const CATEGORIES: { id: CategoryId; label: string; sub: string; icon: LucideIcon }[] = [
  { id: 'kitchen',  label: 'Кухня',           sub: 'Кухонні гарнітури',         icon: ChefHat   },
  { id: 'wardrobe', label: 'Шафа-купе',        sub: 'Розсувні та розпашні',      icon: DoorOpen  },
  { id: 'walkin',   label: 'Гардеробна',       sub: 'Walk-in wardrobe',          icon: Home      },
  { id: 'hallway',  label: 'Передпокій',       sub: 'Прихожа',                    icon: Home      },
  { id: 'living',   label: 'Вітальня',         sub: 'ТВ-зони, стінки',           icon: Tv        },
  { id: 'kids',     label: 'Дитяча',           sub: 'Ліжка, столи, шафи',        icon: Baby      },
  { id: 'office',   label: 'Офіс/Кабінет',    sub: 'Столи, стелажі',            icon: Briefcase },
  { id: 'measure',  label: 'Записатись на замір', sub: 'Безкоштовно по Києву', icon: Ruler     },
];

const CATEGORY_FIELDS: Record<CategoryId, FieldDef[]> = {
  kitchen: [
    { key: 'shape',        label: 'Конфігурація',   type: 'select',   options: ['Пряма','Кутова','П-подібна','Острів'], group: 'Планування' },
    { key: 'wallA',        label: 'Стіна А (мм)',   type: 'number',   placeholder: '3000', unit: 'мм', group: 'Розміри' },
    { key: 'wallB',        label: 'Стіна Б (мм)',   type: 'number',   placeholder: '1500', unit: 'мм', group: 'Розміри' },
    { key: 'height',       label: 'Висота (мм)',     type: 'number',   placeholder: '2400', unit: 'мм', group: 'Розміри' },
    { key: 'facade',       label: 'Тип фасаду',      type: 'select',   options: ['МДФ фарба','МДФ плівка','Шпон','ЛДСП','Акрил глянець'], group: 'Матеріали' },
    { key: 'corpus',       label: 'Матеріал корпусу', type: 'select',  options: ['ЛДСП Egger','ЛДСП Cleaf','МДФ'], group: 'Матеріали' },
    { key: 'countertop',   label: 'Стільниця',       type: 'select',   options: ['Не потрібна','HPL','Кварц','Граніт','Акрил'], group: 'Опції' },
    { key: 'appliances',   label: 'Вбудована техніка', type: 'select', options: ['Немає','Духовка','Духовка + посудомийна','Повний комплект'], group: 'Опції' },
    { key: 'backsplash',   label: 'Фартух (скіналі)', type: 'checkbox', group: 'Опції' },
    { key: 'lighting',     label: 'Підсвітка LED',    type: 'checkbox', group: 'Опції' },
  ],
  wardrobe: [
    { key: 'shape',     label: 'Конфігурація', type: 'select', options: ['Пряма','Кутова','П-подібна'], group: 'Планування' },
    { key: 'width',     label: 'Ширина (мм)',  type: 'number', placeholder: '2400', unit: 'мм', group: 'Розміри' },
    { key: 'height',    label: 'Висота (мм)',  type: 'number', placeholder: '2400', unit: 'мм', group: 'Розміри' },
    { key: 'depth',     label: 'Глибина (мм)', type: 'number', placeholder: '600',  unit: 'мм', group: 'Розміри' },
    { key: 'doors',     label: 'Тип дверей',   type: 'select', options: ['Розсувні (купе)','Розпашні','Без дверей'], group: 'Двері' },
    { key: 'doorCount', label: 'Кількість дверей', type: 'select', options: ['2','3','4','5'], group: 'Двері' },
    { key: 'mirror',    label: 'Дзеркало на фасаді', type: 'checkbox', group: 'Двері' },
    { key: 'builtin',   label: 'Вбудована (в нішу)', type: 'checkbox', group: 'Планування' },
    { key: 'filling',   label: 'Наповнення',   type: 'select', options: ['Базове (полиці + штанга)','Стандарт + шухляди','Преміум (кошики, галстукниця)'], group: 'Наповнення' },
  ],
  walkin: [
    { key: 'length',    label: 'Довжина кімнати (мм)', type: 'number', placeholder: '3000', unit: 'мм', group: 'Розміри' },
    { key: 'width',     label: 'Ширина кімнати (мм)',  type: 'number', placeholder: '2000', unit: 'мм', group: 'Розміри' },
    { key: 'height',    label: 'Висота (мм)',           type: 'number', placeholder: '2400', unit: 'мм', group: 'Розміри' },
    { key: 'door',      label: 'Двері гардеробної',     type: 'select', options: ['Розсувні','Розпашні','Арка (без дверей)'], group: 'Вхід' },
    { key: 'filling',   label: 'Наповнення',             type: 'select', options: ['Стандарт','Преміум (острів, освітлення)'], group: 'Наповнення' },
    { key: 'island',    label: 'Острів посередині',      type: 'checkbox', group: 'Наповнення' },
    { key: 'lighting',  label: 'Підсвітка LED',          type: 'checkbox', group: 'Наповнення' },
  ],
  hallway: [
    { key: 'type',      label: 'Тип меблів',  type: 'select', options: ['Тумба для взуття','Шафа з дзеркалом','Вішалка + лавка','Повна стінка передпокою'], group: 'Тип' },
    { key: 'width',     label: 'Ширина (мм)', type: 'number', placeholder: '1600', unit: 'мм', group: 'Розміри' },
    { key: 'height',    label: 'Висота (мм)', type: 'number', placeholder: '2200', unit: 'мм', group: 'Розміри' },
    { key: 'mirror',    label: 'Дзеркало',    type: 'checkbox', group: 'Опції' },
    { key: 'bench',     label: 'Лавка/пуф',   type: 'checkbox', group: 'Опції' },
    { key: 'shoebox',   label: 'Секція для взуття', type: 'checkbox', group: 'Опції' },
  ],
  living: [
    { key: 'type',      label: 'Тип меблів', type: 'select', options: ['ТВ-стінка','Книжкова стінка','Гірка','Стінка з гардеробом','Барна стійка'], group: 'Тип' },
    { key: 'width',     label: 'Ширина (мм)', type: 'number', placeholder: '3600', unit: 'мм', group: 'Розміри' },
    { key: 'height',    label: 'Висота (мм)', type: 'number', placeholder: '2200', unit: 'мм', group: 'Розміри' },
    { key: 'tvSize',    label: 'Діагональ ТВ (дюйм)', type: 'select', options: ['43"','55"','65"','75"','85"','Не встановлюю'], group: 'Опції' },
    { key: 'lighting',  label: 'Підсвітка LED', type: 'checkbox', group: 'Опції' },
    { key: 'openShelves', label: 'Відкриті полиці', type: 'checkbox', group: 'Опції' },
  ],
  kids: [
    { key: 'type',      label: 'Тип меблів', type: 'select', options: ['Ліжко-горище','Ліжко 2-поверхове','Ліжко + робоче місце','Шафа','Ліжко + шафа + стіл (комплект)'], group: 'Тип' },
    { key: 'age',       label: 'Вік дитини', type: 'select', options: ['3–6 років','7–12 років','Підліток (12+)'], group: 'Параметри' },
    { key: 'width',     label: 'Ширина кімнати (мм)', type: 'number', placeholder: '3000', unit: 'мм', group: 'Розміри' },
    { key: 'length',    label: 'Довжина кімнати (мм)', type: 'number', placeholder: '3500', unit: 'мм', group: 'Розміри' },
    { key: 'safety',    label: 'Захисні бортики', type: 'checkbox', group: 'Параметри' },
    { key: 'desk',      label: 'Окреме робоче місце', type: 'checkbox', group: 'Параметри' },
    { key: 'material',  label: 'Матеріал', type: 'select', options: ['ЛДСП Egger','МДФ фарба','Шпон дуб'], group: 'Матеріали' },
  ],
  office: [
    { key: 'type',      label: 'Тип меблів', type: 'select', options: ['Робочий стіл','Стелаж/бібліотека','Шафа документів','Кутовий кабінет (стіл + стелаж)','Повна кімната-кабінет'], group: 'Тип' },
    { key: 'width',     label: 'Ширина (мм)', type: 'number', placeholder: '2000', unit: 'мм', group: 'Розміри' },
    { key: 'height',    label: 'Висота (мм)', type: 'number', placeholder: '2200', unit: 'мм', group: 'Розміри' },
    { key: 'material',  label: 'Матеріал', type: 'select', options: ['ЛДСП','МДФ фарба','Шпон дуб','Шпон горіх'], group: 'Матеріали' },
    { key: 'cable',     label: 'Кабель-менеджмент', type: 'checkbox', group: 'Опції' },
    { key: 'lighting',  label: 'Підсвітка',           type: 'checkbox', group: 'Опції' },
  ],
  measure: [
    { key: 'what',      label: 'Що потрібно виміряти', type: 'select', options: ['Кухня','Шафа-купе','Гардеробна','Кілька кімнат','Весь будинок'], group: 'Замір' },
    { key: 'address',   label: "Адреса об'єкта", type: 'text', placeholder: 'м. Київ, вул. ...', group: 'Контакт' },
    { key: 'date',      label: 'Бажана дата', type: 'text', placeholder: 'наприклад, 15 квітня', group: 'Контакт' },
    { key: 'time',      label: 'Зручний час', type: 'select', options: ['Ранок 9:00–12:00','День 12:00–16:00','Вечір 16:00–20:00'], group: 'Контакт' },
    { key: 'hasDesign', label: 'Є дизайн-проект', type: 'checkbox', group: 'Контакт' },
  ],
};

const BUDGET_OPTIONS = ['До 20 000 грн','20 000–40 000 грн','40 000–70 000 грн','70 000–120 000 грн','120 000–200 000 грн','Понад 200 000 грн','Ще не визначився'];

/* ─── SHARED UI COMPONENTS ───────────────────────────────────── */
function FInput({ label, unit, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; unit?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-[0.2em]">{label}</label>
      <div className="relative">
        <input {...props} className="w-full h-12 bg-white/[0.04] border border-white/10 px-4 text-white text-sm outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-700 rounded-sm" />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">{unit}</span>}
      </div>
    </div>
  );
}

function FSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-[0.2em]">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full h-12 bg-white/[0.04] border border-white/10 px-4 text-white text-sm outline-none focus:border-[#D4AF37] transition-all rounded-sm cursor-pointer">
        <option value="" className="bg-[#141414]">— Оберіть —</option>
        {options.map(o => <option key={o} value={o} className="bg-[#141414]">{o}</option>)}
      </select>
    </div>
  );
}

function FCheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 border border-white/5 hover:bg-white/[0.04] transition-all rounded-sm select-none">
      <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors shrink-0 ${checked ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/20'}`}>
        {checked && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
function ConfiguratorContent() {
  const [form, setForm] = useState<FormState>({
    category: null, fields: {}, name: '', phone: '', notes: '', budget: '', files: [], step: 1,
  });
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = useCallback((key: string, val: string) => {
    setForm(f => ({ ...f, fields: { ...f.fields, [key]: val } }));
  }, []);

  const totalSteps = form.category === 'measure' ? 3 : 4;
  const pct = ((form.step - 1) / (totalSteps - 1)) * 100;

  /* File upload */
  const handleFiles = async (raw: FileList | null) => {
    if (!raw || !raw.length) return;
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'site-media';
    const newFiles = [...form.files];
    setUploading(true);
    for (let i = 0; i < raw.length; i++) {
      const file = raw[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const path = `leads/${Date.now()}_${i}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (!error) newFiles.push(file);
    }
    setForm(f => ({ ...f, files: newFiles }));
    setUploading(false);
  };

  /* Submit */
  const submit = async () => {
    if (!form.phone || !form.category) return;
    setSending(true);
    try {
      const cat = CATEGORIES.find(c => c.id === form.category);
      const filesUrls: string[] = [];
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'site-media';
      for (const file of form.files) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const path = `leads/${Date.now()}.${ext}`;
        await supabase.storage.from(bucket).upload(path, file);
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        if (data) filesUrls.push(data.publicUrl);
      }
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          projectType: cat?.label || form.category,
          notes: form.notes,
          budget: form.budget,
          answers: form.fields,
          filesUrls,
        }),
      });
      await recordEvent('lead_submit', { path: window.location.pathname, source: 'configurator' });
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (success) return (
    <div id="order" className="relative py-32 flex items-center justify-center px-4 bg-[#050505]">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="container max-w-2xl glass-luxury p-12 md:p-16 text-center border-t-4 border-[#D4AF37]">
        <CheckCircle className="w-20 h-20 text-[#D4AF37] mx-auto mb-6" />
        <h3 className="text-3xl font-heading mb-4 text-white uppercase italic">Заявку Надіслано!</h3>
        <p className="text-zinc-400 mb-8 font-light">Майстер Олександр зв&apos;яжеться з вами протягом 1 години.</p>
        <button onClick={() => { setForm({ category: null, fields: {}, name: '', phone: '', notes: '', budget: '', files: [], step: 1 }); setSuccess(false); }} className="px-8 h-12 bg-metallic-gold text-black font-bold uppercase tracking-widest text-xs cursor-pointer">Новий прорахунок</button>
      </motion.div>
    </div>
  );

  const groupedFields = (cat: CategoryId) => {
    const fields = CATEGORY_FIELDS[cat];
    const groups: Record<string, FieldDef[]> = {};
    fields.forEach(f => { const g = f.group || ''; (groups[g] = groups[g] || []).push(f); });
    return groups;
  };

  return (
    <div id="order" className="relative py-10 sm:py-24 px-4 bg-[#050505] overflow-x-hidden">
      <div className="absolute inset-0 text-[30vw] sm:text-[20vw] font-heading text-white/[0.015] select-none pointer-events-none uppercase italic tracking-tighter leading-none flex items-center justify-center overflow-hidden">M PRO</div>

      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Онлайн-прорахунок</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white">Зробити <span className="text-metallic-gold italic">Прорахунок</span></h2>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i + 1 < form.step ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : i + 1 === form.step ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-zinc-700'}`}>{i + 1 < form.step ? '✓' : i + 1}</div>
              {i < totalSteps - 1 && <div className="w-8 sm:w-16 h-0.5 rounded-full transition-all" style={{ background: i + 1 < form.step ? '#D4AF37' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Category */}
          {form.step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="glass-luxury p-6 sm:p-10 border border-white/10">
                <h3 className="text-xl sm:text-2xl font-heading text-white mb-8 uppercase tracking-tighter">Оберіть Категорію Послуги</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setForm(f => ({ ...f, category: cat.id, step: 2 }))}
                      className="group p-4 sm:p-6 border border-white/5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer text-center">
                      <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-700 group-hover:text-[#D4AF37] transition-colors" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{cat.label}</div>
                        <div className="text-[9px] sm:text-[10px] text-zinc-700 group-hover:text-zinc-500 mt-0.5 hidden sm:block">{cat.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Category fields */}
          {form.step === 2 && form.category && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="glass-luxury p-6 sm:p-10 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setForm(f => ({ ...f, step: 1 }))} className="p-2 border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all cursor-pointer rounded-sm"><ArrowLeft className="w-4 h-4" /></button>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading text-white uppercase tracking-tighter">{CATEGORIES.find(c => c.id === form.category)?.label}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Заповніть параметри проекту</p>
                  </div>
                </div>
                <div className="space-y-8">
                  {Object.entries(groupedFields(form.category)).map(([group, fields]) => (
                    <div key={group}>
                      {group && <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-3 pb-2 border-b border-white/5">{group}</div>}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map(f => (
                          <div key={f.key} className={f.type === 'checkbox' ? '' : ''}>
                            {f.type === 'select' && <FSelect label={f.label} options={f.options || []} value={form.fields[f.key] || ''} onChange={v => setField(f.key, v)} />}
                            {f.type === 'number' && <FInput label={f.label} type="number" placeholder={f.placeholder} unit={f.unit} value={form.fields[f.key] || ''} onChange={e => setField(f.key, e.target.value)} />}
                            {f.type === 'text' && <FInput label={f.label} type="text" placeholder={f.placeholder} value={form.fields[f.key] || ''} onChange={e => setField(f.key, e.target.value)} />}
                            {f.type === 'checkbox' && <FCheck label={f.label} checked={form.fields[f.key] === 'true'} onChange={v => setField(f.key, String(v))} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setForm(f => ({ ...f, step: 3 }))} className="flex-1 h-14 bg-metallic-gold text-black text-xs font-black uppercase tracking-[0.4em] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3">
                    Далі <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Files + budget (skip for measure) */}
          {form.step === 3 && form.category !== 'measure' && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="glass-luxury p-6 sm:p-10 border border-white/10 space-y-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => setForm(f => ({ ...f, step: 2 }))} className="p-2 border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all cursor-pointer rounded-sm"><ArrowLeft className="w-4 h-4" /></button>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading text-white uppercase tracking-tighter">Додаткові Матеріали</h3>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Фото, ескізи, PDF дизайн-проект</p>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-3">Орієнтовний бюджет</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUDGET_OPTIONS.map(b => (
                      <button key={b} onClick={() => setForm(f => ({ ...f, budget: b }))} className={`p-3 border text-xs font-bold transition-all cursor-pointer rounded-sm text-left ${form.budget === b ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white' : 'border-white/5 text-zinc-600 hover:border-white/20 hover:text-white'}`}>{b}</button>
                    ))}
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-3">Додати файли (фото, PDF, ескізи)</div>
                  <label className="block cursor-pointer">
                    <input type="file" multiple accept="image/*,.pdf,.png,.jpg,.jpeg,.webp" className="sr-only" onChange={e => handleFiles(e.target.files)} />
                    <div className="border-2 border-dashed border-white/10 hover:border-[#D4AF37]/40 transition-colors p-8 text-center rounded-sm">
                      <Upload className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                      <div className="text-sm text-zinc-500">Перетягніть файли або <span className="text-[#D4AF37] underline">натисніть для вибору</span></div>
                      <div className="text-[10px] text-zinc-700 mt-1">JPG, PNG, PDF, WEBP до 10МБ кожен</div>
                    </div>
                  </label>
                  {form.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs text-zinc-300">
                          {file.type.includes('pdf') ? <FileText className="w-3 h-3 text-[#D4AF37]" /> : <ImageIcon className="w-3 h-3 text-[#D4AF37]" />}
                          {file.name.length > 20 ? file.name.slice(0, 18) + '…' : file.name}
                          <button onClick={() => setForm(f => ({ ...f, files: f.files.filter((_, j) => j !== i) }))} className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploading && <div className="text-[10px] text-[#D4AF37] mt-2 animate-pulse">Завантаження файлів...</div>}
                </div>

                {/* Notes */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-2">Додаткові побажання</div>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Стиль, кольори, терміни, інші деталі..." className="w-full bg-white/[0.04] border border-white/10 p-4 text-sm text-white min-h-[100px] outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-700 rounded-sm resize-none" />
                </div>

                <button onClick={() => setForm(f => ({ ...f, step: 4 }))} className="w-full h-14 bg-metallic-gold text-black text-xs font-black uppercase tracking-[0.4em] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3">
                  Далі — Контакт <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* FINAL STEP: contact */}
          {((form.step === 3 && form.category === 'measure') || form.step === 4) && (
            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="glass-luxury p-6 sm:p-10 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setForm(f => ({ ...f, step: form.category === 'measure' ? 2 : 3 }))} className="p-2 border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all cursor-pointer rounded-sm"><ArrowLeft className="w-4 h-4" /></button>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading text-white uppercase tracking-tighter">Ваші Контактні Дані</h3>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Останній крок</p>
                  </div>
                </div>
                <div className="max-w-md mx-auto space-y-5">
                  <FInput label="Ваше ім'я" type="text" placeholder="Ім'я та Прізвище" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <FInput label="Номер телефону *" type="tel" placeholder="+380..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-[0.2em]">Зручний спосіб зв&apos;язку</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Телефон','Viber','Telegram'].map(m => (
                        <button key={m} onClick={() => setField('contact_method', m)} className={`p-3 border text-[10px] font-bold uppercase tracking-wider cursor-pointer rounded-sm transition-all ${form.fields.contact_method === m ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white' : 'border-white/5 text-zinc-600 hover:border-white/20 hover:text-white'}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={submit} disabled={sending || !form.phone} className="w-full h-16 bg-metallic-gold text-black text-sm font-black uppercase tracking-[0.5em] shadow-[0_0_60px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 cursor-pointer mt-4 rounded-sm">
                    {sending ? 'Надсилаємо...' : 'Надіслати Заявку'} <Send className="w-5 h-5" />
                  </button>
                  <p className="text-center text-[10px] text-zinc-600 leading-relaxed">Натискаючи «Надіслати», ви погоджуєтесь з обробкою персональних даних. Відповідь — протягом 1 год.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Configurator() {
  return (
    <Suspense fallback={<div className="min-h-[400px] bg-[#050505] flex items-center justify-center text-[#D4AF37] text-sm uppercase tracking-widest">Завантаження...</div>}>
      <ConfiguratorContent />
    </Suspense>
  );
}
