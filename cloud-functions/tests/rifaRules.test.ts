import assert from 'assert';
import { describe, it } from 'node:test';
import { gerarCodigoRifa, pesoParaRifas } from '../src/utils/rifaRules';

describe('Regras da Rifa', () => {
  it('converte peso em rifas respeitando o piso de 1 kg', () => {
    assert.strictEqual(pesoParaRifas(1), 1);
    assert.strictEqual(pesoParaRifas(1.9), 1);
  });

  it('bloqueia peso menor que 1 kg', () => {
    assert.throws(() => pesoParaRifas(0.9), /Peso mínimo/);
  });

  it('gera códigos sequenciais com prefixo esperado', () => {
    const ano = 2024;
    assert.strictEqual(gerarCodigoRifa(ano, 1), 'RF-2024-000001');
    assert.strictEqual(gerarCodigoRifa(ano, 25), 'RF-2024-000025');
  });

  it('garante ausência de colisão em sequência curta', () => {
    const ano = 2024;
    const codigos = Array.from({ length: 50 }, (_, index) => gerarCodigoRifa(ano, index + 1));
    assert.strictEqual(new Set(codigos).size, codigos.length);
  });
});
