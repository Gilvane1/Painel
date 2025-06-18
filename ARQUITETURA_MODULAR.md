# Arquitetura Modular - Sistema Clínica ULTRAVIDA

## Visão Geral da Arquitetura

O sistema será dividido em **3 módulos independentes** para maior segurança, usabilidade e manutenibilidade:

### 📋 Estrutura dos Módulos

```
clinica-ultravida/
├── index.html              # Sistema de Login Centralizado
├── admin.html              # Painel Administrativo
├── chamador.html            # Chamador de Senhas
├── shared/
│   ├── auth.js             # Sistema de autenticação compartilhado
│   ├── data.js             # Gerenciamento de dados compartilhado
│   └── styles.css          # Estilos base compartilhados
├── admin/
│   ├── admin.js            # Lógica do painel administrativo
│   └── admin.css           # Estilos específicos do admin
├── chamador/
│   ├── chamador.js         # Lógica do chamador de senhas
│   └── chamador.css        # Estilos específicos do chamador
└── assets/
    └── logo_ultravida.jpg  # Logo da clínica
```

## 🔐 Módulo 1: Sistema de Login (index.html)

### Funcionalidades:
- **Autenticação centralizada**
- **Redirecionamento baseado em perfil**
- **Validação de credenciais**
- **Interface limpa e profissional**

### Perfis de Usuário:
- **Admin**: Acesso ao painel administrativo
- **Operador**: Acesso direto ao chamador de senhas
- **Visualizador**: Acesso apenas ao chamador (modo somente leitura)

## 🛠️ Módulo 2: Painel Administrativo (admin.html)

### Funcionalidades Principais:
- **Gestão de Consultórios**
  - Adicionar, editar, excluir consultórios
  - Configurar profissionais e especialidades
  - Definir cores e identificação visual

- **Gestão de Tipos de Atendimento**
  - Criar tipos personalizados
  - Configurar campos obrigatórios
  - Definir prioridades e cores

- **Gestão de Pacientes**
  - Cadastro completo de pacientes
  - Gerenciamento de filas
  - Configuração de prioridades

- **Configurações do Sistema**
  - Configurações de áudio e voz
  - Personalização do letreiro digital
  - Configurações de notificações

- **Relatórios e Estatísticas**
  - Relatórios de atendimento
  - Estatísticas por consultório
  - Histórico detalhado

## 📢 Módulo 3: Chamador de Senhas (chamador.html)

### Funcionalidades Principais:
- **Interface Otimizada para Operação**
  - Painel de chamada atual destacado
  - Botões grandes e intuitivos
  - Informações essenciais visíveis

- **Chamadas Avançadas**
  - Chamada por consultório específico
  - Filtros por prioridade (emergência, urgente, prioritário)
  - Filtros por tipo de atendimento
  - Chamadas inteligentes com balanceamento

- **Controles de Áudio**
  - Síntese de voz configurável
  - Controle de volume
  - Repetição de chamadas

- **Visualização em Tempo Real**
  - Status de todos os consultórios
  - Fila de pacientes por consultório
  - Histórico de chamadas recentes

## 🔄 Sistema de Dados Compartilhado

### Sincronização:
- **LocalStorage centralizado** para persistência
- **Eventos personalizados** para sincronização entre módulos
- **API de dados unificada** para consistência

### Estrutura de Dados:
```javascript
{
  offices: [...],           // Consultórios
  serviceTypes: [...],      // Tipos de atendimento
  patients: [...],          // Pacientes em fila
  recentCalls: [...],       // Histórico de chamadas
  settings: {...},          // Configurações do sistema
  users: [...]              // Usuários do sistema
}
```

## 🎨 Design System

### Cores Principais:
- **Vermelho Clínica**: #C41E3A (cor da marca)
- **Azul Escuro**: #1a202c (backgrounds)
- **Verde Sucesso**: #48bb78
- **Amarelo Atenção**: #ed8936
- **Vermelho Erro**: #f56565

### Tipografia:
- **Títulos**: Orbitron (futurista)
- **Texto**: Roboto (legibilidade)

## 🚀 Vantagens da Arquitetura Modular

### Segurança:
- **Separação de responsabilidades**
- **Controle de acesso granular**
- **Redução de superfície de ataque**

### Usabilidade:
- **Interfaces especializadas**
- **Menor complexidade por módulo**
- **Experiência otimizada por função**

### Manutenibilidade:
- **Código organizado e modular**
- **Atualizações independentes**
- **Testes isolados por módulo**

### Escalabilidade:
- **Deploy independente**
- **Performance otimizada**
- **Fácil adição de novos módulos**

## 📱 Responsividade

Todos os módulos serão **totalmente responsivos**:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Interface adaptada para toque
- **Mobile**: Versão otimizada para smartphones

## 🔧 Implementação

A implementação seguirá a ordem:
1. **Reestruturação do sistema atual**
2. **Criação do sistema de login**
3. **Desenvolvimento do painel administrativo**
4. **Otimização do chamador de senhas**
5. **Integração e testes**
6. **Documentação final**

