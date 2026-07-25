import ProfessorForm from "../_ProfessorForm";
import { upsertProfessor } from "../actions";

export default function NovoProfessorPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
        Novo professor
      </h1>
      <ProfessorForm action={upsertProfessor.bind(null, null)} />
    </div>
  );
}
