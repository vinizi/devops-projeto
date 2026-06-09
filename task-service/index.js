const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const LOG_SERVICE_URL = process.env.LOG_SERVICE_URL || 'http://localhost:3002';

let tarefas = [];
let proximoId = 1;

async function registrarLog(level, message) {
  try {
    await axios.post(`${LOG_SERVICE_URL}/logs`, {
      level,
      message,
      service: 'task-service'
    });
  } catch (err) {
    console.error('Erro ao enviar log:', err.message);
  }
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'task-service',
    totalTarefas: tarefas.length,
    uptime: process.uptime()
  });
});

app.get('/tasks', async (req, res) => {
  await registrarLog('INFO', `Listando ${tarefas.length} tarefa(s)`);
  res.json(tarefas);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    await registrarLog('WARN', 'Tentativa de criar tarefa sem titulo');
    return res.status(400).json({ error: 'O titulo da tarefa e obrigatorio' });
  }

  const tarefa = {
    id: proximoId++,
    title: title.trim(),
    done: false,
    criadaEm: new Date().toISOString()
  };

  tarefas.push(tarefa);
  await registrarLog('INFO', `Tarefa criada: "${tarefa.title}" (id: ${tarefa.id})`);
  res.status(201).json(tarefa);
});

app.patch('/tasks/:id/done', async (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    await registrarLog('WARN', `Tarefa id ${id} nao encontrada`);
    return res.status(404).json({ error: 'Tarefa nao encontrada' });
  }

  tarefa.done = !tarefa.done;
  const status = tarefa.done ? 'concluida' : 'pendente';
  await registrarLog('INFO', `Tarefa id ${id} marcada como ${status}`);
  res.json(tarefa);
});

app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);

  if (index === -1) {
    await registrarLog('ERROR', `Falha ao deletar: tarefa id ${id} nao existe`);
    return res.status(404).json({ error: 'Tarefa nao encontrada' });
  }

  const removida = tarefas.splice(index, 1)[0];
  await registrarLog('INFO', `Tarefa deletada: "${removida.title}" (id: ${removida.id})`);
  res.json({ message: 'Tarefa removida com sucesso' });
});

app.listen(PORT, () => {
  console.log(`task-service rodando na porta ${PORT}`);
  registrarLog('INFO', `task-service iniciado na porta ${PORT}`);
});
