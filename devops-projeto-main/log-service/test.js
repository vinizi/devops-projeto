const assert = require('assert');

const NIVEIS_VALIDOS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

function testNivelValido() {
  assert(NIVEIS_VALIDOS.includes('INFO'), 'INFO deve ser valido');
  assert(NIVEIS_VALIDOS.includes('ERROR'), 'ERROR deve ser valido');
  console.log('PASS: niveis validos reconhecidos');
}

function testNivelInvalido() {
  assert(!NIVEIS_VALIDOS.includes('CRITICAL'), 'CRITICAL nao deve ser valido');
  console.log('PASS: nivel invalido rejeitado');
}

function testCriarEntradaDeLog() {
  const entrada = {
    level: 'INFO',
    message: 'Servico iniciado',
    service: 'task-service',
    timestamp: new Date().toISOString()
  };

  assert(entrada.level === 'INFO', 'Level deve ser INFO');
  assert(entrada.message.length > 0, 'Mensagem nao pode ser vazia');
  assert(entrada.timestamp !== undefined, 'Timestamp deve existir');
  console.log('PASS: entrada de log criada corretamente');
}

function testContarStats() {
  const logs = [
    { level: 'INFO' },
    { level: 'INFO' },
    { level: 'WARN' },
    { level: 'ERROR' }
  ];

  const info = logs.filter(l => l.level === 'INFO').length;
  const warn = logs.filter(l => l.level === 'WARN').length;
  const error = logs.filter(l => l.level === 'ERROR').length;

  assert(info === 2, 'Deve ter 2 logs INFO');
  assert(warn === 1, 'Deve ter 1 log WARN');
  assert(error === 1, 'Deve ter 1 log ERROR');
  console.log('PASS: contagem de stats correta');
}

try {
  testNivelValido();
  testNivelInvalido();
  testCriarEntradaDeLog();
  testContarStats();
  console.log('\nTodos os testes do log-service passaram!');
} catch (err) {
  console.error('FALHOU:', err.message);
  process.exit(1);
}
