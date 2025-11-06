'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getFirebaseFirestore } from '@/lib/firebase';
import { useCampaign } from '@/lib/hooks/useCampaign';
import { useDonations } from '@/lib/hooks/useDonations';
import { useTickets } from '@/lib/hooks/useTickets';
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';

const contestationSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.'),
  contato: z
    .string()
    .trim()
    .min(6, 'Compartilhe um contato para retorno (WhatsApp ou e-mail).'),
  codigoRifa: z
    .string()
    .trim()
    .min(3, 'Informe o código da rifa/bilhete.'),
  descricao: z
    .string()
    .trim()
    .min(10, 'Descreva o que está diferente ou incorreto.'),
});

type ContestationFormValues = z.infer<typeof contestationSchema>;

const anonymizeName = (fullName: string) => {
  const parts = fullName.split(' ').filter(Boolean);
  if (!parts.length) return fullName;
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
};

const formatDateTime = (date: Date) =>
  format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });

function TransparencyPage() {
  const db = typeof window !== 'undefined' ? getFirebaseFirestore() : null;
  const { campaign, loading: campaignLoading, error: campaignError } = useCampaign();
  const {
    donations,
    loading: donationsLoading,
    error: donationsError,
    total: totalDonations,
  } = useDonations(campaign?.id);
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets(campaign?.id);
  const { logs, loading: auditLoading, error: auditError } = useAuditLogs(campaign?.id);

  const [donationSearch, setDonationSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('todas');
  const [ticketSearch, setTicketSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<ContestationFormValues>({
    resolver: zodResolver(contestationSchema),
    defaultValues: { nome: '', contato: '', codigoRifa: '', descricao: '' },
  });

  const donationClasses = useMemo(() => {
    const classes = new Set<string>();
    donations.forEach((donation) => {
      if (donation.turmaNome) {
        classes.add(donation.turmaNome);
      }
    });
    return Array.from(classes).sort((a, b) => a.localeCompare(b));
  }, [donations]);

  const sanitizedDonations = useMemo(
    () =>
      donations.map((donation) => ({
        ...donation,
        anonymizedName: anonymizeName(donation.alunoNome),
      })),
    [donations]
  );

  const filteredDonations = useMemo(() => {
    const term = donationSearch.trim().toLowerCase();
    return sanitizedDonations.filter((donation) => {
      const matchesTerm = term
        ? [donation.alunoNome, donation.anonymizedName, donation.turmaNome, donation.rifasGeradas.join(' ')]
            .join(' ')
            .toLowerCase()
            .includes(term)
        : true;
      const matchesClass = selectedClass === 'todas' || donation.turmaNome === selectedClass;
      return matchesTerm && matchesClass;
    });
  }, [donationSearch, sanitizedDonations, selectedClass]);

  const donationsByClass = useMemo(() => {
    const totals = new Map<string, number>();
    donations.forEach((donation) => {
      totals.set(donation.turmaNome, (totals.get(donation.turmaNome) ?? 0) + donation.pesoKg);
    });
    return Array.from(totals.entries())
      .map(([turma, peso]) => ({ turma, peso }))
      .sort((a, b) => b.peso - a.peso);
  }, [donations]);

  const filteredTickets = useMemo(() => {
    const term = ticketSearch.trim().toLowerCase();
    if (!term) {
      return tickets.slice(0, 20);
    }
    return tickets
      .filter((ticket) =>
        [ticket.codigo, ticket.alunoNome, ticket.turmaNome]
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
      .slice(0, 20);
  }, [ticketSearch, tickets]);

  const anonymizedTickets = useMemo(
    () =>
      filteredTickets.map((ticket) => ({
        ...ticket,
        anonymizedName: anonymizeName(ticket.alunoNome),
      })),
    [filteredTickets]
  );

  const displayedLogs = useMemo(() => logs.slice(0, 10), [logs]);

  const metaKg = campaign?.metaKg ?? null;
  const totalKg = campaign?.counters.totalKg ?? 0;
  const totalRifas = campaign?.counters.totalRifas ?? 0;
  const totalTurmas = campaign?.counters.totalTurmas ?? 0;
  const progressPercent = metaKg ? Math.min(100, Math.round((totalKg / metaKg) * 100)) : null;

  const onSubmit = form.handleSubmit(async (values) => {
    setFeedback(null);
    try {
      if (!db) {
        throw new Error('Serviços do Firebase indisponíveis.');
      }
      await addDoc(collection(db, 'contestacoes'), {
        ...values,
        campanhaId: campaign?.id ?? null,
        status: 'novo',
        createdAt: serverTimestamp(),
      });
      form.reset();
      setFeedback({ type: 'success', message: 'Contestação enviada! Entraremos em contato em breve.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Não foi possível enviar sua contestação. Tente novamente mais tarde.' });
    }
  });

  return (
    <div className="py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Portal de transparência</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Acompanhe a campanha de doações em tempo real
          </h1>
          <p className="max-w-3xl text-base text-slate-600">
            Consulte os números atualizados da rifa solidária, confirme se sua contribuição foi registrada corretamente e
            envie uma contestação caso encontre alguma divergência. Esta página é pública e não exige login.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Doações registradas</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalDonations}</p>
            <p className="mt-1 text-xs text-slate-500">Entradas confirmadas na campanha atual.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Peso arrecadado</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalKg.toLocaleString('pt-BR')} kg</p>
            <p className="mt-1 text-xs text-slate-500">Somatório de itens convertidos em quilogramas.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Rifas emitidas</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalRifas.toLocaleString('pt-BR')}</p>
            <p className="mt-1 text-xs text-slate-500">Códigos distribuídos aos doadores.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-500">Turmas engajadas</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalTurmas}</p>
            <p className="mt-1 text-xs text-slate-500">Turmas com registro de participação.</p>
          </div>
        </section>

        {metaKg ? (
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Meta de arrecadação</h2>
                <p className="text-sm text-slate-600">
                  Estamos acompanhando a evolução rumo à meta de {metaKg.toLocaleString('pt-BR')} kg arrecadados.
                </p>
              </div>
              <p className="text-sm font-semibold text-indigo-600">
                {progressPercent}% da meta alcançada
              </p>
            </div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </section>
        ) : null}

        {donationsByClass.length ? (
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">Arrecadação por turma</h2>
              <p className="text-sm text-slate-600">
                Visualize quais turmas estão impulsionando a campanha nesta edição.
              </p>
            </div>
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationsByClass}>
                  <XAxis dataKey="turma" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value} kg`} width={60} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                    formatter={(value: number) => [`${value.toLocaleString('pt-BR')} kg`, 'Peso arrecadado']}
                  />
                  <Bar dataKey="peso" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Conferência de doações</h2>
              <p className="text-sm text-slate-600">
                Utilize a busca para localizar sua turma ou aluno e conferir se a doação foi registrada corretamente.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 lg:max-w-md">
                <span className="sr-only">Buscar por nome ou código</span>
                <input
                  type="search"
                  value={donationSearch}
                  onChange={(event) => setDonationSearch(event.target.value)}
                  placeholder="Busque por nome, turma ou código"
                  className="flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </label>
              <div className="flex items-center gap-2">
                <label htmlFor="turma" className="text-sm font-medium text-slate-600">
                  Filtrar por turma
                </label>
                <select
                  id="turma"
                  value={selectedClass}
                  onChange={(event) => setSelectedClass(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="todas">Todas</option>
                  {donationClasses.map((turma) => (
                    <option key={turma} value={turma}>
                      {turma}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Turma
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Nome
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Rifas
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Peso (kg)
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredDonations.map((donation) => (
                    <tr key={`${donation.id}-${donation.data.toISOString()}`} className="transition hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">{donation.turmaNome}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{donation.anonymizedName}</td>
                      <td className="px-4 py-3 text-slate-600">{donation.rifasGeradas.length}</td>
                      <td className="px-4 py-3 text-slate-600">{donation.pesoKg.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(donation.data)}</td>
                    </tr>
                  ))}
                  {!filteredDonations.length && !(donationsLoading || campaignLoading) ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        Nenhuma doação encontrada com os filtros atuais.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {donationsLoading ? <p className="mt-4 text-sm text-slate-500">Carregando doações...</p> : null}
            {donationsError ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{donationsError}</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Consulta de rifas</h2>
              <p className="text-sm text-slate-600">
                Digite o código do bilhete para confirmar se ele já foi emitido e vinculado a uma turma.
              </p>
            </div>
            <label className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 lg:max-w-md">
              <span className="sr-only">Buscar código da rifa</span>
              <input
                type="search"
                value={ticketSearch}
                onChange={(event) => setTicketSearch(event.target.value)}
                placeholder="Digite o código do bilhete"
                className="flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>
          </div>

          <div className="px-6 pb-6 pt-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Código
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Nome
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Turma
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {anonymizedTickets.map((ticket) => (
                    <tr key={ticket.id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{ticket.codigo}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{ticket.anonymizedName}</td>
                      <td className="px-4 py-3 text-slate-600">{ticket.turmaNome}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(ticket.data)}</td>
                    </tr>
                  ))}
                  {!anonymizedTickets.length && !(ticketsLoading || campaignLoading) ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                        Nenhum bilhete encontrado com o código informado.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {ticketsLoading ? <p className="mt-4 text-sm text-slate-500">Carregando rifas...</p> : null}
            {ticketsError ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{ticketsError}</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">Histórico resumido</h2>
            <p className="text-sm text-slate-600">
              Eventos relevantes registrados pela equipe organizadora, com horários e descrições simplificadas.
            </p>
          </div>
          <div className="px-6 pb-6 pt-4">
            <ol className="space-y-4">
              {displayedLogs.map((log) => (
                <li key={log.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {formatDateTime(log.timestamp)}
                    </span>
                    <span className="text-sm font-medium text-slate-900">{log.what}</span>
                    <span className="text-xs text-slate-500">
                      Registro relacionado à entidade: {log.entity}
                    </span>
                  </div>
                </li>
              ))}
              {!displayedLogs.length && !(auditLoading || campaignLoading) ? (
                <li className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                  Nenhum evento registrado até o momento.
                </li>
              ) : null}
            </ol>
            {auditLoading ? <p className="mt-4 text-sm text-slate-500">Carregando histórico...</p> : null}
            {auditError ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{auditError}</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">Como conferir seu código</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                1. Localize o código impresso no comprovante entregue pela escola ou informado pela pessoa responsável pela
                campanha.
              </p>
              <p>2. Utilize o campo de busca acima para confirmar se o código aparece na lista.</p>
              <p>3. Caso não encontre ou perceba alguma informação divergente, preencha o formulário abaixo.</p>
              <p>
                Prazo para contestação: até 7 dias após a divulgação dos resultados. Em caso de dúvidas, entre em contato
                com a coordenação pelo canal oficial informado pela escola.
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 pt-4">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-slate-700">
                  Nome completo
                  <input
                    type="text"
                    {...form.register('nome')}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Digite seu nome"
                  />
                  {form.formState.errors.nome ? (
                    <span className="text-xs text-red-600">{form.formState.errors.nome.message}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1 text-sm text-slate-700">
                  Contato (WhatsApp ou e-mail)
                  <input
                    type="text"
                    {...form.register('contato')}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="(00) 00000-0000 ou email@exemplo.com"
                  />
                  {form.formState.errors.contato ? (
                    <span className="text-xs text-red-600">{form.formState.errors.contato.message}</span>
                  ) : null}
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Código da rifa/bilhete
                <input
                  type="text"
                  {...form.register('codigoRifa')}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex.: A123"
                />
                {form.formState.errors.codigoRifa ? (
                  <span className="text-xs text-red-600">{form.formState.errors.codigoRifa.message}</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Descreva o que aconteceu
                <textarea
                  {...form.register('descricao')}
                  rows={4}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Conte detalhadamente qual informação está incorreta ou ausente"
                />
                {form.formState.errors.descricao ? (
                  <span className="text-xs text-red-600">{form.formState.errors.descricao.message}</span>
                ) : null}
              </label>

              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {form.formState.isSubmitting ? 'Enviando...' : 'Enviar contestação'}
              </button>

              {feedback ? (
                <p
                  className={`text-sm ${
                    feedback.type === 'success'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {feedback.message}
                </p>
              ) : null}
            </form>
          </div>
        </section>

        {(campaignLoading || donationsLoading || ticketsLoading || auditLoading) && !campaign ? (
          <p className="text-sm text-slate-500">Carregando informações públicas da campanha...</p>
        ) : null}
        {campaignError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{campaignError}</p>
        ) : null}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(TransparencyPage), { ssr: false });
