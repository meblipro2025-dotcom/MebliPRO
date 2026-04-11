"use client";

import { useState } from "react";
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
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const categories = [
  { id: "kitchen", label: "Кухня", icon: ChefHat, description: "Кухонні гарнітури будь-якої складності" },
  { id: "wardrobe", label: "Шафа", icon: DoorOpen, description: "Шафи-купе, гардеробні, розпашні" },
  { id: "bed", label: "Ліжко-трансформер", icon: BedDouble, description: "Системи 3-в-1 для економії простору" },
  { id: "table", label: "Стіл-трансформер", icon: Table2, description: "Компактні розкладні столи" },
  { id: "kids", label: "Дитяча кімната", icon: Baby, description: "Комплексні рішення під ключ" },
  { id: "restoration", label: "Реставрація", icon: RefreshCw, description: "Оновлення та ремонт меблів" },
  { id: "other", label: "Інше", icon: HelpCircle, description: "Завантажте ескіз або опишіть ідею" },
];

const kitchenShapes = [
  { id: "straight", label: "Пряма", description: "Оптимально для маленьких кухонь" },
  { id: "l-shape", label: "Г-подібна", description: "Класичне рішення для зручності" },
  { id: "u-shape", label: "П-подібна", description: "Максимум робочої поверхні" },
  { id: "island", label: "З островом", description: "Сучасне просторе рішення" },
];

const doorTypes = [
  { id: "swing", label: "Розпашні", description: "Класичні двері на петлях" },
  { id: "sliding", label: "Розсувні (купе)", description: "Економія простору" },
];

const doorFillings = [
  { id: "ldsp", label: "ЛДСП", description: "Бюджетний варіант" },
  { id: "mirror", label: "Дзеркало", description: "Візуально збільшує простір" },
  { id: "sandblast", label: "Піскоструй", description: "Елегантний малюнок" },
  { id: "combined", label: "Комбінований", description: "Мікс матеріалів" },
];

const styles = [
  { 
    id: "modern", 
    label: "Сучасний", 
    description: "Чисті лінії, мінімалізм, функціональність",
    example: "Глянцеві фасади, приховані ручки, вбудована техніка",
    image: "/images/kitchen_modern.png"
  },
  { 
    id: "classic", 
    label: "Класичний", 
    description: "Фрезерування, пілястри, багети",
    example: "Фарбований МДФ з фрезою, декоративні елементи",
    image: "/images/luxury_kitchen.png"
  },
  { 
    id: "loft", 
    label: "Лофт", 
    description: "Поєднання дерева та металу, індустріальний шик",
    example: "Масив дерева, металеві ніжки, відкриті полиці",
    image: "/images/office_desk.png"
  },
];

interface FormData {
  category: string;
  answers: Record<string, string | number>;
  style: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
  file: File | null;
}

