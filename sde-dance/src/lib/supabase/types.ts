export type TipoUsuario      = "aluno" | "professor" | "admin";
export type StatusMatricula  = "ativa" | "inativa" | "pendente";
export type StatusFinanceiro = "pendente" | "pago" | "atrasado";
export type TipoLancamento   = "mensalidade" | "matricula_taxa";

export type ProfData = {
  id: string;
  nome: string;
  papel: string;
  modalidades: string[];
  bio: string | null;
  citacao: string | null;
  foto_url: string | null;
  instagram: string | null;
  ordem: number;
  destaque: boolean;
  ativo: boolean;
  created_at?: string;
};

export interface Database {
  sde_dance: {
    Tables: {
      profiles: {
        Row: {
          id:         string;
          nome:       string;
          tipo:       TipoUsuario;
          whatsapp:   string | null;
          foto_url:   string | null;
          ativo:      boolean;
          created_at: string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };

      professores: {
        Row:    ProfData;
        Insert: Omit<ProfData, "id" | "created_at">;
        Update: Partial<Omit<ProfData, "id" | "created_at">>;
        Relationships: [];
      };

      turmas: {
        Row: {
          id:           string;
          nome:         string;
          modalidade:   string;
          dias_semana:  string;
          hora:         string;
          professor_id: string | null;
          vagas_total:  number;
          ativo:        boolean;
          created_at:   string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["turmas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["turmas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "turmas_professor_id_fkey";
            columns: ["professor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      matriculas: {
        Row: {
          id:          string;
          aluno_id:    string;
          turma_id:    string;
          status:      StatusMatricula;
          data_inicio: string;
          created_at:  string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["matriculas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["matriculas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "matriculas_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matriculas_turma_id_fkey";
            columns: ["turma_id"];
            isOneToOne: false;
            referencedRelation: "turmas";
            referencedColumns: ["id"];
          }
        ];
      };

      financeiro: {
        Row: {
          id:             string;
          aluno_id:       string;
          matricula_id:   string | null;
          tipo:           TipoLancamento;
          valor:          number;
          vencimento:     string;
          pago_em:        string | null;
          status:         StatusFinanceiro;
          mes_referencia: string | null;
          observacao:     string | null;
          created_at:     string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["financeiro"]["Row"], "id" | "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["financeiro"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "financeiro_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      presencas: {
        Row: {
          id:         string;
          turma_id:   string;
          aluno_id:   string;
          data_aula:  string;
          presente:   boolean;
          created_at: string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["presencas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["presencas"]["Insert"]>;
        Relationships: [];
      };

      links_matricula: {
        Row: {
          id:          string;
          turma_id:    string;
          criado_por:  string;
          token:       string;
          ativo:       boolean;
          validade:    string | null;
          usos:        number;
          created_at:  string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["links_matricula"]["Row"], "id" | "created_at" | "usos">;
        Update: Partial<Database["sde_dance"]["Tables"]["links_matricula"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
