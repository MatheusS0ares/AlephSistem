export type TipoUsuario = "aluno" | "professor" | "admin";
export type StatusMatricula = "ativa" | "inativa" | "pendente";
export type TipoLancamento = "mensalidade" | "matricula_taxa";
export type StatusFinanceiro = "pendente" | "pago" | "atrasado";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          tipo: TipoUsuario;
          nome: string;
          whatsapp: string | null;
          foto_url: string | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      turmas: {
        Row: {
          id: string;
          nome: string;
          modalidade: string;
          dias_semana: string;
          hora: string;
          professor_id: string | null;
          vagas_total: number;
          ativo: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["turmas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["turmas"]["Insert"]>;
      };
      matriculas: {
        Row: {
          id: string;
          aluno_id: string;
          turma_id: string;
          status: StatusMatricula;
          data_inicio: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matriculas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["matriculas"]["Insert"]>;
      };
      financeiro: {
        Row: {
          id: string;
          aluno_id: string;
          matricula_id: string | null;
          tipo: TipoLancamento;
          valor: number;
          vencimento: string;
          pago_em: string | null;
          status: StatusFinanceiro;
          mes_referencia: string | null;
          observacao: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["financeiro"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["financeiro"]["Insert"]>;
      };
      links_matricula: {
        Row: {
          id: string;
          turma_id: string;
          criado_por: string;
          token: string;
          ativo: boolean;
          validade: string | null;
          usos: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["links_matricula"]["Row"], "id" | "created_at" | "usos">;
        Update: Partial<Database["public"]["Tables"]["links_matricula"]["Insert"]>;
      };
    };
  };
}
