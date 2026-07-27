"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProfData } from "@/lib/supabase/types";

type Props = {
  prof?: ProfData;
  action: (formData: FormData) => Promise<{ error: string } | null>;
};

export default function ProfessorForm({ prof, action }: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setErrorMsg(null);
    try {
      const result = await action(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setPending(false);
      } else {
        router.push("/portal/admin/professores");
      }
    } catch {
      setErrorMsg("Erro inesperado. Tente novamente.");
      setPending(false);
    }
  }

  const field = (name: keyof ProfData) => (prof ? String(prof[name] ?? "") : "");

  return (
    <form action={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      <Row label="Nome *">
        <Input name="nome" defaultValue={field("nome")} required />
      </Row>
      <Row label="Papel / Função *" hint='Ex: Diretora Artística · Ballet'>
        <Input name="papel" defaultValue={field("papel")} required />
      </Row>
      <Row label="Modalidades" hint="Separe por vírgula: Ballet, Jazz, Contemporâneo">
        <Input name="modalidades" defaultValue={prof?.modalidades?.join(", ") ?? ""} />
      </Row>
      <Row label="Bio">
        <textarea name="bio" defaultValue={field("bio")} rows={4}
          className="w-full px-4 py-3 text-sm bg-transparent border outline-none resize-none transition-colors duration-200"
          style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)" }}
          onFocus={e => (e.target.style.borderColor = "var(--color-spot)")}
          onBlur={e  => (e.target.style.borderColor = "var(--border-mid)")} />
      </Row>
      <Row label="Citação">
        <Input name="citacao" defaultValue={field("citacao")} />
      </Row>
      <Row label="Foto do Professor">
        <FotoUpload defaultUrl={field("foto_url")} />
      </Row>
      <Row label="Instagram" hint="Sem @">
        <Input name="instagram" defaultValue={field("instagram")} />
      </Row>
      <Row label="Ordem de exibição" hint="Número menor aparece primeiro">
        <Input name="ordem" type="number" defaultValue={field("ordem")} style={{ maxWidth: "120px" }} />
      </Row>
      <div className="flex items-center gap-8">
        <Check name="destaque" label="Destaque na página" defaultChecked={prof?.destaque ?? true} />
        <Check name="ativo"    label="Ativo (aparece no site)" defaultChecked={prof?.ativo ?? true} />
      </div>

      {errorMsg && (
        <p className="text-xs px-3 py-2 border"
          style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", fontFamily: "var(--font-mono)" }}>
          Erro: {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <button type="submit" disabled={pending}
          className="px-8 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
          {pending ? "Salvando…" : "Salvar"}
        </button>
        <a href="/portal/admin/professores" className="text-sm" style={{ color: "var(--color-ash)" }}>Cancelar</a>
      </div>
    </form>
  );
}

function FotoUpload({ defaultUrl }: { defaultUrl: string }) {
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
    const path = `professores/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("Sde-dance")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("Sde-dance").getPublicUrl(path);
    setPreview(data.publicUrl);
    if (hiddenRef.current) hiddenRef.current.value = data.publicUrl;
    setUploading(false);
  }

  function remove() {
    setPreview("");
    if (hiddenRef.current) hiddenRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Preview circular */}
      {preview && (
        <img
          src={preview}
          alt="Foto do professor"
          className="w-20 h-20 object-cover rounded-full border"
          style={{ borderColor: "var(--border-mid)" }}
        />
      )}

      {/* Hidden input — valor submetido pelo form */}
      <input ref={hiddenRef} type="hidden" name="foto_url" defaultValue={defaultUrl} />

      {/* Botões */}
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
              {preview ? "Trocar foto" : "Escolher da galeria"}
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

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {error && (
        <p className="text-xs px-3 py-2 border"
          style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", fontFamily: "var(--font-mono)" }}>
          Erro: {error}
        </p>
      )}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
        {label}
      </label>
      {hint && <p className="text-xs" style={{ color: "var(--color-ash)" }}>{hint}</p>}
      {children}
    </div>
  );
}

function Input({ name, type = "text", defaultValue, required, style }: {
  name: string; type?: string; defaultValue?: string; required?: boolean; style?: React.CSSProperties;
}) {
  return (
    <input name={name} type={type} defaultValue={defaultValue} required={required}
      className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200"
      style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", ...style }}
      onFocus={e => (e.target.style.borderColor = "var(--color-spot)")}
      onBlur={e  => (e.target.style.borderColor = "var(--border-mid)")} />
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--color-ash)" }}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked}
        className="accent-[var(--color-spot)] w-4 h-4" />
      {label}
    </label>
  );
}
