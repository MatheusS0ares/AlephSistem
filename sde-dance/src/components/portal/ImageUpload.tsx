"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  bucket: string;
  fieldName: string;
  defaultUrl?: string;
  previewShape?: "square" | "circle";
};

export default function ImageUpload({ bucket, fieldName, defaultUrl = "", previewShape = "square" }: Props) {
  const [preview, setPreview] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setPreview(data.publicUrl);
    if (hiddenRef.current) hiddenRef.current.value = data.publicUrl;
    setUploading(false);
  }

  function remove() {
    setPreview("");
    if (hiddenRef.current) hiddenRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  }

  const previewCls = previewShape === "circle"
    ? "w-20 h-20 object-cover rounded-full border"
    : "w-32 h-24 object-cover border";

  return (
    <div className="flex flex-col gap-3">
      {preview && (
        <img
          src={preview}
          alt="Pré-visualização"
          className={previewCls}
          style={{ borderColor: "var(--border-mid)" }}
        />
      )}

      <input ref={hiddenRef} type="hidden" name={fieldName} defaultValue={defaultUrl} />

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 text-xs border transition-colors disabled:opacity-40"
          style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              {preview ? "Trocar imagem" : "Escolher da galeria"}
            </>
          )}
        </button>
        {preview && !uploading && (
          <button
            type="button"
            onClick={remove}
            className="text-xs"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
          >
            Remover
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {error && (
        <p className="text-xs px-3 py-2 border"
          style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", fontFamily: "var(--font-mono)" }}>
          Erro: {error}
        </p>
      )}
    </div>
  );
}
