"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Check,
  ChefHat,
  DoorOpen,
  BedDouble,
  Baby,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  FileText,
  Camera,
  Layers,
  Scaling,
  Zap,
  Maximize2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const steps = [
  { id: 1, label: "Категорія", icon: Layers },
  { id: 2, label: "Конфігурація", icon: Scaling },
  { id: 3, label: "Розміри", icon: Maximize2 },
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
    }
  },
  "Шафи": {
    step2: {
      question: "Тип системи відкривання?",
      options: [
        { id: "sliding", label: "Розсувна (Купе)", desc: "Економія місця" },
        { id: "swing", label: "Розпашна", desc: "Класичний вигляд" },
        { id: "combined", label: "Комбінована", desc: "Купе + відкриті полиці" },
      ]
    }
  },
  "Трансформери": {
    step2: {
      question: "Оберіть тип трансформації",
      options: [
        { id: "bed-sofa", label: "Шафа-ліжко-диван", desc: "Максимальний комфорт" },
        { id: "bed-desk", label: "Стіл-ліжко", desc: "Для підлітка" },
        { id: "wall-table", label: "Підвісний стіл", desc: "Компактна полиця" },
      ]
    }
  },
  "Реставрація": {
    step2: {
      question: "Що потребує оновлення?",
      options: [
        { id: "facades", label: "Тільки фасади", desc: "Оновити колір/матеріал" },
        { id: "full", label: "Повна реставрація", desc: "Механізми + фасади" },
        { id: "parts", label: "Заміна фурнітури", desc: "Ремонт петель/систем" },
      ]
    }
  },
  "Інше": {
    step2: {
      question: "Опишіть ваше замовлення",
      isText: true
    }
  }
};

