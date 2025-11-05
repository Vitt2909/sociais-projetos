export const pesoParaRifas = (peso: number): number => {
  if (Number.isNaN(peso)) {
    throw new Error('Peso inválido.');
  }
  const quantidade = Math.floor(peso);
  if (quantidade < 1) {
    throw new Error('Peso mínimo para gerar rifas é 1 kg.');
  }
  return quantidade;
};

export const gerarCodigoRifa = (ano: number, serial: number): string => {
  if (!Number.isFinite(ano) || !Number.isFinite(serial)) {
    throw new Error('Parâmetros inválidos para geração do código.');
  }
  return `RF-${ano}-${String(serial).padStart(6, '0')}`;
};
