# Agendado

## Agendado - Sistema de Agendamento para Profissionais Autônomos
O Agendado é uma solução completa para profissionais autônomos (como cabeleireiros, manicures, etc.) gerenciarem seus agendamentos. O sistema consiste em um backend em Node.js e um aplicativo mobile em React Native.

-------------------------------------------------------------------
### 1. Clonar o repositório

Cria uma pasta no seu computador, abre ela no Vs Code e no terminal roda:

``````````````````bash
git clone https://github.com/Thalissa-Araujo/Agendado.git
`````````````````````````````````

````````````````````bash
cd Agendado
````````````````````````````````````````````

### 2. Criar branches separadas para trabalhar

Vamos dividir as tarefas em branches diferentes.

Exemplo:

- Vou criar uma branch pra mim:
    ````````````````````````bash
    git checkout -b feat/backend-ajustes
    ``````````````````````````````````````````

- Você cria uma branch pra você (pode ser outro nome):
  ````````````````````bash
  git checkout -b feat/frontend-ajustes
  ``````````````````````````````````````````

Regra de ouro: **Nunca trabalhar diretamente na branch main ou master.**

### 3. Trabalhar normalmente nos seus arquivos

#### Pré-requisitos
- Node.js (v16 ou superior)
- npm (v8 ou superior)
- Expo CLI (instalado globalmente via `npm install -g expo-cli`)
- SQLite (já vem com Node.js)
- Java JDK (para Android Studio/emulador, se necessário)
- Dispositivo móvel com Expo Go ou emulador

**O Android Studio/emulardor não é obrigatório, eu acho o app do Expo Go no celular mais fácil de usar, mas fica a seu critério.**

### Para rodar o backend:

Renomeie o arquivo .env.example para .env

Após isso:

`````````````````````````````bash
cd backend
```````````````````````````````````````

#### Instalar dependências

`````````````````````````````bash
npm install
```````````````````````````````````````

#### Iniciar o Backend

`````````````````````````````bash
node app.js
```````````````````````````````````````

---------------------------------------

### Configurar o Frontend

```bash
cd frontend/Agendado
`````````````````````````````````

#### Instalar dependências

```bash
npm install
`````````````````````````````````

#### Iniciar o frontend

```````````````bash
npx expo start
``````````````````````````````

Após iniciar o frontend com `npx expo start`:
1. Escaneie o QR code com o app **Expo Go** (disponível na Play Store)
2. Ou execute em um emulador:
   - Android: pressione `a` no terminal
3. Abrir o link localhost na web

### Banco de Dados
- O banco de dados SQLite será criado automaticamente na pasta `backend` (verifica se está lá)

### WhatsApp Integration (Opcional)
Para ativar a integração com WhatsApp:
1. Inicie o backend
2. Escaneie o QR code que aparecerá no terminal com o WhatsApp que deseja usar como bot

## Estrutura de Diretórios
```
agendado/                  # Pasta raiz
├── backend/               # Servidor Node.js
│   ├── config/            # Configurações
│   ├── controllers/       # Controladores da API
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Rotas da API
│   ├── services/          # Serviços externos
│   ├── .env               # Variáveis de ambiente
│   ├── app.js             # Ponto de entrada
│   └── package.json
└── frontend/              # Aplicativo React Native
    └── Agendado/          # Projeto Expo
        ├── assets/        # Recursos estáticos
        ├── components/    # Componentes reutilizáveis
        ├── screens/       # Telas do aplicativo
        ├── services/      # Serviços de frontend
        ├── App.js         # Ponto de entrada
        └── package.json
```

## Solução de Problemas Comuns
### Erro "Failed to download remote update"
- Verifique se o backend está rodando
- Celular e computador devem estar na mesma rede
### Erros de dependência
- Execute `npx expo install --fix` no frontend
- Delete `node_modules` e `package-lock.json` e reinstale (npm install)
### Problemas com o WhatsApp
- Reinicie o servidor e escaneie o QR code novamente

## Contribuição

Após fazer suas mudanças rode no terminal na pasta raiz do projeto (pasta Agendado):

````````````bash
git add .
````````````````````````

Commite normalmente:

```````````bash
git commit -m "descrição clara da alteração"
```````````````````````````

Enviar as alterações para o GitHub:

````````````````bash
git push origin nome-da-sua-branch
``````````````````````````

Criar Pull Requests (PRs):

Quando terminar sua parte:

- Vá até o GitHub.

- Clique em Compare & pull request na sua branch.

- Escolha a base main e crie o PR.

- Isso permite que a gente revise o código antes de juntar tudo.

Atualizar sua branch com o que a outra fez

Se a uma de nós já deu merge no nosso PR e quiser pegar pegar as atualizações da outra (que deu o merge):

````````````bash
# Voltar para a main e pegar as mudanças
git checkout main
```````````````````````````````

````````````````bash
git pull origin main
````````````````````````

`````````````bash
# Voltar para sua branch e mesclar as mudanças da main
git checkout nome-da-sua-branch
```````````````````````````

``````````bash
git merge main
```````````````````````

### Boas práticas

- Sempre puxar a main atualizada antes de começar algo novo.

- Commits frequentes e com mensagens claras.

- Combinar: "vou mexer nessa parte hoje", para evitar colisões.

- Use `git status` e `git log` com frequência para se situar.