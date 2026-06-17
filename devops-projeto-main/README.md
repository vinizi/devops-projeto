# devops-projeto

Projeto da disciplina de Desenvolvimento Web — 2º Bimestre.

Aplicação de lista de tarefas construída com arquitetura de microserviços,
monitoramento com logs e pipeline de CI/CD com GitHub Actions.

## Serviços

- **task-service** (porta 3001) — gerencia as tarefas
- **log-service** (porta 3002) — registra e consulta logs

## Como rodar

```bash
# Terminal 1
cd log-service && npm install && node index.js

# Terminal 2
cd task-service && npm install && node index.js

# Abrir frontend/index.html no navegador
```
