"use client";

import { useState, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { addFoto, updateAlt, toggleAtivo, deleteFoto } from "./actions";

type Foto = { id: string; src: string; alt: string; ativo: boolean; ordem: number };

export default function GaleriaAdmin({ fotos: initialFotos }: { fotos: Foto[] }) {
  const [fotos, setFotos] = useState<Foto[]>(initialFotos);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingAlt, setPendingAlt] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError(null);

    const supabase = createClient();
    const uploaded: Foto[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("Sde-dance")
        .upload(`galeria/${path}`, file, { upsert: true });

      if (error) {
        setUploadError(error.message);
        continue;
      }

      const { data } = supabase.storage.from("Sde-dance").getPublicUrl(`galeria/${path}`);
      const url = data.publicUrl;

      const fd = new FormData();
      fd.append("src", url);
      fd.append("alt", "");
      await addFoto(fd);

      uploaded.push({ id: path, src: url, alt: "", ativo: true, ordem: 0 });
    }

    setFotos(prev => [...prev, ...uploaded]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleAltChange(id: string, val: string) {
    setPendingAlt(prev => ({ ...prev, [id]: val }));
  }

  function saveAlt(id: string) {
    const alt = pendingAlt[id] ?? fotos.find(f => f.id === id)?.alt ?? "";
    setFotos(prev => prev.map(f => f.id === id ? { ...f, alt } : f));
    const fd = new FormData();
    fd.append("alt", alt);
    startTransition(() => { updateAlt(id, fd); });
  }

  function handleToggle(id: string, ativo: boolean) {
    setFotos(prev => prev.map(f => f.id === id ? { ...f, ativo } : f));
    startTransition(() => { toggleAtivo(id, ativo); });
  }

  function handleDelete(id: string) {
    setFotos(prev => prev.filter(f => f.id !== id));
    startTransition(() => { deleteFoto(id); });
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Upload section */}
      <div className="p-5 border flex flex-col gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <div>
          <h2 className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Adicionar fotos
          </h2>
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>
            Você pode selecionar várias fotos de uma vez.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-3 text-sm border transition-colors disabled:opacity-40"
            style={{
              borderColor: "var(--color-spot)",
              color: "var(--color-spot)",
              fontFamily: "var(--font-mono)",
              backgroundColor: "rgba(231,182,92,0.06)",
            }}
          >
            {uploading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Enviando…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Escolher da galeria
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
          {uploadError && (
            <p className="text-xs px-3 py-2 border"
              style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", fontFamily: "var(--font-mono)" }}>
              Erro: {uploadError}
            </p>
          )}
        </div>
      </div>

      {/* Grid of photos */}
      {fotos.length === 0 ? (
        <div className="py-20 text-center border"
          style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
          <p className="text-sm mb-1" style={{ color: "var(--color-ash)" }}>Nenhuma foto ainda.</p>
          <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Use o botão acima para adicionar fotos da galeria do dispositivo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map(foto => (
            <div key={foto.id} className="flex flex-col gap-2">
              {/* Thumbnail */}
              <div className="relative aspect-square overflow-hidden border"
                style={{ borderColor: "var(--border-mid)", opacity: foto.ativo ? 1 : 0.45 }}>
                <img
                  src={foto.src}
                  alt={foto.alt || "Foto galeria"}
                  className="w-full h-full object-cover"
                />
                {!foto.ativo && (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(11,10,12,0.55)" }}>
                    <span className="text-[0.6rem] px-2 py-0.5 border"
                      style={{ color: "var(--color-ash)", borderColor: "var(--border-mid)", fontFamily: "var(--font-mono)" }}>
                      OCULTO
                    </span>
                  </div>
                )}
              </div>

              {/* Alt text input */}
              <input
                type="text"
                value={pendingAlt[foto.id] ?? foto.alt}
                onChange={e => handleAltChange(foto.id, e.target.value)}
                onBlur={() => saveAlt(foto.id)}
                placeholder="Descrição (alt text)"
                className="w-full px-2 py-1.5 text-xs border bg-transparent outline-none"
                style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", fontFamily: "var(--font-mono)" }}
              />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(foto.id, !foto.ativo)}
                  className="flex-1 py-1.5 text-[0.6rem] border transition-colors"
                  style={{
                    borderColor: foto.ativo ? "rgba(74,222,128,0.3)" : "var(--border-subtle)",
                    color: foto.ativo ? "#4ade80" : "var(--color-ash)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {foto.ativo ? "Visível" : "Oculto"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(foto.id)}
                  className="py-1.5 px-2.5 border transition-colors"
                  style={{ borderColor: "rgba(239,68,68,0.25)", color: "#ef4444", fontFamily: "var(--font-mono)" }}
                  title="Remover foto"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
        As fotos marcadas como "Visível" aparecem na seção Galeria do site público.
        Edite o texto alt clicando no campo abaixo de cada foto.
      </p>
    </div>
  );
}
