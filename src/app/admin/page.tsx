"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { translateKey, translateValue } from "@/lib/fieldLabels";
import {
  Users, LogOut, RefreshCw, Save, Settings, Image as ImageIcon,
  LayoutDashboard, Star, FileText, Eye, EyeOff,
  Trash2, Plus, Edit3, Megaphone, Layers, Smartphone, Tablet, Monitor
} from "lucide-react";
import { useAutosave } from "@/hooks/useAutosave";
import { defaultBanner, defaultGalleryItems, defaultBlogPosts } from "@/lib/siteDefaults";
import { AdminInput, FileUpload, SectionCard } from "./_components/AdminInput";

type Tab = "leads" | "banner" | "content" | "analytics" | "reviews" | "gallery" | "settings" | "blog";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("leads");
  const [dirty, setDirty] = useState(false);
  const [toastMsg, setToastMsg] = useState<{title:string, type:'success'|'error'} | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [panelWidth, setPanelWidth] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragStart = () => { isDragging.current = true; };
  const onDragMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(80, Math.max(20, ((e.clientX - rect.left) / rect.width) * 100));
    setPanelWidth(pct);
  };
  const onDragEnd = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    return () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
    };
  }, []);

  const showToast = (title: string, type: 'success'|'error' = 'success') => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // State
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [banner, setBanner] = useState(defaultBanner);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editReview, setEditReview] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [editProject, setEditProject] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editBlog, setEditBlog] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>({
    phone: "+380 93 143 1843",
    email: "meblipro2025@gmail.com",
    telegram: "https://t.me/mebli_pro_admin",
    viber: "viber://add?number=380931431843",
    whatsapp: "https://wa.me/380931431843",
    instagram: "",
    logo_text: "MEBLI-PRO",
    logo_subtitle: "МАЙСТЕРНЯ МЕБЛІВ",
    show_logo_graphic: true,
    hero_title: "Меблі Преміум-Класу",
    hero_subtitle: "Кухні, шафи та гардеробні за індивідуальним проектом на Лівому березі Києва",
    about_label: "Про Майстра",
    about_title: "Майстерність, що\nнароджується\nбез посередників",
    about_image: "/images/kitchen_modern.png",
    experience_years: 15,
    about: [
      "Мене звати Олександр, і я виготовляю меблі на замовлення у Києві, зокрема на Лівому березі, Троєщині, Лісовому масиві, Дарниці та Биківні.",
      "Працюю без посередників, тому контролюю кожен етап — від замірів до монтажу. Результат: функціональні меблі для сучасного інтер’єру."
    ],
    services: [
      { title: "Кухонні Меблі", desc: "Індивідуальні кухонні гарнітури, острови та високі шафи з системами зберігання.", bg: "/images/kitchen_modern.png" }
    ],
    faq: [
      { question: "Які терміни виготовлення меблів?", answer: "Виготовлення займає від 14 до 45 днів залежно від складності проекту та матеріалів." }
    ],
    benefits: [
      { title: "Офіційний ФОП", desc: "Працюю за договором. Жодних прихованих ризиків." },
      { title: "Власне виробництво", desc: "Повний контроль якості та реальні терміни." }
    ],
    blog_label: "Корисні статті",
    blog_title: "Блог\nМайстра",
    footer_description: "Авторські корпусні меблі за індивідуальними проектами. Якість, надійність та особиста відповідальність за кожен виріб.",
    footer_location: "Київ, Лівий берег та область"
  });
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState({ totalEvents: 0, pageViews: 0, leadCount: 0, contactClicks: 0, searchTraffic: 0 });
  
  const [analyticsRange, setAnalyticsRange] = useState<'today'|'week'|'month'|'all'>('week');
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  // Load Data
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, reviewsRes, galleryRes, blogsRes, eventsRes, settingsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('blog').select('*').order('created_at', { ascending: false }),
        supabase.from('site_events').select('*').order('created_at', { ascending: false }).limit(200),
        fetch('/api/admin/settings?_t=' + Date.now(), { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
      ]);
      
      if (leadsRes?.data) setLeads(leadsRes.data);
      if (reviewsRes?.data) setReviews(reviewsRes.data);
      if (galleryRes?.data) setGallery(galleryRes.data);
      if (blogsRes?.data) setBlogs(blogsRes.data);

      if (settingsRes?.banner) setBanner(settingsRes.banner);
      if (settingsRes?.site) {
        setSiteSettings((prev: any) => ({
          ...prev,
          ...settingsRes.site
        }));
      }

      if (eventsRes?.data) {
        setAnalytics(eventsRes.data);
        setAnalyticsSummary({
          totalEvents: eventsRes.data.length,
          pageViews: eventsRes.data.filter((e:any) => e.event_type === 'page_view').length,
          leadCount: eventsRes.data.filter((e:any) => e.event_type === 'lead_submit').length,
          contactClicks: eventsRes.data.filter((e:any) => e.event_type === 'contact_click').length,
          searchTraffic: eventsRes.data.filter((e:any) => e.source === 'search').length,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Помилка завантаження. Перевірте Supabase-ключі.");
    } finally {
      setLoading(false);
      setAutosaveEnabled(true);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Sync to Iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_SETTINGS',
        payload: { site: siteSettings, banner }
      }, '*');
    }
  }, [siteSettings, banner]);

  // Save Settings
  const saveSettings = useCallback(async (payload: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Помилка збереження налаштувань');
      }
      setDirty(false);
      setAutosaveStatus('saved');
    } catch (err: unknown) {
      setAutosaveStatus('error');
      throw err;
    }
  }, []);

  const { status: autosaveStatusFromHook } = useAutosave({
    value: { banner, site: siteSettings },
    onSave: saveSettings,
    delay: 1500,
    enabled: autosaveEnabled && dirty,
  });

  useEffect(() => { setAutosaveStatus(autosaveStatusFromHook); }, [autosaveStatusFromHook]);

  const saveAll = async () => {
    try {
      setLoading(true);
      await saveSettings({ banner, site: siteSettings });
      showToast("Налаштування збережено!");
    } catch (err: any) {
      showToast(`Помилка: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generic Update Helpers
  const updateSiteSettings = (patch: any) => {
    setSiteSettings((prev: any) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const updateSiteArrayItem = (key: string, index: number, patch: any) => {
    setSiteSettings((prev: any) => {
      const items = [...(prev[key] || [])];
      items[index] = { ...items[index], ...patch };
      return { ...prev, [key]: items };
    });
    setDirty(true);
  };

  const addSiteArrayItem = (key: string, item: any) => {
    setSiteSettings((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), item] }));
    setDirty(true);
  };

  const removeSiteArrayItem = (key: string, index: number) => {
    setSiteSettings((prev: any) => {
      const items = [...(prev[key] || [])];
      items.splice(index, 1);
      return { ...prev, [key]: items };
    });
    setDirty(true);
  };

  // Iframe Focus Management
  const handleFocus = (section: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'FOCUS_SECTION', payload: { section } }, '*');
    }
  };

  const handleBlur = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'BLUR_SECTION' }, '*');
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  // Upload Generic
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}.${ext}`;
    
    try {
      setLoading(true);
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'site-media';
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) {
        if (error.message.includes('Bucket not found')) {
            throw new Error(`Бакет "${bucket}" не знайдено. Будь ласка, виконайте SQL скрипт supabase_storage_fix.sql у Supabase.`);
        }
        throw error;
      }
      
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (data) {
        callback(data.publicUrl);
        setDirty(true);
        showToast("Фото завантажено!");
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // UI Templates
  const VisualTemplateOption = ({ isActive, onClick, label, children }: any) => (
    <button
      onClick={onClick}
      className={`relative p-3 border rounded-md cursor-pointer transition-all flex flex-col items-center gap-2 ${
        isActive ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5 text-zinc-500'
      }`}
    >
      <div className="w-full aspect-[4/3] bg-black/50 border border-white/5 rounded-sm p-2 flex items-center justify-center pointer-events-none">
        {children}
      </div>
      <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-[#D4AF37]' : 'text-zinc-500'}`}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden h-screen">
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-[999] px-6 py-3 border rounded-md shadow-2xl flex items-center gap-3 animate-in slide-in-from-top ${toastMsg.type === 'success' ? 'bg-[#0a3010] border-green-500/50 text-green-100' : 'bg-[#300a0a] border-red-500/50 text-red-100'}`}>
          <span className="text-sm font-bold tracking-wide">{toastMsg.title}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-black/90 relative z-50">
        <div className="font-heading italic text-xl tracking-wider text-white">
          MEBLI-PRO <span className="text-zinc-600 font-sans text-[10px] uppercase not-italic">Admin</span>
        </div>

        <div className="hidden xl:flex items-center mx-auto bg-white/5 rounded-md p-1 border border-white/10">
           <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded-sm transition-colors ${previewDevice === 'desktop' ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-white'}`} title="Десктоп"><Monitor className="w-4 h-4"/></button>
           <button onClick={() => setPreviewDevice('tablet')} className={`p-2 rounded-sm transition-colors ${previewDevice === 'tablet' ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-white'}`} title="Планшет"><Tablet className="w-4 h-4"/></button>
           <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded-sm transition-colors ${previewDevice === 'mobile' ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-white'}`} title="Мобільний"><Smartphone className="w-4 h-4"/></button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
            Статус: 
            {autosaveStatus === 'saving' && <span className="text-blue-400">Зберігаємо...</span>}
            {autosaveStatus === 'saved' && <span className="text-green-400">✓ Збережено</span>}
            {autosaveStatus === 'error' && <span className="text-red-400">✗ Помилка</span>}
            {autosaveStatus === 'idle' && (dirty ? <span className="text-yellow-400">Є незбережені зміни</span> : <span>Готово</span>)}
          </div>
          <button onClick={saveAll} className={`hidden md:flex items-center gap-2 px-6 h-9 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${dirty ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-zinc-500 border border-white/10'}`}>
            <Save className="w-3 h-3" /> Зберегти
          </button>
          <button onClick={loadAll} className="p-2 text-zinc-500 hover:text-white cursor-pointer"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={logout} className="p-2 text-zinc-500 hover:text-red-400 cursor-pointer"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR TABS */}
        <aside className="w-[60px] md:w-56 shrink-0 border-r border-white/5 flex flex-col bg-black/50 overflow-y-auto">
          {[
            { id: "leads", label: "Заявки", icon: Users },
            { id: "banner", label: "Банер", icon: Megaphone },
            { id: "content", label: "Контент", icon: Layers },
            { id: "blog", label: "Блог", icon: FileText },
            { id: "gallery", label: "Галерея", icon: ImageIcon },
            { id: "reviews", label: "Відгуки", icon: Star },
            { id: "analytics", label: "Аналітика", icon: LayoutDashboard },
            { id: "settings", label: "Налаштування", icon: Settings },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)} className={`w-full flex items-center gap-3 px-4 md:px-6 py-4 text-left transition-all cursor-pointer ${tab === t.id ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-r-2 border-[#D4AF37]' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}>
              <t.icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-xs uppercase tracking-widest font-bold">{t.label}</span>
            </button>
          ))}
        </aside>

        {/* MAIN SPLIT AREA */}
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
          
          {/* FORMS (LEFT SIDE) */}
          <div className="h-full overflow-y-auto bg-[#0a0a0a] border-r border-white/5 relative flex flex-col" style={{ width: `${panelWidth}%` }}>
            <div className="max-w-xl mx-auto w-full p-8 pb-32">
              
              {loading && <div className="text-center text-[#D4AF37] text-sm uppercase tracking-widest pt-20 animate-pulse">Завантаження...</div>}

              {/* BANNER TAB */}
              {!loading && tab === "banner" && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-md border border-white/10">
                    <div>
                      <h2 className="text-xl font-heading text-white">Статус банера</h2>
                      <p className="text-xs text-zinc-500">Управління відображенням акції.</p>
                    </div>
                    <button onClick={() => { setBanner({...banner, is_active: !banner.is_active}); setDirty(true); }} className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase rounded-sm cursor-pointer ${banner.is_active ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {banner.is_active ? 'Увімкнено' : 'Вимкнено'}
                    </button>
                  </div>

                  <SectionCard title="Візуальний Макет">
                    <div className="grid grid-cols-3 gap-4">
                      <VisualTemplateOption isActive={banner.template === 'text'} onClick={() => { setBanner({...banner, template: 'text'}); setDirty(true); }} label="Текст">
                        <div className="w-full space-y-1"><div className="h-2 w-3/4 bg-current mx-auto rounded-full" /><div className="h-1.5 w-1/2 bg-current opacity-50 mx-auto rounded-full" /></div>
                      </VisualTemplateOption>
                      <VisualTemplateOption isActive={banner.template === 'image_text'} onClick={() => { setBanner({...banner, template: 'image_text'}); setDirty(true); }} label="Спліт (Фото+Текст)">
                        <div className="w-full flex gap-1"><div className="w-1/2 h-8 bg-current opacity-30 rounded-sm" /><div className="w-1/2 space-y-1"><div className="h-1.5 w-full bg-current rounded-full"/><div className="h-1 w-3/4 bg-current opacity-50 rounded-full"/></div></div>
                      </VisualTemplateOption>
                      <VisualTemplateOption isActive={banner.template === 'image'} onClick={() => { setBanner({...banner, template: 'image'}); setDirty(true); }} label="Тільки Фото">
                        <div className="w-full h-8 bg-current opacity-30 rounded-sm overflow-hidden flex items-center justify-center"><ImageIcon className="w-4 h-4 opacity-50" /></div>
                      </VisualTemplateOption>
                    </div>
                  </SectionCard>

                  <SectionCard title="Текстовий контент">
                    {banner.template !== "image" && (
                      <div className="space-y-4">
                        <AdminInput label="Заголовок" value={banner.title} onChange={(v) => {setBanner({...banner, title: v}); setDirty(true);}} onFocus={() => handleFocus('banner')} onBlur={handleBlur} />
                        <AdminInput label="Текст" rows={3} value={banner.text} onChange={(v) => {setBanner({...banner, text: v}); setDirty(true);}} onFocus={() => handleFocus('banner')} onBlur={handleBlur} />
                        <AdminInput label="Кнопка" value={banner.button_text} onChange={(v) => {setBanner({...banner, button_text: v}); setDirty(true);}} onFocus={() => handleFocus('banner')} onBlur={handleBlur} />
                      </div>
                    )}
                  </SectionCard>

                  {banner.template !== "text" && (
                    <SectionCard title="Зображення">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1"><AdminInput label="Малюнок (URL)" value={banner.image_url} onChange={(v) => {setBanner({...banner, image_url: v}); setDirty(true);}} onFocus={() => handleFocus('banner')} onBlur={handleBlur} /></div>
                          <div className="w-[150px] mt-6"><FileUpload label="Огляд..." onUpload={(e) => uploadImage(e, (url) => setBanner({...banner, image_url: url}))} /></div>
                        </div>
                        {banner.image_url && <img src={banner.image_url} className="w-32 h-20 object-cover rounded-sm border border-white/10" alt="Banner preview" />}
                        {banner.template === 'image_text' && (
                          <div className="flex bg-black/40 p-1 border border-white/5 rounded-sm w-max">
                            {['left','right'].map(pos => (
                              <button key={pos} onClick={() => {setBanner({...banner, image_position: pos}); setDirty(true);}} className={`px-4 py-2 text-xs uppercase tracking-widest rounded-sm ${banner.image_position === pos ? 'bg-[#D4AF37] text-black font-bold' : 'text-zinc-500 hover:text-white'}`}>{pos === 'left' ? 'Фото зліва' : 'Фото справа'}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}
                </div>
              )}

              {/* CONTENT TAB */}
              {!loading && tab === "content" && (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-2xl font-heading text-white">Секції сторінки</h2>
                  
                  <SectionCard title="Головний екран (Hero)">
                    <AdminInput label="Вступний заголовок" value={siteSettings.hero_title || ''} onChange={(v) => updateSiteSettings({hero_title: v})} onFocus={() => handleFocus('hero')} onBlur={handleBlur} />
                    <AdminInput label="Підзаголовок" rows={3} value={siteSettings.hero_subtitle || ''} onChange={(v) => updateSiteSettings({hero_subtitle: v})} onFocus={() => handleFocus('hero')} onBlur={handleBlur} />
                  </SectionCard>

                  <SectionCard title="Блок 'Про Майстра'">
                    <AdminInput label="Підпис секції" value={siteSettings.about_label || ''} onChange={(v) => updateSiteSettings({about_label: v})} onFocus={() => handleFocus('about')} onBlur={handleBlur} />
                    <AdminInput label="Заголовок (кожен рядок з нового рядка)" rows={4} value={siteSettings.about_title || ''} onChange={(v) => updateSiteSettings({about_title: v})} onFocus={() => handleFocus('about')} onBlur={handleBlur} />
                    <AdminInput label="Кількість років досвіду" value={String(siteSettings.experience_years || 0)} onChange={(v) => updateSiteSettings({experience_years: Number(v) || 0})} onFocus={() => handleFocus('about')} onBlur={handleBlur} />
                    <div className="flex gap-4">
                      <div className="flex-1"><AdminInput label="Фото блоку (URL)" value={siteSettings.about_image || ''} onChange={(v) => updateSiteSettings({about_image: v})} onFocus={() => handleFocus('about')} onBlur={handleBlur} /></div>
                      <div className="w-[120px] mt-6"><FileUpload label="Огляд..." onUpload={(e) => uploadImage(e, (url) => updateSiteSettings({about_image: url}))} /></div>
                    </div>
                    <AdminInput label="Текст про вас (абзаци, розділені Enter)" rows={6} value={(siteSettings.about || []).join('\n\n')} onChange={(v) => updateSiteSettings({about: v.split(/\n\s*\n/).filter(Boolean)})} onFocus={() => handleFocus('about')} onBlur={handleBlur} />
                  </SectionCard>

                  <SectionCard title="Переваги" actions={<button onClick={() => addSiteArrayItem('benefits', { title: 'Нова перевага', desc: '' })} className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#D4AF37] hover:underline"><Plus className="w-3 h-3"/> Додати</button>}>
                    <div className="space-y-6">
                      {(siteSettings.benefits || []).map((benefit: { title: string; desc: string }, idx: number) => (
                        <div key={idx} className="p-4 border border-white/10 relative rounded-sm bg-black/40">
                          <button onClick={() => removeSiteArrayItem('benefits', idx)} className="absolute top-2 right-2 text-red-500/50 hover:text-red-400 p-1"><Trash2 className="w-4 h-4"/></button>
                          <div className="space-y-3 pt-2">
                            <AdminInput label={`Назва переваги #${idx + 1}`} value={benefit.title} onChange={(v) => updateSiteArrayItem('benefits', idx, { title: v })} onFocus={() => handleFocus('about')} onBlur={handleBlur} />
                            <AdminInput label="Опис" rows={2} value={benefit.desc} onChange={(v) => updateSiteArrayItem('benefits', idx, { desc: v })} onFocus={() => handleFocus('about')} onBlur={handleBlur} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Послуги" actions={<button onClick={() => addSiteArrayItem('services', {title: 'Нова послуга', desc: '', bg: ''})} className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#D4AF37] hover:underline"><Plus className="w-3 h-3"/> Додати</button>}>
                    <div className="space-y-6">
                      {(siteSettings.services || []).map((srv: any, idx: number) => (
                        <div key={idx} className="p-4 border border-white/10 relative rounded-sm bg-black/40">
                          <button onClick={() => removeSiteArrayItem('services', idx)} className="absolute top-2 right-2 text-red-500/50 hover:text-red-400 p-1"><Trash2 className="w-4 h-4"/></button>
                          <div className="space-y-3 pt-2">
                             <AdminInput label={`Назва послуги #${idx+1}`} value={srv.title} onChange={(v) => updateSiteArrayItem('services', idx, {title: v})} onFocus={() => handleFocus(`service_${idx}`)} onBlur={handleBlur} />
                             <AdminInput label="Опис" rows={2} value={srv.desc} onChange={(v) => updateSiteArrayItem('services', idx, {desc: v})} onFocus={() => handleFocus(`service_${idx}`)} onBlur={handleBlur} />
                             <div className="flex gap-4">
                                <div className="flex-1"><AdminInput label="URL фона / Фото" value={srv.bg} onChange={(v) => updateSiteArrayItem('services', idx, {bg: v})} onFocus={() => handleFocus(`service_${idx}`)} onBlur={handleBlur} /></div>
                                <div className="w-[120px] mt-6"><FileUpload label="Огляд..." onUpload={(e) => uploadImage(e, (url) => updateSiteArrayItem('services', idx, {bg: url}))} /></div>
                             </div>
                          </div>
                      </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="FAQ" actions={<button onClick={() => addSiteArrayItem('faq', { question: 'Нове питання', answer: '' })} className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#D4AF37] hover:underline"><Plus className="w-3 h-3"/> Додати</button>}>
                    <div className="space-y-6">
                      {(siteSettings.faq || []).map((faqItem: { question: string; answer: string }, idx: number) => (
                        <div key={idx} className="p-4 border border-white/10 relative rounded-sm bg-black/40">
                          <button onClick={() => removeSiteArrayItem('faq', idx)} className="absolute top-2 right-2 text-red-500/50 hover:text-red-400 p-1"><Trash2 className="w-4 h-4"/></button>
                          <div className="space-y-3 pt-2">
                            <AdminInput label={`Питання #${idx + 1}`} value={faqItem.question} onChange={(v) => updateSiteArrayItem('faq', idx, { question: v })} onFocus={() => handleFocus('faq')} onBlur={handleBlur} />
                            <AdminInput label="Відповідь" rows={3} value={faqItem.answer} onChange={(v) => updateSiteArrayItem('faq', idx, { answer: v })} onFocus={() => handleFocus('faq')} onBlur={handleBlur} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Блок блогу">
                    <AdminInput label="Підпис секції" value={siteSettings.blog_label || ''} onChange={(v) => updateSiteSettings({blog_label: v})} onFocus={() => handleFocus('blog')} onBlur={handleBlur} />
                    <AdminInput label="Заголовок (кожен рядок з нового рядка)" rows={3} value={siteSettings.blog_title || ''} onChange={(v) => updateSiteSettings({blog_title: v})} onFocus={() => handleFocus('blog')} onBlur={handleBlur} />
                  </SectionCard>

                  <SectionCard title="Footer">
                    <AdminInput label="Опис у футері" rows={3} value={siteSettings.footer_description || ''} onChange={(v) => updateSiteSettings({footer_description: v})} onFocus={() => handleFocus('footer')} onBlur={handleBlur} />
                    <AdminInput label="Локація у футері" value={siteSettings.footer_location || ''} onChange={(v) => updateSiteSettings({footer_location: v})} onFocus={() => handleFocus('footer')} onBlur={handleBlur} />
                  </SectionCard>
                </div>
              )}

              {/* BLOG TAB */}
              {!loading && tab === "blog" && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-heading text-white">Статті Блогу</h2>
                    <button onClick={() => setEditBlog({title: '', slug: '', excerpt: '', content: '', image_url: '', layout_style: 'standard'})} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm cursor-pointer"><Plus className="w-4 h-4" /> Додати</button>
                  </div>

                  {editBlog ? (
                    <div className="border border-[#D4AF37]/50 rounded-sm p-6 bg-[#D4AF37]/5 space-y-6 animate-in slide-in-from-top-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-heading text-[#D4AF37]">{editBlog.id ? 'Редагувати' : 'Нова стаття'}</h3>
                        <div className="text-xs text-zinc-500 font-mono">slug: {editBlog.slug || generateSlug(editBlog.title)}</div>
                      </div>

                       <SectionCard title="Вигляд">
                        <div className="grid grid-cols-2 gap-4">
                          <VisualTemplateOption isActive={editBlog.layout_style === 'standard'} onClick={() => setEditBlog({...editBlog, layout_style: 'standard'})} label="Звичайний (Текст+Картинка)">
                            <div className="w-full flex gap-1"><div className="w-1/3 bg-current opacity-30 rounded-sm"/><div className="w-2/3 space-y-1"><div className="h-1.5 w-full bg-current rounded-full" /><div className="h-1 w-full bg-current opacity-50 rounded-full" /></div></div>
                          </VisualTemplateOption>
                          <VisualTemplateOption isActive={editBlog.layout_style === 'featured'} onClick={() => setEditBlog({...editBlog, layout_style: 'featured'})} label="Featured (Велике фото зверху)">
                            <div className="w-full flex flex-col gap-1 items-center justify-center"><div className="w-full h-4 bg-current opacity-30 rounded-sm" /><div className="h-1.5 w-3/4 bg-current opacity-80 rounded-full" /></div>
                          </VisualTemplateOption>
                        </div>
                      </SectionCard>

                      <AdminInput label="Назва статті" value={editBlog.title} onChange={(v) => setEditBlog({...editBlog, title: v, slug: generateSlug(v)})} onFocus={() => handleFocus('blog')} onBlur={handleBlur} />
                      <AdminInput label="Короткий абзац (excerpt)" rows={2} value={editBlog.excerpt} onChange={(v) => setEditBlog({...editBlog, excerpt: v})} onFocus={() => handleFocus('blog')} onBlur={handleBlur} />
                      <AdminInput label="Повний текст статті (можна з HTML/Markdown-розміткою)" rows={10} value={editBlog.content} onChange={(v) => setEditBlog({...editBlog, content: v})} onFocus={() => handleFocus('blog')} onBlur={handleBlur} />
                       
                      <div className="flex gap-4">
                        <div className="flex-1"><AdminInput label="Обкладинка (URL)" value={editBlog.image_url} onChange={(v) => setEditBlog({...editBlog, image_url: v})} onFocus={() => handleFocus('blog')} onBlur={handleBlur} /></div>
                        <div className="w-[150px] mt-6"><FileUpload label="Огляд..." onUpload={(e) => uploadImage(e, (url) => setEditBlog({...editBlog, image_url: url}))} /></div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={async () => {
                          const payload = {...editBlog, slug: editBlog.slug || generateSlug(editBlog.title)};
                          const { error } = editBlog.id ? await supabase.from('blog').update(payload).eq('id', editBlog.id) : await supabase.from('blog').insert(payload);
                          if(error) showToast(error.message, 'error'); else { setEditBlog(null); loadAll(); showToast('Збережено!'); }
                        }} className="px-6 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm">Зберегти</button>
                        <button onClick={() => setEditBlog(null)} className="px-6 py-2 border border-white/20 text-xs text-white rounded-sm">Скасувати</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogs.map(b => (
                        <div key={b.id} className="p-4 border border-white/10 flex gap-4 bg-white/5 rounded-sm items-center hover:border-white/20 transition-colors">
                          <img src={b.image_url || '/placeholder.png'} className="w-16 h-16 object-cover rounded-sm opacity-80" alt=""/>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate">{b.title}</h4>
                            <p className="text-xs text-zinc-500 font-mono mt-1">/{b.slug}</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setEditBlog(b)} className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-md"><Edit3 className="w-4 h-4"/></button>
                             <button onClick={async () => { if(confirm("Видалити?")) { const { error } = await supabase.from('blog').delete().eq('id', b.id); if (error) { showToast(error.message, 'error'); } else { loadAll(); showToast('Статтю видалено'); } } }} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-md"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GALLERY TAB */}
              {!loading && tab === "gallery" && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-heading text-white">Галерея</h2>
                    <button onClick={() => setEditProject({ title: '', materials: '', category: '', image_urls: [''] })} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm cursor-pointer"><Plus className="w-4 h-4" /> Додати роботу</button>
                  </div>

                  {editProject ? (
                    <div className="border border-[#D4AF37]/50 rounded-sm p-6 bg-[#D4AF37]/5 space-y-6 animate-in slide-in-from-top-4">
                      <h3 className="text-lg font-heading text-[#D4AF37]">{editProject.id ? 'Редагувати' : 'Нова робота'}</h3>
                      <AdminInput label="Назва проекту" value={editProject.title} onChange={(v) => setEditProject({...editProject, title: v})} onFocus={() => handleFocus('gallery_project')} onBlur={handleBlur} />
                      <AdminInput label="Матеріали / Опис" rows={3} value={editProject.materials} onChange={(v) => setEditProject({...editProject, materials: v})} onFocus={() => handleFocus('gallery_project')} onBlur={handleBlur} />
                      <AdminInput label="Категорія (необов'язково)" value={editProject.category || ''} onChange={(v) => setEditProject({...editProject, category: v})} />
                      
                      <div className="flex gap-4">
                        <div className="flex-1"><AdminInput label="Зображення (URL)" value={(editProject.image_urls||[]).join(', ')} onChange={(v) => setEditProject({...editProject, image_urls: v.split(',').map((s:string) => s.trim())})} onFocus={() => handleFocus('gallery_project')} onBlur={handleBlur} /></div>
                        <div className="w-[150px] mt-6"><FileUpload label="Огляд..." onUpload={(e) => uploadImage(e, (url) => setEditProject((prev:any) => ({...prev, image_urls: [url]})))} /></div>
                      </div>
                      {editProject.image_urls?.[0] && <div className="mt-2"><img src={editProject.image_urls[0]} alt="Preview" className="w-32 h-32 object-cover border border-white/10 rounded-sm" /></div>}

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={async () => {
                          const payload: any = { title: editProject.title, materials: editProject.materials, image_urls: editProject.image_urls || [] };
                          if (editProject.category) payload.category = editProject.category;
                          const { error } = editProject.id ? await supabase.from('gallery').update(payload).eq('id', editProject.id) : await supabase.from('gallery').insert(payload);
                          if(error) showToast(error.message, 'error'); else { setEditProject(null); loadAll(); showToast('Збережено!'); }
                        }} className="px-6 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm">Зберегти</button>
                        <button onClick={() => setEditProject(null)} className="px-6 py-2 border border-white/20 text-xs text-white rounded-sm">Скасувати</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gallery.map(p => (
                        <div key={p.id} className="p-4 border border-white/10 flex gap-4 bg-white/5 rounded-sm items-center hover:border-white/20 transition-colors">
                          <ImageIcon className="w-10 h-10 text-zinc-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate">{p.title}</h4>
                            <p className="text-xs text-zinc-500 mt-1 truncate">{p.materials}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <button onClick={() => setEditProject(p)} className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-md"><Edit3 className="w-4 h-4"/></button>
                             <button onClick={async () => { if(confirm("Видалити?")) { const { error } = await supabase.from('gallery').delete().eq('id', p.id); if (error) { showToast(error.message, 'error'); } else { loadAll(); showToast('Роботу видалено'); } } }} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-md"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS TAB */}
              {!loading && tab === "reviews" && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-heading text-white">Відгуки</h2>
                    <button onClick={() => setEditReview({ author_name: '', text_content: '', rating: 5, is_approved: true })} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm cursor-pointer"><Plus className="w-4 h-4" /> Додати</button>
                  </div>

                  {editReview ? (
                    <div className="border border-[#D4AF37]/50 rounded-sm p-6 bg-[#D4AF37]/5 space-y-6 animate-in slide-in-from-top-4">
                      <h3 className="text-lg font-heading text-[#D4AF37]">{editReview.id ? 'Редагувати' : 'Новий відгук'}</h3>
                      <AdminInput label="Ім'я автора" value={editReview.author_name} onChange={(v) => setEditReview({...editReview, author_name: v})} onFocus={() => handleFocus('reviews')} onBlur={handleBlur} />
                      <AdminInput label="Текст відгуку" rows={4} value={editReview.text_content} onChange={(v) => setEditReview({...editReview, text_content: v})} onFocus={() => handleFocus('reviews')} onBlur={handleBlur} />
                      
                      <div className="flex gap-4 items-center">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">Оцінка</label>
                          <div className="flex gap-1">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setEditReview({...editReview, rating: n})} className={`w-8 h-8 rounded-sm text-xs font-bold ${n <= editReview.rating ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-zinc-500'}`}>{n}</button>)}</div>
                        </div>
                        <div className="pt-6 pl-4 border-l border-white/10">
                           <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                             <input type="checkbox" checked={editReview.is_approved} onChange={e => setEditReview({...editReview, is_approved: e.target.checked})} className="accent-[#D4AF37]" />
                             Дозволити показ на сайті
                           </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={async () => {
                          const payload = { author_name: editReview.author_name, text_content: editReview.text_content, rating: editReview.rating, is_approved: editReview.is_approved };
                          const { error } = editReview.id ? await supabase.from('reviews').update(payload).eq('id', editReview.id) : await supabase.from('reviews').insert(payload);
                          if(error) showToast(error.message, 'error'); else { setEditReview(null); loadAll(); showToast('Збережено!'); }
                        }} className="px-6 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm">Зберегти</button>
                        <button onClick={() => setEditReview(null)} className="px-6 py-2 border border-white/20 text-xs text-white rounded-sm">Скасувати</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {reviews.map(r => (
                        <div key={r.id} className={`p-4 border flex gap-4 rounded-sm items-start transition-colors ${r.is_approved ? 'border-white/10 bg-white/5' : 'border-red-500/30 bg-red-500/5'}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-white font-bold text-sm">{r.author_name}</h4>
                              <span className="text-[#D4AF37] text-xs">{'★'.repeat(r.rating)}</span>
                              {!r.is_approved && <span className="text-[9px] bg-red-500/20 text-red-300 px-2 rounded-sm uppercase tracking-wider">Прихований</span>}
                            </div>
                            <p className="text-sm text-zinc-400">{r.text_content}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <button onClick={async () => { await supabase.from('reviews').update({ is_approved: !r.is_approved }).eq('id', r.id); loadAll(); }} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md">{r.is_approved ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                             <button onClick={() => setEditReview(r)} className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-md"><Edit3 className="w-4 h-4"/></button>
                             <button onClick={async () => { if(confirm("Видалити?")) { const { error } = await supabase.from('reviews').delete().eq('id', r.id); if (error) { showToast(error.message, 'error'); } else { loadAll(); showToast('Відгук видалено'); } } }} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-md"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* LEADS TAB */}
              {!loading && tab === "leads" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading text-white">Заявки <span className="text-[#D4AF37]">({leads.filter(l => statusFilter === "all" || l.status === statusFilter).length})</span></h2>
                    <button onClick={loadAll} className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest cursor-pointer">Оновити</button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[["all","Всі"],["new","Нові"],["in_progress","В роботі"],["closed","Завершені"]].map(([v,l]) => {
                      const count = v === "all" ? leads.length : leads.filter(ld => ld.status === v).length;
                      return <button key={v} onClick={() => setStatusFilter(v)} className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm border cursor-pointer transition-all ${statusFilter===v?'border-[#D4AF37] bg-[#D4AF37]/10 text-white':'border-white/5 text-zinc-600 hover:text-white'}`}>{l} {count > 0 && <span className="ml-1 opacity-60">({count})</span>}</button>;
                    })}
                  </div>
                  <div className="space-y-4">
                    {leads.filter(l => statusFilter === "all" || l.status === statusFilter).map(lead => {
                      const det = lead.details || {};
                      const answers = det.answers || {};
                      const files: string[] = lead.files_url || [];
                      return (
                        <div key={lead.id} className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
                          {/* Header */}
                          <div className="p-5 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <div className="text-lg font-bold text-white">{lead.client_name || 'Без імені'}</div>
                                <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold ${lead.status === 'new' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' : lead.status === 'in_progress' ? 'border-blue-500/40 text-blue-400 bg-blue-500/10' : 'border-green-500/40 text-green-400 bg-green-500/10'}`}>
                                  {lead.status === 'new' ? 'Нова' : lead.status === 'in_progress' ? 'В роботі' : 'Завершена'}
                                </span>
                              </div>
                              <a href={`tel:${(lead.client_contact||'').replace(/\s+/g,'')}`} className="text-[#D4AF37] text-sm font-mono hover:underline">{lead.client_contact}</a>
                              <div className="text-zinc-500 text-xs mt-1">{lead.project_topic} • {new Date(lead.created_at).toLocaleString('uk-UA')}</div>
                            </div>
                            <select value={lead.status||'new'} onChange={async (e) => { const { error } = await supabase.from('leads').update({status: e.target.value}).eq('id', lead.id); if(error) showToast(error.message,'error'); else loadAll(); }} className="bg-white/5 border border-white/10 px-3 py-2 rounded-sm text-xs text-white outline-none cursor-pointer shrink-0">
                              <option value="new" className="bg-black text-white">Нова</option>
                              <option value="in_progress" className="bg-black text-white">В роботі</option>
                              <option value="closed" className="bg-black text-white">Завершена</option>
                            </select>
                          </div>
                          {/* Details grid */}
                          {(Object.keys(answers).length > 0 || lead.budget_range || lead.notes) && (
                            <div className="border-t border-white/5 px-5 py-4 space-y-3">
                              {Object.keys(answers).length > 0 && (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                  {Object.entries(answers).map(([k, v]) => (
                                    <div key={k} className="flex gap-2">
                                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 shrink-0 min-w-[80px]">{translateKey(k)}:</span>
                                      <span className="text-xs text-zinc-300 font-mono">{translateValue(String(v))}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {lead.notes && <div className="text-xs text-zinc-400 bg-white/[0.03] p-3 rounded-sm border border-white/5"><span className="text-zinc-600 uppercase tracking-wider text-[10px]">Примітки: </span>{lead.notes}</div>}
                              {lead.budget_range && <div className="text-xs"><span className="text-zinc-600 uppercase tracking-wider text-[10px]">Бюджет: </span><span className="text-[#D4AF37] font-bold">{lead.budget_range}</span></div>}
                            </div>
                          )}
                          {/* Files */}
                          {files.length > 0 && (
                            <div className="border-t border-white/5 px-5 py-3">
                              <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Файли ({files.length})</div>
                              <div className="flex flex-wrap gap-2">
                                {files.map((url, i) => {
                                  const isPdf = url.toLowerCase().includes('.pdf');
                                  const isImg = /\.(jpg|jpeg|png|webp|gif)/.test(url.toLowerCase());
                                  return (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm hover:border-[#D4AF37]/40 transition-colors text-[10px] text-zinc-300 hover:text-white">
                                      {isPdf ? '📄' : isImg ? '🖼️' : '📎'} Файл {i+1}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {/* Delete */}
                          <div className="border-t border-white/5 px-5 py-2 flex justify-end">
                            <button onClick={async () => { if(!confirm('Видалити заявку?')) return; const { error } = await supabase.from('leads').delete().eq('id', lead.id); if(error) showToast(error.message,'error'); else { showToast('Заявку видалено'); loadAll(); } }} className="text-[10px] uppercase tracking-widest text-red-500/50 hover:text-red-400 cursor-pointer transition-colors">Видалити</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {leads.length === 0 && <p className="text-zinc-600 py-10 text-center">Заявок поки немає.</p>}
                </div>
              )}

              {/* ANALYTICS TAB */}
              {!loading && tab === "analytics" && (() => {
                const now = new Date();
                const cutoff = analyticsRange === 'today' ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) :
                  analyticsRange === 'week' ? new Date(now.getTime() - 7 * 86400000) :
                  analyticsRange === 'month' ? new Date(now.getTime() - 30 * 86400000) : new Date(0);
                const filtered = analytics.filter(e => new Date(e.created_at) >= cutoff);
                const views = filtered.filter(e => e.event_type === 'page_view').length;
                const leadsN = filtered.filter(e => e.event_type === 'lead_submit').length;
                const contacts = filtered.filter(e => e.event_type === 'contact_click').length;
                const seo = filtered.filter(e => e.source === 'search').length;
                const direct = filtered.filter(e => e.source === 'direct').length;
                const referral = filtered.filter(e => e.source === 'referral').length;
                // Daily chart: last 7 days
                const days = Array.from({length: 7}, (_, i) => {
                  const d = new Date(now.getTime() - (6-i) * 86400000);
                  const label = d.toLocaleDateString('uk-UA', {day:'2-digit',month:'2-digit'});
                  const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                  const count = analytics.filter(e => e.created_at?.startsWith(key) && e.event_type === 'page_view').length;
                  return { label, count };
                });
                const maxDay = Math.max(...days.map(d => d.count), 1);
                return (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h2 className="text-2xl font-heading text-white">Аналітика</h2>
                      <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                        {([['today','Сьогодні'],['week','7 днів'],['month','30 днів'],['all','Всі']] as const).map(([v,l]) => (
                          <button key={v} onClick={() => setAnalyticsRange(v)} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-colors ${analyticsRange===v?'bg-[#D4AF37] text-black':'text-zinc-500 hover:text-white'}`}>{l}</button>
                        ))}
                      </div>
                    </div>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Переглядів', value: views, color: '#D4AF37', icon: '👁' },
                        { label: 'Заявок', value: leadsN, color: '#38bdf8', icon: '📋' },
                        { label: 'Контакти', value: contacts, color: '#f97316', icon: '📞' },
                        { label: 'SEO Трафік', value: seo, color: '#34d399', icon: '🔍' },
                      ].map((m) => (
                        <div key={m.label} className="p-5 border border-white/10 bg-white/[0.03] rounded-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg">{m.icon}</span>
                            <div className="h-0.5 flex-1 mx-3 rounded-full" style={{background: `linear-gradient(to right, ${m.color}, transparent)`}} />
                          </div>
                          <div className="text-4xl font-heading text-white mb-1">{m.value}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Daily views bar chart */}
                    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-5">
                      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Перегляди за 7 днів</div>
                      <div className="flex items-end gap-2 h-28">
                        {days.map((d, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 flex-1">
                            <div className="text-[9px] text-zinc-600 font-mono">{d.count || ''}</div>
                            <div className="w-full rounded-t-sm transition-all duration-500" style={{height: `${Math.max(4,(d.count/maxDay)*96)}px`, background: d.count > 0 ? 'linear-gradient(to top,#D4AF37,#F0C453)' : '#1a1a1a'}} />
                            <div className="text-[9px] text-zinc-600">{d.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Source breakdown */}
                    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-5">
                      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Джерела трафіку</div>
                      <div className="space-y-3">
                        {[['Пошук (Google)', seo, '#34d399'],['Прямий', direct, '#D4AF37'],['Рефер.', referral, '#38bdf8']].map(([label, val, color]) => {
                          const v = Number(val), total = Math.max(filtered.length, 1);
                          return (
                            <div key={String(label)} className="flex items-center gap-3">
                              <div className="text-xs text-zinc-400 w-24 shrink-0">{label}</div>
                              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{width:`${(v/total)*100}%`, background: String(color)}} />
                              </div>
                              <div className="text-xs font-mono text-zinc-400 w-8 text-right">{v}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Recent events */}
                    <div className="border border-white/10 bg-white/[0.02] rounded-sm overflow-hidden">
                      <div className="px-5 py-3 border-b border-white/5 text-xs uppercase tracking-widest text-zinc-500">Останні події ({Math.min(filtered.length, 20)})</div>
                      <div className="divide-y divide-white/5">
                        {filtered.slice(0,20).map((e: any) => (
                          <div key={e.id} className="px-5 py-2.5 flex items-center gap-4 text-xs">
                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${e.event_type === 'page_view' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : e.event_type === 'lead_submit' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>{e.event_type?.replace('_',' ')}</span>
                            <span className="text-zinc-500 flex-1 truncate">{e.path || '/'}</span>
                            <span className="text-zinc-600 shrink-0">{e.source || '—'}</span>
                            <span className="text-zinc-700 shrink-0">{new Date(e.created_at).toLocaleTimeString('uk-UA', {hour:'2-digit',minute:'2-digit'})}</span>
                          </div>
                        ))}
                        {filtered.length === 0 && <div className="px-5 py-8 text-center text-zinc-600 text-xs">Подій ще немає. Відвідайте сайт для генерації перших даних.</div>}
                      </div>
                    </div>
                  </div>
                );
              })()}

               {/* SETTINGS TAB */}
               {!loading && tab === "settings" && (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-2xl font-heading text-white">Налаштування <span className="text-[#D4AF37]">сайту</span></h2>
                  
                  <SectionCard title="Логотип та Загальне">
                    <AdminInput label="Текст логотипу" value={siteSettings.logo_text || ''} onChange={(v) => updateSiteSettings({logo_text: v})} onFocus={() => handleFocus('hero')} onBlur={handleBlur} />
                    <AdminInput label="Підзапис логотипу" value={siteSettings.logo_subtitle || ''} onChange={(v) => updateSiteSettings({logo_subtitle: v})} onFocus={() => handleFocus('hero')} onBlur={handleBlur} />
                  </SectionCard>

                  <SectionCard title="Контакти">
                    <AdminInput label="Телефон" value={siteSettings.phone || ''} onChange={(v) => updateSiteSettings({phone: v})} onFocus={() => handleFocus('hero')} onBlur={handleBlur} />
                    <AdminInput label="Email" value={siteSettings.email || ''} onChange={(v) => updateSiteSettings({email: v})} />
                    <AdminInput label="Telegram (посилання)" value={siteSettings.telegram || ''} onChange={(v) => updateSiteSettings({telegram: v})} />
                    <AdminInput label="Instagram (посилання)" value={siteSettings.instagram || ''} onChange={(v) => updateSiteSettings({instagram: v})} />
                  </SectionCard>
                </div>
              )}



            </div>
          </div>

          {/* DRAG HANDLE */}
          <div
            onMouseDown={onDragStart}
            className="hidden xl:flex w-2 h-full cursor-col-resize flex-col items-center justify-center gap-1 bg-transparent hover:bg-[#D4AF37]/10 transition-colors group z-50 select-none shrink-0"
          >
            <div className="w-0.5 h-12 bg-white/10 group-hover:bg-[#D4AF37]/60 rounded-full transition-colors" />
          </div>

          {/* REAL PREVIEW (RIGHT SIDE) */}
          <div className="hidden xl:block h-full bg-[#030303] relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex-1 overflow-hidden">
             {/* Device frame header just for beauty */}
             <div className="absolute top-0 w-full h-8 bg-black z-[60] flex items-center justify-center gap-2 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 ml-4">Live Preview</span>
             </div>
             
             <iframe
                ref={iframeRef}
                src="/admin/preview"
                className="w-full h-full pt-8 bg-[var(--color-dark-bg)]"
                style={{ border: 'none' }}
                title="Admin Preview"
             />
             
             {/* Pointer events overlay while dragging etc could go here */}
          </div>

        </div>
      </div>
    </div>
  );
}