export default function QuizCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [answers, setAnswers] = useState<any>({});
  const [contact, setContact] = useState({ name: "", phone: "", notes: "", width: "", length: "", height: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (currentStep < 4) {
      if (currentStep === 1 && !selectedCategory) return;
      setCurrentStep(currentStep + 1);
    } else {
      submitLead();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setAnswers({});
    setCurrentStep(2);
  };

  const handleOptionSelect = (stepKey: string, optionId: string) => {
    setAnswers({ ...answers, [stepKey]: optionId });
    setTimeout(handleNext, 300);
  };

  const submitLead = async () => {
    if (!contact.name || !contact.phone) return;
    setIsSubmitting(true);
    try {
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

      const currentQuiz = quizLogic[selectedCategory] || quizLogic["Інше"];
      const formattedAnswers: any = {};
      Object.entries(answers).forEach(([step, val]: any) => {
        const stepData = currentQuiz[step];
        const option = stepData?.options?.find((o: any) => o.id === val);
        formattedAnswers[stepData?.question || step] = option?.label || val;
      });

      await supabase.from("leads").insert({
        client_name: contact.name,
        client_contact: contact.phone,
        project_topic: `Квіз: ${selectedCategory}`,
        notes: contact.notes,
        files_url: fileUrls,
        details: { 
          answers: formattedAnswers,
          sizes: { width: contact.width, length: contact.length, height: contact.height }
        },
        status: "new"
      });

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          projectType: selectedCategory,
          notes: contact.notes,
          dimensions: `Д:${contact.length || '-'} Ш:${contact.width || '-'} В:${contact.height || '-'}`,
          answers: formattedAnswers,
          filesUrls: fileUrls
        })
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Помилка відправки. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-20 bg-[#0a0a0a] min-h-[600px] flex items-center justify-center">
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center space-y-6 max-w-lg px-4">
          <div className="w-20 h-20 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/30">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-heading text-white">Дякуємо!</h2>
          <p className="text-zinc-400">Розрахунок успішно відправлено. Майстер зателефонує вам для уточнення деталей та озвучить точну ціну.</p>
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest hover:bg-[#E5C248] transition-colors">Зробити ще один прорахунок</button>
        </motion.div>
      </div>
    );
  }

  const currentQuiz = quizLogic[selectedCategory] || quizLogic["Інше"];

  return (
    <section id="calculator" className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-[#D4AF37]/5 rounded-full blur-[120px] -z-1" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
           <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">Smart Calculator</span>
           <h2 className="text-3xl md:text-5xl font-heading text-white">Розрахуйте вартість <span className="text-[#D4AF37]">онлайн</span></h2>
           <p className="text-zinc-400 mt-4 max-w-xl mx-auto">Дайте відповідь на 4 коротких питання, щоб отримати орієнтовну вартість вашого проєкту.</p>
        </div>

        <div className="flex justify-between items-center mb-16 max-w-2xl mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((st) => (
            <div key={st.id} className="relative z-10 flex flex-col items-center">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep > st.id ? 'bg-[#D4AF37] border-[#D4AF37]' : currentStep === st.id ? 'bg-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'bg-black border-white/10'}`}>
                  {currentStep > st.id ? <Check className="w-6 h-6 text-black" /> : <st.icon className={`w-5 h-5 ${currentStep === st.id ? 'text-[#D4AF37]' : 'text-zinc-600'}`} />}
               </div>
               <span className={`absolute -bottom-8 text-[9px] uppercase tracking-[0.2em] font-bold transition-colors ${currentStep === st.id ? 'text-[#D4AF37]' : 'text-zinc-600'}`}>{st.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-6 md:p-12 min-h-[450px] flex flex-col backdrop-blur-sm">
           <AnimatePresence mode="wait">
             {currentStep === 1 && (
               <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">Оберіть категорію меблів</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`group p-6 border transition-all flex flex-col items-center gap-4 ${selectedCategory === cat.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-white/2 hover:border-white/30'}`}>
                        <cat.icon className={`w-10 h-10 transition-colors ${selectedCategory === cat.id ? 'text-[#D4AF37]' : 'text-zinc-500 group-hover:text-[#D4AF37]'}`} />
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${selectedCategory === cat.id ? 'text-white' : 'text-zinc-400'}`}>{cat.label}</span>
                      </button>
                    ))}
                  </div>
               </motion.div>
             )}

             {currentStep === 2 && (
               <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">{currentQuiz.step2.question}</h3>
                  {currentQuiz.step2.isText ? (
                    <textarea value={answers.step2 || ''} onChange={(e) => setAnswers({...answers, step2: e.target.value})} placeholder="Меблі у ванну, передпокій, або опис реставрації..." className="w-full h-40 bg-white/5 border border-white/10 p-6 text-white outline-none focus:border-[#D4AF37] resize-none" />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuiz.step2.options.map((opt: any) => (
                        <button key={opt.id} onClick={() => handleOptionSelect('step2', opt.id)} className={`p-6 border text-left flex justify-between items-center transition-all ${answers.step2 === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-white/2 hover:border-white/30'}`}>
                           <div>
                              <div className="text-sm font-bold text-white mb-1">{opt.label}</div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{opt.desc}</div>
                           </div>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers.step2 === opt.id ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/20'}`}>
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
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">Орієнтовні розміри</h3>
                  <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Довжина (мм)</label>
                       <input type="number" value={contact.length} onChange={(e)=>setContact({...contact, length: e.target.value})} placeholder="напр. 3500" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Ширина (мм)</label>
                       <input type="number" value={contact.width} onChange={(e)=>setContact({...contact, width: e.target.value})} placeholder="напр. 600" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Висота (мм)</label>
                       <input type="number" value={contact.height} onChange={(e)=>setContact({...contact, height: e.target.value})} placeholder="напр. 2400" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>
                  
                  <div className="max-w-xl mx-auto pt-6">
                    <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/5 rounded-none p-10 text-center cursor-pointer hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all">
                       <input type="file" ref={fileInputRef} onChange={(e)=>setFiles(e.target.files ? Array.from(e.target.files) : [])} multiple className="hidden" />
                       <Camera className="w-10 h-10 text-zinc-600 mx-auto mb-4 group-hover:text-[#D4AF37] transition-colors" />
                       <div className="text-xs text-zinc-400 uppercase tracking-widest">Додати фото / ескіз при наявності</div>
                    </div>
                    {files.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{files.map((f,i)=><span key={i} className="text-[10px] bg-[#D4AF37] text-black px-2 py-1 uppercase font-bold">{f.name}</span>)}</div>}
                  </div>
               </motion.div>
             )}

             {currentStep === 4 && (
               <motion.div key="step4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-heading text-white text-center">Контактні дані</h3>
                  <div className="max-w-lg mx-auto space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Ваше ім'я</label>
                        <input type="text" value={contact.name} onChange={(e)=>setContact({...contact, name: e.target.value})} placeholder="Олександр" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Телефон (Viber / TG)</label>
                        <input type="tel" value={contact.phone} onChange={(e)=>setContact({...contact, phone: e.target.value})} placeholder="+38 (0XX) XXX XX XX" className="w-full h-14 bg-white/5 border border-white/10 px-5 text-white outline-none focus:border-[#D4AF37]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Додаткові деталі</label>
                        <textarea value={contact.notes} onChange={(e)=>setContact({...contact, notes: e.target.value})} className="w-full h-24 bg-white/5 border border-white/10 p-5 text-white outline-none focus:border-[#D4AF37] resize-none" />
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="mt-auto pt-10 flex justify-between">
              <button 
                onClick={handlePrev} 
                className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] transition-all ${currentStep === 1 ? 'opacity-0' : 'text-zinc-500 hover:text-white'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>
              <button 
                onClick={handleNext} 
                disabled={isSubmitting || (currentStep === 4 && (!contact.name || contact.phone.length < 10))}
                className="group flex items-center gap-3 px-10 py-4 bg-[#D4AF37] text-black text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#E5C248] shadow-[0_0_25px_rgba(212,175,55,0.2)]"
              >
                {currentStep === 4 ? (isSubmitting ? 'Відправка...' : 'Отримати прорахунок') : 'Далі'} 
                {currentStep < 4 && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
           </div>
        </div>
      </div>
    </section>
  );
}
