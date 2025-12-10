# 🏋️ TrainerApp

Um aplicativo mobile desenvolvido para Personal Trainers gerenciarem seus alunos e treinos, focado em agilidade e separação de perfis (Personal vs. Aluno).

## 📱 Sobre o Projeto

O **TrainerApp** é uma solução mobile construída com **React Native (Expo)**. O objetivo é permitir que Personal Trainers cadastrem alunos, criem treinos personalizados e acompanhem o progresso. O app conta com um sistema de autenticação e rotas distintas para administradores e alunos.

## 🛠 Tech Stack

- **Core:** React Native (Expo Managed Workflow)
- **Linguagem:** TypeScript
- **Backend as a Service:** Firebase (Authentication & Firestore)
- **Navegação:** React Navigation (Native Stack)
- **Design:** Estilização customizada (Dark Theme - `#121214`)

## 🚀 Funcionalidades & Estado Atual

O projeto está em desenvolvimento ativo. Abaixo o status das principais funcionalidades:

### 🔐 Autenticação & Rotas
- [x] Login funcional via `AuthContext`.
- [x] Separação automática de rotas por role (`admin` vs `student`).
- [x] **AdminRoutes:** Acesso a Dashboard, Cadastro de Alunos e Criação de Treinos.
- [x] **StudentRoutes:** Acesso à Home (Lista de treinos).

### 🎨 Interface (UI)
- [x] **Dashboard:** UI implementada (Dados mockados).
- [x] **RegisterStudent:** Formulário completo (Lógica de salvamento em progresso).
- [x] **CreateWorkout:** UI complexa para montagem de treinos (Lógica de persistência em progresso).

## 📦 Como rodar o projeto

### Pré-requisitos
- Node.js instalado.
- Gerenciador de pacotes (NPM ou Yarn).
- App Expo Go no celular ou emulador configurado.
- Configurar o FireBase

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/felipeselva/Trainer-App.git](https://github.com/felipeselva/Trainer-App.git)
