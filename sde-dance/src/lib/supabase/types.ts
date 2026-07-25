export type TipoUsuario      = "aluno" | "professor" | "admin";
export type StatusMatricula  = "ativa" | "cancelada" | "trancada";
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
          telefone:   string | null;
          foto_url:   string | null;
          ativo:      boolean;
          created_at: string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["profiles"]["Insert"]>;
      };

      professores: {
        Row:    ProfData;
        Insert: Omit<ProfData, "id" | "created_at">;
        Update: Partial<Omit<ProfData, "id" | "created_at">>;
      };

      turmas: {
        Row: {
          id:                string;
          nome:              string;
          modalidade:        string;
          dias_semana:       string[];
          horario_inicio:    string;
          horario_fim:       string;
          professor_id:      string | null;
          capacidade:        number;
          valor_mensalidade: number;
          ativa:             boolean;
          created_at:        string;
        };
        Insert: Omit<Database["sde_dance"]["Tables"]["turmas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["sde_dance"]["Tables"]["turmas"]["Insert"]>;
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
      };
    };
  };
}
