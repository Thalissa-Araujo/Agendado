# Agendado

## Agendado - Sistema de Agendamento para Profissionais Autônomos
O Agendado é uma solução completa para profissionais autônomos (como cabeleireiros, manicures, etc.) gerenciarem seus agendamentos. O sistema consiste em um backend em Node.js e um aplicativo mobile em React Native.

-------------------------------------------------------------------

#### Pré-requisitos
- Node.js (v16 ou superior)
- npm (v8 ou superior)
- Expo CLI (instalado globalmente via `npm install -g expo-cli`)
- SQLite (já vem com Node.js)
- Java JDK (para Android Studio/emulador, se necessário)
- Dispositivo móvel com Expo Go ou emulador


### Para rodar o backend:

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

Abrir um terminal diferente de onde o backend está rodando

```bash
cd Agendado/frontend/Agendado
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
3. Ou Abrir o link localhost na web

### Banco de Dados
- O banco de dados SQLite será criado automaticamente (verifica se o arquivo database.sqlite existe)

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
- Celular e computador devem estar na mesma rede wifi
### Erros de dependência
- Execute `npx expo install --fix` no frontend
- Delete `node_modules` e `package-lock.json` e reinstale (npm install)
### Problemas com o WhatsApp
- Reinicie o servidor e escaneie o QR code novamente