"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, Image as ImageIcon } from "lucide-react";
import { AdminInput, FileUpload, SectionCard } from "./AdminInput";

export function ProjectsAdmin({ showToast }: { showToast: (msg: string, type?: 'success'|'error') => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [editProject, setEditProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) showToast("Помилка завантаження проектів: " + error.message, "error");
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        title: editProject.title || "Новий проект",
        slug: editProject.slug || editProject.title.toLowerCase().replace(/[^a-z0-9\u0400-\u04FF-]/g, '-'),
        category: editProject.category || "Кухні",
        description: editProject.description || "",
        price_range: editProject.price_range || "",
        image_urls: editProject.image_urls || [],
        specifications: editProject.specifications || {},
        meta_title: editProject.meta_title || "",
        meta_description: editProject.meta_description || "",
        is_published: editProject.is_published ?? true,
      };

      if (editProject.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editProject.id);
        if (error) throw error;
        showToast("Проект оновлено!");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        showToast("Проект створено!");
      }
      setEditProject(null);
      loadProjects();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}.${ext}`;
    
    try {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'site-media';
      const { error } = await supabase.storage.from(bucket).upload(`projects/${fileName}`, file);
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(`projects/${fileName}`);
      if (data) {
        callback(data.publicUrl);
        showToast("Фото завантажено!");
      }
    } catch (err: any) {
      showToast("Помилка завантаження: " + err.message, "error");
    }
  };

  const updateSpec = (k: string, v: string) => {
    setEditProject({ ...editProject, specifications: { ...(editProject.specifications || {}), [k]: v } });
  };

  if (loading) return <div className="text-[#D4AF37] animate-pulse">Завантаження...</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading text-white">Портфоліо робіт</h2>
        <button onClick={() => setEditProject({ title: '', category: 'Кухні', image_urls: [], specifications: {} })} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm hover:bg-[#F0C453] transition-colors"><Plus className="w-4 h-4" /> Додати проєкт</button>
      </div>

      {editProject ? (
        <div className="border border-[#D4AF37]/50 rounded-sm p-6 bg-[#D4AF37]/5 space-y-6">
          <h3 className="text-lg font-heading text-[#D4AF37]">{editProject.id ? 'Редагувати проєкт' : 'Новий проєкт'}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Назва проєкту" value={editProject.title} onChange={(v) => setEditProject({...editProject, title: v})} />
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Категорія</label>
              <select 
                value={editProject.category} 
                onChange={(e) => setEditProject({...editProject, category: e.target.value, specifications: {}})} 
                className="w-full h-11 bg-white/5 border border-white/10 px-4 text-sm text-white outline-none rounded-sm"
              >
                <option value="Кухні">Кухні</option>
                <option value="Шафи">Шафи</option>
                <option value="Комоди">Комоди та тумби</option>
                <option value="Реставрація">Реставрація</option>
                <option value="Трансформери">Трансформери</option>
                <option value="Дитячі">Дитячі кімнати</option>
                <option value="Фасади">Фасади</option>
                <option value="Інше">Інше</option>
              </select>
            </div>
          </div>
          
          <AdminInput label="Короткий опис" rows={3} value={editProject.description} onChange={(v) => setEditProject({...editProject, description: v})} />
          <AdminInput label="Орієнтовна вартість" value={editProject.price_range} onChange={(v) => setEditProject({...editProject, price_range: v})} placeholder="Наприклад: від 45 000 грн" />

          {/* DYNAMIC SPECS BASED ON CATEGORY */}
          <SectionCard title="Характеристики (Залежать від категорії)">
            <div className="grid grid-cols-2 gap-4">
              {editProject.category === "Кухні" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold block">Фасади</label>
                    <select value={editProject.specifications?.facadeType || ''} onChange={(e) => updateSpec('facadeType', e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 px-4 text-sm text-white rounded-sm">
                      <option value="">Оберіть...</option>
                      <option value="МДФ плівка">МДФ плівка</option>
                      <option value="МДФ фарба">МДФ фарба</option>
                      <option value="Дерево">Натуральне дерево</option>
                      <option value="ЛДСП">ЛДСП</option>
                      <option value="Шпон">Шпон</option>
                      <option value="Скло в рамі">Скло в AL-рамі</option>
                    </select>
                  </div>
                  <AdminInput label="Стільниця" value={editProject.specifications?.countertop || ''} onChange={(v) => updateSpec('countertop', v)} placeholder="Кварц, HPL, Штучний камінь..." />
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold block">Клас Фурнітури</label>
                    <select value={editProject.specifications?.furnitureClass || ''} onChange={(e) => updateSpec('furnitureClass', e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 px-4 text-sm text-white rounded-sm">
                      <option value="">Оберіть...</option>
                      <option value="Бюджет (Muller)">Бюджет (напр. Muller)</option>
                      <option value="Середній (GTV)">Середній (напр. GTV)</option>
                      <option value="Преміум (Blum/Hettich)">Преміум (Blum, Hettich)</option>
                    </select>
                  </div>
                  <AdminInput label="Стиль (Modern, Loft, Classic)" value={editProject.specifications?.style || ''} onChange={(v) => updateSpec('style', v)} />
                </>
              )}
              {editProject.category === "Шафи" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold block">Тип системи</label>
                    <select value={editProject.specifications?.doorType || ''} onChange={(e) => updateSpec('doorType', e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 px-4 text-sm text-white rounded-sm">
                      <option value="">Оберіть...</option>
                      <option value="Розсувна (Купе)">Розсувна (Купе)</option>
                      <option value="Розпашна">Розпашна</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold block">Наповнення дверей</label>
                    <select value={editProject.specifications?.doorFilling || ''} onChange={(e) => updateSpec('doorFilling', e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 px-4 text-sm text-white rounded-sm">
                      <option value="">Оберіть...</option>
                      <option value="ЛДСП">ЛДСП</option>
                      <option value="Дзеркало">Дзеркало</option>
                      <option value="Піскоструй">Піскоструй</option>
                      <option value="Фарбований МДФ">Фарбований МДФ</option>
                      <option value="Комбіноване">Комбіноване</option>
                    </select>
                  </div>
                  <AdminInput label="Матеріал корпусу" value={editProject.specifications?.bodyMaterial || ''} onChange={(v) => updateSpec('bodyMaterial', v)} />
                </>
              )}
              {editProject.category === "Комоди" && (
                <>
                  <AdminInput type="number" label="Кількість шухляд" value={editProject.specifications?.drawersCount || '0'} onChange={(v) => updateSpec('drawersCount', v)} />
                  <AdminInput label="Направляючі" value={editProject.specifications?.guidesType || ''} onChange={(v) => updateSpec('guidesType', v)} placeholder="Телескопічні, прихованого монтажу..." />
                  <AdminInput type="number" label="Кількість розпашних фасадів" value={editProject.specifications?.swingFacadesCount || '0'} onChange={(v) => updateSpec('swingFacadesCount', v)} />
                </>
              )}
              {editProject.category === "Трансформери" && (
                <>
                  <AdminInput label="Механізм трансформації" rows={2} value={editProject.specifications?.mechanismType || ''} onChange={(v) => updateSpec('mechanismType', v)} />
                </>
              )}
            </div>
            
            {editProject.category === "Реставрація" && (
                <div className="bg-white/5 p-4 rounded-sm mt-4">
                  <p className="text-zinc-400 text-xs mb-3">Для реставрації додайте сюди фото (можна кілька). Перше буде "До", наступні "Після".</p>
                  <FileUpload label="Завантажити фото До/Після" onUpload={(e) => uploadImage(e, (url) => setEditProject({...editProject, before_after_images: [...(editProject.before_after_images||[]), url]}))} />
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {(editProject.before_after_images || []).map((img: string, i: number) => (
                      <div key={i} className="relative group">
                         <img src={img} className="w-20 h-20 object-cover rounded-sm border border-white/20" alt=""/>
                         <button onClick={() => setEditProject({...editProject, before_after_images: editProject.before_after_images.filter((_:any,idx:number)=>idx!==i)})} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-sm opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-white"/></button>
                      </div>
                    ))}
                  </div>
                </div>
            )}
          </SectionCard>

          <SectionCard title="Зображення">
            <div className="flex gap-4">
              <div className="flex-1"><AdminInput label="URL зображень (через кому)" value={(editProject.image_urls||[]).join(', ')} onChange={(v) => setEditProject({...editProject, image_urls: v.split(',').map((s:string) => s.trim())})} /></div>
              <div className="w-[150px] mt-6"><FileUpload label="Огляд..." onUpload={(e) => uploadImage(e, (url) => setEditProject({...editProject, image_urls: [...(editProject.image_urls||[]), url]}))} /></div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
               {(editProject.image_urls || []).map((img: string, i: number) => (
                 <div key={i} className="relative group">
                    <img src={img} className="w-20 h-20 object-cover rounded-sm border border-white/20" alt=""/>
                    <button onClick={() => setEditProject({...editProject, image_urls: editProject.image_urls.filter((_:any,idx:number)=>idx!==i)})} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-white"/></button>
                 </div>
               ))}
            </div>
          </SectionCard>

          <SectionCard title="SEO Налаштування">
             <AdminInput label="Meta Title" value={editProject.meta_title} onChange={(v) => setEditProject({...editProject, meta_title: v})} placeholder="SEO заголовок..." />
             <AdminInput label="Meta Description" rows={2} value={editProject.meta_description} onChange={(v) => setEditProject({...editProject, meta_description: v})} placeholder="SEO опис..." />
          </SectionCard>

          <div className="flex gap-3 pt-4 border-t border-white/10 items-center justify-between">
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-sm flex items-center gap-2"><Save className="w-4 h-4"/> Зберегти</button>
              <button onClick={() => setEditProject(null)} className="px-6 py-2 border border-white/20 text-xs text-white rounded-sm">Скасувати</button>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
               <input type="checkbox" checked={editProject.is_published ?? true} onChange={e => setEditProject({...editProject, is_published: e.target.checked})} className="accent-[#D4AF37]" />
               Опубліковано
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="p-4 border border-white/10 flex gap-4 bg-white/5 rounded-sm items-center hover:border-white/20 transition-colors">
              {p.image_urls?.[0] ? 
                 <img src={p.image_urls[0]} className="w-16 h-16 object-cover rounded-sm opacity-90 border border-white/10" alt=""/> :
                 <div className="w-16 h-16 bg-black/50 border border-white/5 rounded-sm flex items-center justify-center"><ImageIcon className="w-6 h-6 text-zinc-600"/></div>
              }
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                   <h4 className="text-white font-bold text-sm truncate">{p.title}</h4>
                   {!p.is_published && <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 rounded-sm uppercase">Приховано</span>}
                </div>
                <p className="text-xs text-zinc-500 truncate">{p.category} {p.price_range && `• ${p.price_range}`}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                 <button onClick={() => setEditProject(p)} className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-md transition-colors"><Edit3 className="w-4 h-4"/></button>
                 <button onClick={async () => { if(confirm("Видалити?")) { const { error } = await supabase.from('projects').delete().eq('id', p.id); if (error) showToast(error.message, 'error'); else { loadProjects(); showToast('Видалено'); } } }} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
