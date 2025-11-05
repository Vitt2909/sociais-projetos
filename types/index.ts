export type Campanha = {
  id: string;
  nome: string;
  dataSorteio: Date;
  premioPrincipal: string;
  premios: { aluno1: string; aluno2: string; aluno3: string; turma1?: string };
  metaKg?: number;
  status: 'ativa' | 'encerrada';
  counters: { totalKg: number; totalRifas: number; totalAlunos: number; totalTurmas: number };
  lastSerial: number;
  vencedor?: { codigo: string; alunoId: string; alunoNome: string; turmaNome: string; data: Date };
};

export type Aluno = { id: string; nome: string; turmaId: string; turmaNome: string };
export type Doacao = {
  id: string;
  campanhaId: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  turmaNome: string;
  pesoKg: number;
  rifasGeradas: string[];
  data: Date;
  registradoPor: { userId: string; nome: string };
};
export type Rifa = {
  id: string;
  codigo: string;
  campanhaId: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  turmaNome: string;
  data: Date;
};

export type Usuario = {
  id: string;
  nome: string;
  role: 'admin' | 'monitor' | 'prof';
};

export type AuditoriaLog = {
  id: string;
  who: { userId: string; nome: string };
  what: string;
  entity: string;
  before?: unknown;
  after?: unknown;
  timestamp: Date;
};
