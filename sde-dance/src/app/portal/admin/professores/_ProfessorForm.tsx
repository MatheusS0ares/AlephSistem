"use client";

import { useActionState } from "react";
import type { ProfData } from "@/lib/supabase/types";

type Props = {
  prof?: ProfData;
  action: (formData: FormData) => Promise<void>;
};

export default function ProfessorForm({ prof, action }: Props) {
  const [, formAction, pending] = useActionState(async (_: unknown, formData: FormData) => {
    await action(formData);
  }, null);

  const field = (name: keyof ProfData) => (prof ? String(prof[name] ?? "") : "");

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
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
      <Row label="Foto URL" hint="URL da imagem (Supabase Storage, Cloudinary, etc.)">
        <Input name="foto_url" type="url" defaultValue={field("foto_url")} />
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
