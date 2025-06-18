# Plano de Implementação - Funcionalidades Avançadas de Chamada

## Análise do Sistema Atual

### Funcionalidades de Chamada Existentes:
1. **callNextAvailablePatient()**: Chama próximo paciente disponível (urgente > prioritário > normal)
2. **callPreviousPatient()**: Rechama último paciente chamado
3. **callUrgentPatient()**: Chama próximo paciente urgente de qualquer consultório
4. **callPatient(officeNumber, patientId)**: Chama paciente específico

### Limitações Identificadas:
- Não há opção para chamar por consultório específico
- Não há filtros por tipo de atendimento (exames, emergência)
- Interface não oferece seleção granular de chamadas

## Novas Funcionalidades a Implementar

### 1. Chamada por Consultório Específico
- **callNextFromOffice(officeNumber)**: Chama próximo paciente de um consultório específico
- **callUrgentFromOffice(officeNumber)**: Chama próximo urgente de um consultório específico
- **callPriorityFromOffice(officeNumber)**: Chama próximo prioritário de um consultório específico

### 2. Filtros de Chamada por Tipo
- **callNextExam()**: Chama próximo paciente para exame (qualquer consultório)
- **callNextEmergency()**: Chama próximo paciente de emergência
- **callExamFromOffice(officeNumber)**: Chama próximo exame de consultório específico

### 3. Interface Avançada de Chamadas
- Dropdown para seleção de consultório
- Botões de filtro por tipo de atendimento
- Painel de chamadas rápidas por consultório
- Indicadores visuais de tipos de pacientes na fila

### 4. Priorização Inteligente
- Emergência > Urgente > Prioritário > Normal
- Consideração do tempo de espera
- Balanceamento entre consultórios

## Estrutura de Implementação

### Fase 1: Interface HTML
- Adicionar dropdown de seleção de consultório
- Criar botões de filtro por tipo
- Implementar painel de chamadas por consultório

### Fase 2: Lógica JavaScript
- Implementar novos métodos de chamada
- Criar sistema de filtros
- Atualizar lógica de priorização

### Fase 3: Integração e Testes
- Testar todas as combinações de filtros
- Validar comportamento em cenários complexos
- Verificar responsividade da interface

## Prioridades de Desenvolvimento
1. **Alta**: Chamada por consultório específico
2. **Alta**: Filtros por urgência/emergência
3. **Média**: Filtros por tipo de exame
4. **Média**: Interface visual aprimorada
5. **Baixa**: Estatísticas e relatórios de chamadas