export default function QuizCalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    answers: {},
    style: "",
    name: "",
    phone: "",
    email: "",
    comment: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId });
  };

  const handleAnswer = (question: string, value: string | number) => {
    setFormData({
      ...formData,
      answers: { ...formData.answers, [question]: value },
    });
  };

  const handleStyleSelect = (styleId: string) => {
    setFormData({ ...formData, style: styleId });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Upload file if exists
      let fileUrl = null;
      if (formData.file) {
        const fileName = `${Date.now()}_${formData.file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("quiz-uploads")
          .upload(fileName, formData.file);
        
        if (!uploadError && data) {
          const { data: urlData } = supabase.storage
            .from("quiz-uploads")
            .getPublicUrl(fileName);
          fileUrl = urlData.publicUrl;
        }
      }

      // Submit to leads table
      const { error: submitError } = await supabase.from("leads").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        message: `Категорія: ${formData.category}
Стиль: ${formData.style}
Деталі: ${JSON.stringify(formData.answers, null, 2)}
Коментар: ${formData.comment}`,
        source: "quiz-calculator",
        file_url: fileUrl,
        category: formData.category,
      });

      if (submitError) throw submitError;

      // Send to Telegram
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          category: formData.category,
          style: formData.style,
          answers: formData.answers,
          comment: formData.comment,
          file_url: fileUrl,
        }),
      });

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка відправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading text-white text-center mb-6">
        Що плануєте замовити?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
              formData.category === cat.id
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            <cat.icon className={`w-8 h-8 mb-3 ${
              formData.category === cat.id ? "text-[#D4AF37]" : "text-zinc-400"
            }`} />
            <h4 className={`font-bold mb-1 ${
              formData.category === cat.id ? "text-white" : "text-zinc-300"
            }`}>{cat.label}</h4>
            <p className="text-sm text-zinc-500">{cat.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const category = formData.category;
    
    if (category === "kitchen") {
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-heading text-white text-center mb-6">
            Форма кухні
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kitchenShapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => handleAnswer("shape", shape.id)}
                className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                  formData.answers.shape === shape.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <h4 className="font-bold text-white mb-1">{shape.label}</h4>
                <p className="text-sm text-zinc-500">{shape.description}</p>
              </button>
            ))}
          </div>
          
          {formData.answers.shape && (
            <div className="mt-6 p-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
              <h4 className="text-[#D4AF37] font-bold mb-3">Додаткові параметри</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Фасади</label>
                  <select 
                    onChange={(e) => handleAnswer("facade", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] outline-none"
                  >
                    <option value="">Оберіть...</option>
                    <option value="mdf-paint">МДФ фарба</option>
                    <option value="mdf-film">МДФ плівка</option>
                    <option value="ldsp">ЛДСП</option>
                    <option value="wood">Дерево</option>
                    <option value="shpon">Шпон</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Стільниця</label>
                  <select 
                    onChange={(e) => handleAnswer("countertop", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] outline-none"
                  >
                    <option value="">Оберіть...</option>
                    <option value="quartz">Кварц</option>
                    <option value="acrylic">Акрил</option>
                    <option value="dsp">ДСП</option>
                    <option value="wood">Масив</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (category === "wardrobe") {
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-heading text-white text-center mb-6">
            Тип шафи
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {doorTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleAnswer("doorType", type.id)}
                className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                  formData.answers.doorType === type.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <h4 className="font-bold text-white mb-1">{type.label}</h4>
                <p className="text-sm text-zinc-500">{type.description}</p>
              </button>
            ))}
          </div>
          
          {formData.answers.doorType === "sliding" && (
            <div className="p-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
              <h4 className="text-[#D4AF37] font-bold mb-3">Наповнення дверей</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doorFillings.map((filling) => (
                  <button
                    key={filling.id}
                    onClick={() => handleAnswer("doorFilling", filling.id)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      formData.answers.doorFilling === filling.id
                        ? "border-[#D4AF37] bg-[#D4AF37]/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <h5 className="text-white font-medium text-sm">{filling.label}</h5>
                    <p className="text-xs text-zinc-500">{filling.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (category === "other") {
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-heading text-white text-center mb-6">
            Опишіть ваш проєкт
          </h3>
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <label className="block text-zinc-400 mb-3">Завантажте ескіз або фото (опціонально)</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
              >
                <Upload className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-zinc-300">
                  {formData.file ? formData.file.name : "Натисніть щоб завантажити файл"}
                </span>
              </label>
            </div>
            <textarea
              placeholder="Опишіть вашу ідею детально..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full mt-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#D4AF37] outline-none resize-none h-32"
            />
          </div>
        </div>
      );
    }
    
    // Default for bed, table, kids, restoration
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-heading text-white text-center mb-6">
          Деталі проєкту
        </h3>
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <label className="block text-zinc-400 mb-3">Опишіть ваші побажання</label>
          <textarea
            placeholder={`Наприклад: розміри, колір, особливі вимоги...`}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#D4AF37] outline-none resize-none h-32"
          />
          
          {category === "bed" && (
            <div className="mt-4 p-3 bg-[#D4AF37]/10 rounded-lg">
              <p className="text-sm text-[#D4AF37]">
                💡 Ліжко-трансформер ідеально підходить для квартир-студій та маленьких кімнат
              </p>
            </div>
          )}
          
          {category === "table" && (
            <div className="mt-4 p-3 bg-[#D4AF37]/10 rounded-lg">
              <p className="text-sm text-[#D4AF37]">
                💡 Стіл-трансформер економить до 2 м² простору на кухні
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading text-white text-center mb-6">
        Оберіть стиль
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => handleStyleSelect(style.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 flex gap-4 items-start ${
              formData.style === style.id
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={style.image}
                alt={style.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left flex-1">
              <h4 className={`font-bold text-lg mb-1 ${
                formData.style === style.id ? "text-white" : "text-zinc-300"
              }`}>{style.label}</h4>
              <p className="text-sm text-zinc-400 mb-2">{style.description}</p>
              <p className="text-xs text-[#D4AF37]">{style.example}</p>
            </div>
            {formData.style === style.id && (
              <Check className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading text-white text-center mb-6">
        Контактні дані
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-zinc-400 mb-2">Ваше ім'я *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Олександр"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#D4AF37] outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-zinc-400 mb-2">Телефон *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+380 93 143 1843"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#D4AF37] outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-zinc-400 mb-2">Email (опціонально)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#D4AF37] outline-none"
          />
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.category !== "";
      case 2:
        if (formData.category === "other") return true;
        if (formData.category === "kitchen") return formData.answers.shape;
        if (formData.category === "wardrobe") return formData.answers.doorType;
        return true;
      case 3:
        return formData.style !== "";
      case 4:
        return formData.name !== "" && formData.phone !== "";
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <div className="py-20 md:py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h2 className="font-heading text-3xl text-white mb-4">Дякуємо за заявку!</h2>
            <p className="text-zinc-400 mb-6">
              Ми отримали ваш запит та зв'яжемося з вами найближчим часом для уточнення деталей.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#e5c248] transition-colors"
            >
              Новий розрахунок
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <section id="calculator" className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
            Онлайн-калькулятор
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-white mb-4">
            Розрахуйте вартість за <span className="text-[#D4AF37]">4 кроки</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Відповідайте на логічні питання — отримайте орієнтовну вартість та прорахунок від майстра.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= i
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/10 text-zinc-500"
                }`}
              >
                {i}
              </div>
              {i < 4 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  step > i ? "bg-[#D4AF37]" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div className="flex justify-center gap-8 mb-8 text-sm">
          <span className={step === 1 ? "text-[#D4AF37]" : "text-zinc-500"}>Категорія</span>
          <span className={step === 2 ? "text-[#D4AF37]" : "text-zinc-500"}>Деталі</span>
          <span className={step === 3 ? "text-[#D4AF37]" : "text-zinc-500"}>Стиль</span>
          <span className={step === 4 ? "text-[#D4AF37]" : "text-zinc-500"}>Контакти</span>
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              step === 1
                ? "opacity-0 cursor-default"
                : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Назад
          </button>
          
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-colors ${
                canProceed()
                  ? "bg-[#D4AF37] text-black hover:bg-[#e5c248]"
                  : "bg-white/10 text-zinc-500 cursor-not-allowed"
              }`}
            >
              Далі <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-colors ${
                canProceed() && !isSubmitting
                  ? "bg-[#D4AF37] text-black hover:bg-[#e5c248]"
                  : "bg-white/10 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>Відправка... <RefreshCw className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Відправити <Send className="w-5 h-5" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
