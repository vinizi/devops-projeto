const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3002;
const NIVEIS_VALIDOS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

let logs = [];

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'log-service',
    totalLogs: logs.length,
    uptime: process.uptime()
  });
});

app.post('/logs', (req, res) => {
  const { level, message, service } = req.body;

  if (!NIVEIS_VALIDOS.includes(level)) {
    return res.status(400).json({ error: 'Nivel de log invalido' });
  }

  const entrada = {
    id: logs.length + 1,
    level,
    message,
    service: service || 'desconhecido',
    timestamp: new Date().toISOString()
  };

  logs.push(entrada);
  console.log(`[${entrada.timestamp}] [${entrada.level}] [${entrada.service}] ${entrada.message}`);
  res.status(201).json(entrada);
});

app.get('/logs', (req, res) => {
  const { level, service } = req.query;
  let resultado = [...logs];

  if (level) resultado = resultado.filter(l => l.level === level.toUpperCase());
  if (service) resultado = resultado.filter(l => l.service === service);

  res.json(resultado.reverse());
});

app.get('/logs/stats', (req, res) => {
  res.json({
    total: logs.length,
    INFO: logs.filter(l => l.level === 'INFO').length,
    WARN: logs.filter(l => l.level === 'WARN').length,
    ERROR: logs.filter(l => l.level === 'ERROR').length,
    DEBUG: logs.filter(l => l.level === 'DEBUG').length
  });
});

app.delete('/logs', (req, res) => {
  logs = [];
  res.json({ message: 'Logs limpos com sucesso' });
});

app.listen(PORT, () => {
  console.log(`log-service rodando na porta ${PORT}`);
});
