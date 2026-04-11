"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Upload,
  Check,
  ChefHat,
  DoorOpen,
  BedDouble,
  Baby,
  RefreshCw,
  Table2,
  HelpCircle,
  ArrowRight,
  FileText,
  Camera,
  Layers,
  Scaling,
  Zap
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const steps = [
  { id: 1, label: "Категорія", icon: Layers },
  { id: 2, label: "Конфігурація", icon: Scaling },
  { id: 3, label: "Матеріали", icon: Zap },
  { id: 4, label: "Контакти", icon: FileText },
];

const categories = [
  { id: "Кухні", label: "Кухня", icon: ChefHat, description: "Індивідуальні гарнітури" },
  { id: "Шафи", label: "Шафа", icon: DoorOpen, description: "Купе, гардеробні" },
  { id: "Трансформери", label: "Трансформер", icon: BedDouble, description: "Ліжко + Шафа + Диван" },
  { id: "Дитячі", label: "Дитяча", icon: Baby, description: "Кімнати під ключ" },
  { id: "Реставрація", label: "Реставрація", icon: RefreshCw, description: "Нове життя меблям" },
  { id: "Інше", label: "Інше", icon: HelpCircle, description: "Завантажте свій проєкт" },
];

const quizLogic: any = {
  "Кухні": {
    step2: {
      question: "Яка форма кухні вам потрібна?",
      options: [
        { id: "straight", label: "Пряма", desc: "Уздовж однієї стіни" },
        { id: "l-shape", label: "Г-подібна", desc: "Кутова (стандарт)" },
        { id: "u-shape", label: "П-подібна", desc: "Максимальна площа" },
        { id: "island", label: "З островом", desc: "Для великих приміщень" },
      ]
    },
    step3: {
      question: "Яким фасадам надаєте перевагу?",
      options: [
        { id: "mdf-paint", label: "МДФ Фарба", desc: "Преміум вигляд, будь-який RAL" },
        { id: "mdf-film", label: "МДФ Плівка", desc: "Доступність та надійність" },
        { id: "ldsp-egger", label: "ЛДСП Egger", desc: "Текстура дерева, вигідно" },
        { id: "shpon", label: "Шпон / Дерево", desc: "Натуральні матеріали" },
      ]
    }
  },
  "Шафи": {
    step2: {
      question: "Тип системи відкривання?",
      options: [
        { id: "sliding", label: "Розсувна (Купе)", desc: "Економія місця" },
        { id: "swing", label: "Розпашна", desc: "Класичний вигляд" },
        { id: "hidden", label: "Прихованого монтажу", desc: "У вірівень зі стіною" },
      ]
    },
    step3: {
      question: "Що буде на фасадах?",
      options: [
        { id: "ldsp", label: "ЛДСП", desc: "Просто та стильно" },
        { id: "mirror", label: "Дзеркало", desc: "Розширює простір" },
        { id: "glass-al", label: "Скло в AL-рамі", desc: "Сучасний хай-тек" },
        { id: "combined", label: "Комбіноване", desc: "Дзеркало + МДФ" },
      ]
    }
  },
  "Трансформери": {
    step2: {
      question: "Завдання трансформера?",
      options: [
        { id: "bed-sofa", label: "Ліжко-диван-шафа", desc: "3-в-1 система" },
        { id: "table-shelf", label: "Стіл-полиця", desc: "Відкидний робочий стіл" },
        { id: "horizontal-bed", label: "Горизонтальне ліжко", desc: "Для вузьких кімнат" },
      ]
    },
    step3: {
      question: "На скільки персон?",
      options: [
        { id: "single", label: "Односпальне", desc: "Ширина до 120см" },
        { id: "double", label: "Двоспальне", desc: "Ширина 140/160/180см" },
      ]
    }
  },
  "Інше": {
    step2: {
      question: "Опишіть вашу ідею",
      isText: true
    },
    step3: {
      question: "Завантажте фото або ескіз",
      isUpload: true
    }
  }
};

