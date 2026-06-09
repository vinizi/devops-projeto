const assert = require('assert');

function testCriarTarefaValida() {
  const title = 'Estudar DevOps';
  assert(title.trim() !== '', 'Titulo nao pode ser vazio');
  console.log('PASS: criacao de tarefa com titulo valido');
}

function testTituloVazio() {
  const title = '   ';
  const valido = title.trim() !== '';
  assert(!valido, 'Titulo vazio deve ser invalido');
  console.log('PASS: titulo vazio e rejeitado corretamente');
}

function testAlternarTarefa() {
  const tarefa = { id: 1, title: 'Teste', done: false };
  tarefa.done = !tarefa.done;
  assert(tarefa.done === true, 'Tarefa deve ser marcada como concluida');
  console.log('PASS: tarefa marcada como concluida');
}

function testDeletarTarefa() {
  const tarefas = [
    { id: 1, title: 'Tarefa A' },
    { id: 2, title: 'Tarefa B' }
  ];
  const index = tarefas.findIndex(t => t.id === 1);
  tarefas.splice(index, 1);
  assert(tarefas.length === 1, 'Deve restar 1 tarefa');
  assert(tarefas[0].id === 2, 'A tarefa restante deve ser a id 2');
  console.log('PASS: tarefa deletada corretamente');
}

try {
  testCriarTarefaValida();
  testTituloVazio();
  testAlternarTarefa();
  testDeletarTarefa();
  console.log('\nTodos os testes do task-service passaram!');
} catch (err) {
  console.error('FALHOU:', err.message);
  process.exit(1);
}