export default function QuizCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [answers, setAnswers] = useState<any>({});
  const [contact, setContact] = useState({ name: "", phone: "", notes: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else submitLead();
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setAnswers({}); // Reset answers when category changes
    setCurrentStep(2);
  };

  const handleOptionSelect = (stepKey: string, optionId: string) => {
    setAnswers({ ...answers, [stepKey]: optionId });
    setTimeout(handleNext, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    try {
      // 1. Upload files to Storage
      const fileUrls: string[] = [];
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'site-media';
      
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `leads/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          if (data) fileUrls.push(data.publicUrl);
        }
      }

      // 2. Format details for DB
      const currentQuiz = quizLogic[selectedCategory] || quizLogic["Інше"];
      const formattedAnswers: any = {};
      Object.entries(answers).forEach(([step, val]: any) => {
        const stepData = currentQuiz[step];
        const option = stepData?.options?.find((o: any) => o.id === val);
        formattedAnswers[stepData?.question || step] = option?.label || val;
      });

      // 3. Save to Supabase
      const { data: leadData, error: dbError } = await supabase.from("leads").insert({
        client_name: contact.name,
        client_contact: contact.phone,
        project_topic: `Квіз-розрахунок: ${selectedCategory}`,
        notes: contact.notes,
        files_url: fileUrls,
        details: { answers: formattedAnswers },
        status: "new"
      }).select().single();

      if (dbError) throw dbError;

      // 4. Send to Telegram API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          projectType: selectedCategory,
          notes: contact.notes,
          answers: formattedAnswers,
          filesUrls: fileUrls
        })
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Виникла помилка. Спробуйте пізніше або зателефонуйте нам.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    if (currentStep === 1) return selectedCategory !== "";
    if (currentStep === 2) {
       const stepData = (quizLogic[selectedCategory] || quizLogic["Інше"]).step2;
       if (stepData.isText) return (answers.step2 || "").length > 5;
       return answers.step2 !== undefined;
    }
    if (currentStep === 3) {
       const stepData = (quizLogic[selectedCategory] || quizLogic["Інше"]).step3;
       if (stepData.isUpload) return true; // Optional or always allowed
       return answers.step3 !== undefined;
    }
    if (currentStep === 4) return contact.name.length > 2 && contact.phone.length > 9;
    return false;
  };

  if (isSuccess) {
    return (
      <div className="py-20 bg-[#0a0a0a] min-h-[600px] flex items-center justify-center">
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center space-y-6 max-w-lg px-4">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-heading text-white">Розрахунок прийнято!</h2>
          <p className="text-zinc-400">Дякуємо, {contact.name}. Майстер зв'яжеться з вами протягом години для уточнення вартості вашої ідеї.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-[#E5C248] transition-colors">Повторити</button>
        </motion.div>
      </div>
    );
  }

  const currentQuiz = quizLogic[selectedCategory] || quizLogic["Інше"];

  return (
    <section id="quiz" className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-[#D4AF37]/5 rounded-full blur-[120px] -z-1" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
           <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">Розумний Прорахунок</span>
           <h2 className="text-3xl md:text-5xl font-heading text-white">Розрахуйте вартість <span className="text-[#D4AF37]">за 2 хв</span></h2>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.id;
            const isActive = currentStep === st.id;
            return (
              <div key={st.id} className="relative z-10 flex flex-col items-center">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-[#D4AF37] border-[#D4AF37]' : isActive ? 'bg-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-black border-white/10'}`}>
                    {isCompleted ? <Check className="w-5 h-5 text-black" /> : <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-600'}`} />}
                 </div>
                 <span className={`absolute -bottom-7 text-[9px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors duration-500 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-600'}`}>{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* QUIZ CONTENT */}
        <div className="bg-white/[0.03] border border-white/10 rounded-sm p-6 md:p-10 min-h-[400px] flex flex-col shadow-2xl backdrop-blur-md">
           <AnimatePresence mode="wait">
             {currentStep === 1 && (
               <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">Що ми будемо прораховувати?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`group p-6 rounded-sm border transition-all text-center flex flex-col items-center gap-3 ${selectedCategory === cat.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 bg-white/2 hover:border-white/20'}`}>
                        <cat.icon className={`w-10 h-10 mb-2 transition-colors ${selectedCategory === cat.id ? 'text-[#D4AF37]' : 'text-zinc-600 group-hover:text-zinc-300'}`} />
                        <span className={`text-xs uppercase font-bold tracking-widest ${selectedCategory === cat.id ? 'text-white' : 'text-zinc-400'}`}>{cat.label}</span>
                      </button>
                    ))}
                  </div>
               </motion.div>
             )}

             {currentStep === 2 && (
               <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">{currentQuiz.step2.question}</h3>
                  {currentQuiz.step2.isText ? (
                    <div className="max-w-xl mx-auto">
                       <textarea value={answers.step2 || ''} onChange={(e) => setAnswers({...answers, step2: e.target.value})} placeholder="Меблі у ванну, передпокій, або власна ідея..." className="w-full h-40 bg-white/5 border border-white/10 p-5 text-white outline-none focus:border-[#D4AF37] rounded-sm resize-none" />
                       <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Мінімум 5 символів</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(currentQuiz.step2.options || []).map((opt: any) => (
                        <button key={opt.id} onClick={() => handleOptionSelect('step2', opt.id)} className={`p-5 rounded-sm border text-left flex justify-between items-center transition-all ${answers.step2 === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 bg-white/2 hover:border-white/20'}`}>
                           <div>
                              <div className="text-sm font-bold text-white mb-1">{opt.label}</div>
                              <div className="text-[11px] text-zinc-500 uppercase tracking-widest">{opt.desc}</div>
                           </div>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers.step2 === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/20'}`}>
                              {answers.step2 === opt.id && <Check className="w-3 h-3 text-black" />}
                           </div>
                        </button>
                      ))}
                    </div>
                  )}
               </motion.div>
             )}

             {currentStep === 3 && (
               <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">{currentQuiz.step3.question}</h3>
                  {currentQuiz.step3.isUpload ? (
                    <div className="max-w-xl mx-auto space-y-6">
                       <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 rounded-sm p-12 text-center cursor-pointer hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all">
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><Camera className="w-8 h-8 text-[#D4AF37]" /></div>
                          <div className="text-sm text-zinc-300 font-bold uppercase tracking-widest mb-2">Натисніть для завантаження</div>
                          <div className="text-xs text-zinc-500">JPG, PNG, PDF (можна кілька)</div>
                       </div>
                       {files.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                            {files.map((f, i) => (
                              <div key={i} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[10px] text-[#D4AF37] flex items-center gap-2">
                                {f.name} <button onClick={() => setFiles(files.filter((_, idx)=>idx!==i))} className="hover:text-white">×</button>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(currentQuiz.step3.options || []).map((opt: any) => (
                        <button key={opt.id} onClick={() => handleOptionSelect('step3', opt.id)} className={`p-5 rounded-sm border text-left flex justify-between items-center transition-all ${answers.step3 === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 bg-white/2 hover:border-white/20'}`}>
                           <div>
                              <div className="text-sm font-bold text-white mb-1">{opt.label}</div>
                              <div className="text-[11px] text-zinc-500 uppercase tracking-widest">{opt.desc}</div>
                           </div>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers.step3 === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/20'}`}>
                              {answers.step3 === opt.id && <Check className="w-3 h-3 text-black" />}
                           </div>
                        </button>
                      ))}
                    </div>
                  )}
               </motion.div>
             )}

             {currentStep === 4 && (
               <motion.div key="step4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">Останній крок: Куди надіслати прорахунок?</h3>
                  <div className="max-w-xl mx-auto space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Ваше ім'я</label>
                        <input type="text" value={contact.name} onChange={(e)=>setContact({...contact, name: e.target.value})} placeholder="Олександр" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37] transition-all rounded-sm" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Телефон (Viber/Telegram)</label>
                        <input type="tel" value={contact.phone} onChange={(e)=>setContact({...contact, phone: e.target.value})} placeholder="+38 0XX XXX XX XX" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37] transition-all rounded-sm" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">Додаткові побажання (необов'язково)</label>
                        <textarea value={contact.notes} onChange={(e)=>setContact({...contact, notes: e.target.value})} placeholder="Наприклад: хочу з вбудованою кавомашиною..." className="w-full h-24 bg-white/5 border border-white/10 p-5 text-white outline-none focus:border-[#D4AF37] transition-all rounded-sm resize-none" />
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="mt-auto pt-10 flex justify-between border-t border-white/5">
              <button onClick={handlePrev} disabled={currentStep === 1} className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-all ${currentStep === 1 ? 'opacity-0' : 'text-zinc-600 hover:text-white'}`}><ChevronLeft className="w-4 h-4" /> Назад</button>
              {currentStep < 4 ? (
                <button onClick={handleNext} disabled={!canGoNext()} className={`group flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest transition-all hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white disabled:hover:border-white/10`}> 
                  Далі <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> 
                </button>
              ) : (
                <button onClick={submitLead} disabled={!canGoNext() || isSubmitting} className={`flex items-center gap-3 px-10 py-3 bg-[#D4AF37] text-black text-[10px] uppercase font-bold tracking-widest transition-all hover:bg-[#E5C248] shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50`}>
                   {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                   {isSubmitting ? 'Відправка...' : 'Отримати прорахунок'}
                </button>
              )}
           </div>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-30">
           {['Власне виробництво', '15+ років досвіду', 'Безкоштовний дизайн', 'Гарантія якості'].map((t) => (
             <div key={t} className="flex items-center gap-2 justify-center">
                <Check className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-[10px] uppercase tracking-widest text-white font-bold">{t}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
