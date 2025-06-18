// Sistema de Chamada de Senhas - Clínica ULTRAVIDA
// Versão Completa e Funcional

class PasswordSystem {
    constructor() {
        this.currentPassword = 0;
        this.offices = [];
        this.serviceTypes = [
            { id: 1, name: "Consulta", color: "#C41E3A", requiresDetails: false, detailsLabel: "" },
            { id: 2, name: "Exame", color: "#28a745", requiresDetails: true, detailsLabel: "Tipo de Exame" },
            { id: 3, name: "Procedimento", color: "#fd7e14", requiresDetails: true, detailsLabel: "Tipo de Procedimento" }
        ];
        this.recentCalls = [];
        this.currentUser = null;
        this.isLoggedIn = false;
        this.confirmCallback = null;
        this.soundVolume = 50;
        this.lastCalledOffice = null;
        this.speechVoices = [];
        this.marqueeText = "BEM-VINDO À CLÍNICA ULTRAVIDA - SEU BEM-ESTAR É NOSSA PRIORIDADE!";
        this.nextOfficeId = 1;
        this.nextServiceId = 4;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.renderOffices();
        this.updateDisplay();
        this.loadData();
        this.loadSpeechVoices();
        
        // Atualizar relógio a cada segundo
        setInterval(() => this.updateClock(), 1000);
        
        this.updateMarquee();
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationsContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover notificação após 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // ===== MODAL DE CONFIRMAÇÃO =====
    showConfirmModal(message, callback) {
        document.getElementById('confirmMessage').textContent = message;
        this.confirmCallback = callback;
        const modal = document.getElementById('confirmModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    closeConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        this.confirmCallback = null;
    }

    // ===== PAINEL DE CONFIGURAÇÕES =====
    openConfigPanel() {
        const modal = document.getElementById('configModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        this.updatePatientOfficeSelect();
        this.updateServiceTypeSelect();
        this.updateOfficeSelector();
        this.updatePatientsQueue();
        this.updateOfficesList();
        this.updateServicesList();
        
        // Atualiza o campo de texto do letreiro ao abrir o painel
        const marqueeTextInput = document.getElementById('marqueeTextInput');
        if (marqueeTextInput) {
            marqueeTextInput.value = this.marqueeText;
        }
        
        this.loadClinicInfo();
        this.switchTab('patients');
    }

    closeConfigPanel() {
        const modal = document.getElementById('configModal');
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    switchTab(tabName) {
        // Remover classe active de todas as abas
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Ativar aba selecionada
        const selectedTabButton = document.querySelector(`.tab-btn[data-tab='${tabName}']`);
        if (selectedTabButton) {
            selectedTabButton.classList.add('active');
        }
        const selectedTabContent = document.getElementById(`${tabName}Tab`);
        if (selectedTabContent) {
            selectedTabContent.classList.add('active');
        }
    }

    // ===== GERENCIAMENTO DE DADOS =====
    saveData() {
        try {
            const data = {
                offices: this.offices,
                serviceTypes: this.serviceTypes,
                recentCalls: this.recentCalls,
                marqueeText: this.marqueeText,
                soundVolume: this.soundVolume,
                nextOfficeId: this.nextOfficeId,
                nextServiceId: this.nextServiceId,
                clinicInfo: {
                    name: document.getElementById("clinicName")?.value || "CLÍNICA ULTRAVIDA",
                    city: document.getElementById("clinicCity")?.value || "Piracuruca",
                    phone: document.getElementById("clinicPhone")?.value || "(86) 99985-2080",
                    address: document.getElementById("clinicAddress")?.value || "Rua Senador Gervásio, Centro"
                }
            };
            
            localStorage.setItem('clinicaUltravidaData', JSON.stringify(data));
            
            // Manter senha separada para segurança
            const storedPassword = localStorage.getItem('systemPassword') || 'Gilvane1*';
            localStorage.setItem('systemPassword', storedPassword);
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification("Erro ao salvar dados", "error");
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('clinicaUltravidaData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                this.offices = data.offices || [];
                this.serviceTypes = data.serviceTypes || this.getDefaultServiceTypes();
                this.recentCalls = data.recentCalls || [];
                this.marqueeText = data.marqueeText || "BEM-VINDO À CLÍNICA ULTRAVIDA - SEU BEM-ESTAR É NOSSA PRIORIDADE!";
                this.soundVolume = data.soundVolume || 50;
                this.nextOfficeId = data.nextOfficeId || 1;
                this.nextServiceId = data.nextServiceId || 4;
                
                if (data.clinicInfo) {
                    this.updateClinicInfoUI(data.clinicInfo);
                }
            } else {
                this.initializeDefaults();
            }
            
            this.updateMarquee();
            this.renderOffices();
            this.updateDisplay();
            this.updateServiceTypeSelect();
        } catch (error) {
            console.error('Error loading data:', error);
            this.initializeDefaults();
        }
    }

    getDefaultServiceTypes() {
        return [
            { id: 1, name: "Consulta", color: "#C41E3A", requiresDetails: false, detailsLabel: "" },
            { id: 2, name: "Exame", color: "#28a745", requiresDetails: true, detailsLabel: "Tipo de Exame" },
            { id: 3, name: "Procedimento", color: "#fd7e14", requiresDetails: true, detailsLabel: "Tipo de Procedimento" }
        ];
    }

    initializeDefaults() {
        this.offices = [
            { id: 1, number: 1, name: "Cardiologia", doctor: "Dr. João Silva", color: "#C41E3A", queue: [], currentPatient: null },
            { id: 2, number: 2, name: "Pediatria", doctor: "Dra. Maria Santos", color: "#28a745", queue: [], currentPatient: null },
            { id: 3, number: 3, name: "Ortopedia", doctor: "Dr. Carlos Lima", color: "#fd7e14", queue: [], currentPatient: null },
            { id: 4, number: 4, name: "Dermatologia", doctor: "Dra. Ana Costa", color: "#6f42c1", queue: [], currentPatient: null },
            { id: 5, number: 5, name: "Clínica Geral", doctor: "Dr. Pedro Oliveira", color: "#17a2b8", queue: [], currentPatient: null }
        ];
        this.serviceTypes = this.getDefaultServiceTypes();
        this.recentCalls = [];
        this.marqueeText = "BEM-VINDO À CLÍNICA ULTRAVIDA - SEU BEM-ESTAR É NOSSA PRIORIDADE!";
        this.soundVolume = 50;
        this.nextOfficeId = 6;
        this.nextServiceId = 4;
    }

    // ===== GERENCIAMENTO DE TIPOS DE ATENDIMENTO =====
    updateServiceTypeSelect() {
        const select = document.getElementById("serviceType");
        if (!select) return;

        select.innerHTML = '<option value="">Selecione...</option>';
        
        this.serviceTypes.forEach(service => {
            const option = document.createElement("option");
            option.value = service.id;
            option.textContent = service.name;
            option.dataset.requiresDetails = service.requiresDetails;
            option.dataset.detailsLabel = service.detailsLabel;
            select.appendChild(option);
        });
    }

    saveServiceType() {
        const name = document.getElementById("serviceName").value.trim();
        const color = document.getElementById("serviceColor").value;
        const requiresDetails = document.getElementById("serviceRequiresDetails").value === "true";
        const detailsLabel = document.getElementById("serviceDetailsLabel").value.trim();

        if (!name) {
            this.showNotification("Nome do tipo de atendimento é obrigatório!", "error");
            return;
        }

        // Verificar se já existe um tipo com esse nome
        const existingService = this.serviceTypes.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existingService) {
            this.showNotification("Já existe um tipo de atendimento com esse nome!", "error");
            return;
        }

        const newService = {
            id: this.nextServiceId++,
            name,
            color,
            requiresDetails,
            detailsLabel: requiresDetails ? detailsLabel : ""
        };

        this.serviceTypes.push(newService);
        this.updateServicesList();
        this.updateServiceTypeSelect();
        this.saveData();
        this.showNotification("Tipo de atendimento adicionado com sucesso!", "success");

        // Limpar formulário
        document.getElementById("serviceForm").reset();
        document.getElementById("serviceColor").value = "#C41E3A";
    }

    updateServicesList() {
        const container = document.getElementById("servicesList");
        if (!container) return;

        container.innerHTML = "";

        this.serviceTypes.forEach(service => {
            const serviceItem = document.createElement("div");
            serviceItem.className = "service-item";
            serviceItem.innerHTML = `
                <div class="service-info">
                    <div class="service-item-name" style="color: ${service.color}">
                        ${service.name}
                        ${service.requiresDetails ? ` (${service.detailsLabel})` : ''}
                    </div>
                    <div class="service-item-details">
                        ${service.requiresDetails ? 'Requer detalhes adicionais' : 'Não requer detalhes'}
                    </div>
                </div>
                <div class="service-actions">
                    <button class="btn-secondary btn-small" onclick="passwordSystem.editServiceType(${service.id})">Editar</button>
                    <button class="btn-danger btn-small" onclick="passwordSystem.deleteServiceType(${service.id})">Excluir</button>
                </div>
            `;
            container.appendChild(serviceItem);
        });
    }

    editServiceType(serviceId) {
        const service = this.serviceTypes.find(s => s.id === serviceId);
        if (service) {
            document.getElementById("serviceName").value = service.name;
            document.getElementById("serviceColor").value = service.color;
            document.getElementById("serviceRequiresDetails").value = service.requiresDetails.toString();
            document.getElementById("serviceDetailsLabel").value = service.detailsLabel || "";
            
            // Remover o serviço atual para permitir edição
            this.serviceTypes = this.serviceTypes.filter(s => s.id !== serviceId);
        }
    }

    deleteServiceType(serviceId) {
        const service = this.serviceTypes.find(s => s.id === serviceId);
        if (!service) return;

        // Verificar se há pacientes usando este tipo de atendimento
        const hasPatients = this.offices.some(office => 
            office.queue.some(patient => patient.serviceType === serviceId) ||
            (office.currentPatient && office.currentPatient.serviceType === serviceId)
        );

        if (hasPatients) {
            this.showNotification("Não é possível excluir este tipo de atendimento pois há pacientes utilizando-o!", "error");
            return;
        }

        this.showConfirmModal(`Tem certeza que deseja excluir o tipo de atendimento "${service.name}"?`, () => {
            this.serviceTypes = this.serviceTypes.filter(s => s.id !== serviceId);
            this.updateServicesList();
            this.updateServiceTypeSelect();
            this.saveData();
            this.showNotification("Tipo de atendimento excluído com sucesso!", "success");
        });
    }

    // ===== INFORMAÇÕES DA CLÍNICA =====
    updateClinicInfoUI(clinicInfo) {
        const nameField = document.getElementById("clinicName");
        const cityField = document.getElementById("clinicCity");
        const phoneField = document.getElementById("clinicPhone");
        const addressField = document.getElementById("clinicAddress");
        
        if (nameField) nameField.value = clinicInfo.name || "CLÍNICA ULTRAVIDA";
        if (cityField) cityField.value = clinicInfo.city || "Piracuruca";
        if (phoneField) phoneField.value = clinicInfo.phone || "(86) 99985-2080";
        if (addressField) addressField.value = clinicInfo.address || "Rua Senador Gervásio, Centro";

        // Update header information
        const titleElement = document.querySelector(".clinic-title");
        const locationElement = document.querySelector(".clinic-location");
        if (titleElement) titleElement.textContent = clinicInfo.name;
        if (locationElement) locationElement.textContent = `${clinicInfo.city} • ${clinicInfo.phone} • ${clinicInfo.address}`;
        
        // Update volume slider
        const volumeSlider = document.getElementById('soundVolume');
        const volumeValue = document.getElementById('volumeValue');
        if (volumeSlider && volumeValue) {
            volumeSlider.value = this.soundVolume;
            volumeValue.textContent = this.soundVolume + '%';
        }
        
        // Update marquee text input
        const marqueeTextInput = document.getElementById('marqueeTextInput');
        if (marqueeTextInput) {
            marqueeTextInput.value = this.marqueeText;
        }
    }

    async saveClinicInfo() {
        try {
            this.saveData();
            this.showNotification("Informações da clínica salvas com sucesso!", "success");
        } catch (error) {
            this.showNotification("Erro ao salvar informações da clínica", "error");
        }
    }

    loadClinicInfo() {
        // Este método agora é tratado pelo loadData()
    }

    // ===== ALTERAR SENHA =====
    changePassword() {
        const currentPass = document.getElementById("currentPassword").value;
        const newPass = document.getElementById("newPassword").value;
        const confirmPass = document.getElementById("confirmPassword").value;

        const storedPassword = localStorage.getItem('systemPassword') || 'Gilvane1*';

        if (currentPass !== storedPassword) {
            this.showNotification("Senha atual incorreta!", "error");
            return;
        }

        if (newPass.length < 6) {
            this.showNotification("A nova senha deve ter pelo menos 6 caracteres!", "error");
            return;
        }

        if (newPass !== confirmPass) {
            this.showNotification("A nova senha e a confirmação não coincidem!", "error");
            return;
        }

        localStorage.setItem('systemPassword', newPass);
        this.showNotification("Senha alterada com sucesso!", "success");
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
        this.saveData();
    }

    // ===== RESETAR SISTEMA =====
    resetSystem() {
        this.showConfirmModal("Tem certeza que deseja RESETAR o sistema? Todos os dados serão perdidos!", () => {
            localStorage.clear();
            localStorage.setItem('systemPassword', 'Gilvane1*');
            location.reload();
        });
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Login
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        
        if (usernameInput) {
            usernameInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") this.login();
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") this.login();
            });
        }

        // Formulários
        const officeForm = document.getElementById("officeForm");
        const patientForm = document.getElementById("patientForm");
        const serviceForm = document.getElementById("serviceForm");
        
        if (officeForm) {
            officeForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.saveOffice();
            });
        }

        if (patientForm) {
            patientForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.addPatient();
            });
        }

        if (serviceForm) {
            serviceForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.saveServiceType();
            });
        }

        // Modal de confirmação
        const btnConfirm = document.getElementById("btnConfirm");
        const btnCancel = document.getElementById("btnCancel");
        
        if (btnConfirm) {
            btnConfirm.addEventListener("click", () => {
                if (this.confirmCallback) {
                    this.confirmCallback();
                    this.closeConfirmModal();
                }
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener("click", () => {
                this.closeConfirmModal();
            });
        }

        // Volume slider
        const volumeSlider = document.getElementById("soundVolume");
        const volumeValue = document.getElementById("volumeValue");
        
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener("input", (e) => {
                this.soundVolume = parseInt(e.target.value);
                volumeValue.textContent = this.soundVolume + "%";
                this.saveData();
            });
        }

        // Marquee text input
        const marqueeTextInput = document.getElementById("marqueeTextInput");
        if (marqueeTextInput) {
            marqueeTextInput.addEventListener("input", (e) => {
                this.marqueeText = e.target.value;
                this.saveData();
                this.updateMarquee();
            });
        }
    }

    // ===== SISTEMA DE LOGIN =====
    login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const storedPassword = localStorage.getItem('systemPassword') || 'Gilvane1*';

        if ((username === "admin" || username === "Gilvane") && password === storedPassword) {
            this.currentUser = username;
            this.isLoggedIn = true;
            document.getElementById("loginScreen").style.display = "none";
            document.getElementById("mainSystem").style.display = "block";
            this.showNotification("Login realizado com sucesso!", "success");
        } else {
            this.showNotification("Usuário ou senha incorretos!", "error");
        }
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        document.getElementById("loginScreen").style.display = "flex";
        document.getElementById("mainSystem").style.display = "none";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }

    // ===== TOGGLE PASSWORD =====
    togglePassword() {
        const passwordInput = document.getElementById("password");
        const eyeIcon = document.getElementById("eyeIcon");
        
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            eyeIcon.textContent = "👁️";
        }
    }

    // ===== RELÓGIO =====
    updateClock() {
        const now = new Date();
        const clock = document.getElementById("clock");
        if (clock) {
            clock.textContent = now.toLocaleTimeString("pt-BR");
        }
    }

    // ===== LETREIRO DIGITAL =====
    updateMarquee() {
        const marquee = document.getElementById("digitalMarquee");
        if (marquee) {
            marquee.textContent = this.marqueeText;
        }
    }

    updateMarqueeFromInput() {
        const marqueeTextInput = document.getElementById("marqueeTextInput");
        if (marqueeTextInput) {
            this.marqueeText = marqueeTextInput.value;
            this.updateMarquee();
            this.saveData();
            this.showNotification("Letreiro atualizado com sucesso!", "success");
        }
    }

    // ===== GERENCIAR CONSULTÓRIOS =====
    saveOffice() {
        const number = parseInt(document.getElementById("officeNumber").value);
        const name = document.getElementById("officeName").value.trim();
        const doctor = document.getElementById("officeDoctor").value.trim();
        const color = document.getElementById("officeColor").value;

        if (!number || number < 1) {
            this.showNotification("Número do consultório deve ser maior que zero!", "error");
            return;
        }

        if (!name) {
            this.showNotification("Nome do consultório é obrigatório!", "error");
            return;
        }

        if (!doctor) {
            this.showNotification("Nome do profissional é obrigatório!", "error");
            return;
        }

        // Verificar se já existe um consultório com esse número
        const existingOffice = this.offices.find(office => office.number === number);
        
        if (existingOffice) {
            // Atualizar consultório existente
            existingOffice.name = name;
            existingOffice.doctor = doctor;
            existingOffice.color = color;
            this.showNotification("Consultório atualizado com sucesso!", "success");
        } else {
            // Adicionar novo consultório
            const newOffice = {
                id: this.nextOfficeId++,
                number,
                name,
                doctor,
                color,
                queue: [],
                currentPatient: null
            };
            this.offices.push(newOffice);
            this.showNotification("Consultório adicionado com sucesso!", "success");
        }

        this.renderOffices();
        this.updatePatientOfficeSelect();
        this.updateOfficesList();
        this.saveData();

        // Limpar formulário
        document.getElementById("officeForm").reset();
        document.getElementById("officeColor").value = "#C41E3A";
    }

    updateOfficesList() {
        const container = document.getElementById("officesList");
        if (!container) return;

        container.innerHTML = "";

        this.offices.forEach(office => {
            const officeItem = document.createElement("div");
            officeItem.className = "office-item";
            officeItem.innerHTML = `
                <div class="office-info">
                    <div class="office-item-name">Consultório ${office.number} - ${office.name}</div>
                    <div class="office-item-details">${office.doctor}</div>
                    <div class="office-item-queue">Fila: ${office.queue.length} paciente(s)</div>
                </div>
                <div class="office-actions">
                    <button class="btn-secondary btn-small" onclick="passwordSystem.editOffice(${office.number})">Editar</button>
                    <button class="btn-danger btn-small" onclick="passwordSystem.deleteOffice(${office.number})">Excluir</button>
                </div>
            `;
            container.appendChild(officeItem);
        });

        if (this.offices.length === 0) {
            container.innerHTML = '<div class="no-calls">Nenhum consultório cadastrado</div>';
        }
    }

    editOffice(number) {
        const office = this.offices.find(o => o.number === number);
        if (office) {
            document.getElementById("officeNumber").value = office.number;
            document.getElementById("officeName").value = office.name;
            document.getElementById("officeDoctor").value = office.doctor;
            document.getElementById("officeColor").value = office.color;
        }
    }

    deleteOffice(number) {
        const office = this.offices.find(o => o.number === number);
        if (!office) return;

        // Verificar se há pacientes na fila ou sendo atendidos
        if (office.queue.length > 0 || office.currentPatient) {
            this.showNotification("Não é possível excluir consultório com pacientes na fila ou em atendimento!", "error");
            return;
        }

        this.showConfirmModal(`Tem certeza que deseja excluir o Consultório ${number} - ${office.name}?`, () => {
            this.offices = this.offices.filter(office => office.number !== number);
            this.renderOffices();
            this.updatePatientOfficeSelect();
            this.updateOfficesList();
            this.saveData();
            this.showNotification("Consultório excluído com sucesso!", "success");
        });
    }

    renderOffices() {
        const container = document.getElementById("officesContainer");
        if (!container) return;

        container.innerHTML = "";

        this.offices.forEach(office => {
            const officeCard = document.createElement("div");
            officeCard.className = "office-card";
            officeCard.innerHTML = `
                <div class="office-header">
                    <div class="office-number" style="background-color: ${office.color}">${office.number}</div>
                    <div class="office-status ${office.currentPatient ? 'occupied' : 'available'}"></div>
                </div>
                <div class="office-name">${office.name}</div>
                <div class="office-doctor">${office.doctor}</div>
                <div class="office-queue">Fila: ${office.queue.length} paciente(s)</div>
                ${office.currentPatient ? `<div class="office-current">Atual: ${office.currentPatient.name}</div>` : ''}
            `;
            container.appendChild(officeCard);
        });
    }

    // ===== GERENCIAR PACIENTES =====
    updatePatientOfficeSelect() {
        const select = document.getElementById("patientOffice");
        if (!select) return;

        select.innerHTML = '<option value="">Selecione...</option>';
        
        this.offices.forEach(office => {
            const option = document.createElement("option");
            option.value = office.number;
            option.textContent = `Consultório ${office.number} - ${office.name}`;
            select.appendChild(option);
        });
    }

    toggleExamField() {
        const serviceTypeSelect = document.getElementById("serviceType");
        const examField = document.getElementById("examField");
        const examLabel = document.querySelector("#examField label");
        const examInput = document.getElementById("examType");
        
        if (!serviceTypeSelect.value) {
            examField.style.display = "none";
            return;
        }

        const selectedOption = serviceTypeSelect.options[serviceTypeSelect.selectedIndex];
        const requiresDetails = selectedOption.dataset.requiresDetails === "true";
        const detailsLabel = selectedOption.dataset.detailsLabel || "Detalhes";
        
        if (requiresDetails) {
            examField.style.display = "block";
            examLabel.textContent = detailsLabel + ":";
            examInput.placeholder = `Ex: ${detailsLabel}...`;
        } else {
            examField.style.display = "none";
        }
    }

    addPatient() {
        const name = document.getElementById("patientName").value.trim();
        const officeNumber = parseInt(document.getElementById("patientOffice").value);
        const priority = document.getElementById("patientPriority").value;
        const serviceTypeId = parseInt(document.getElementById("serviceType").value);
        const examType = document.getElementById("examType").value.trim();

        if (!name) {
            this.showNotification("Nome do paciente é obrigatório!", "error");
            return;
        }

        if (!officeNumber) {
            this.showNotification("Selecione um consultório!", "error");
            return;
        }

        if (!serviceTypeId) {
            this.showNotification("Selecione um tipo de atendimento!", "error");
            return;
        }

        const office = this.offices.find(o => o.number === officeNumber);
        if (!office) {
            this.showNotification("Consultório não encontrado!", "error");
            return;
        }

        const serviceType = this.serviceTypes.find(s => s.id === serviceTypeId);
        if (!serviceType) {
            this.showNotification("Tipo de atendimento não encontrado!", "error");
            return;
        }

        // Verificar se requer detalhes e se foram fornecidos
        if (serviceType.requiresDetails && !examType) {
            this.showNotification(`${serviceType.detailsLabel} é obrigatório para este tipo de atendimento!`, "error");
            return;
        }

        const patient = {
            id: Date.now(),
            name,
            priority,
            serviceType: serviceTypeId,
            serviceTypeName: serviceType.name,
            examType: serviceType.requiresDetails ? examType : null,
            addedAt: new Date()
        };

        office.queue.push(patient);
        
        // Ordenar fila por prioridade
        office.queue.sort((a, b) => {
            const priorities = { urgent: 3, priority: 2, normal: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });

        this.showNotification(`Paciente ${name} adicionado à fila do ${office.name}!`, "success");
        this.updatePatientsQueue();
        this.renderOffices();
        this.saveData();

        // Limpar formulário
        document.getElementById("patientForm").reset();
        document.getElementById("examField").style.display = "none";
    }

    updatePatientsQueue() {
        const container = document.getElementById("patientsQueue");
        if (!container) return;

        container.innerHTML = "";

        this.offices.forEach(office => {
            office.queue.forEach(patient => {
                const serviceType = this.serviceTypes.find(s => s.id === patient.serviceType);
                const serviceTypeName = serviceType ? serviceType.name : patient.serviceTypeName || "Tipo desconhecido";
                
                const queueItem = document.createElement("div");
                queueItem.className = `queue-item priority-${patient.priority}`;
                queueItem.innerHTML = `
                    <div class="queue-info">
                        <div class="queue-name">${patient.name}</div>
                        <div class="queue-details">
                            ${office.name} • ${serviceTypeName}
                            ${patient.examType ? ` • ${patient.examType}` : ''}
                            • Prioridade: ${this.getPriorityLabel(patient.priority)}
                        </div>
                    </div>
                    <div class="queue-actions">
                        <button class="btn-primary btn-small" onclick="passwordSystem.callPatient(${office.number}, ${patient.id})">Chamar</button>
                        <button class="btn-danger btn-small" onclick="passwordSystem.removePatient(${office.number}, ${patient.id})">Remover</button>
                    </div>
                `;
                container.appendChild(queueItem);
            });
        });

        if (container.children.length === 0) {
            container.innerHTML = '<div class="no-calls">Nenhum paciente na fila</div>';
        }
    }

    getPriorityLabel(priority) {
        const labels = {
            urgent: "Urgente",
            priority: "Prioritário",
            normal: "Normal"
        };
        return labels[priority] || priority;
    }

    removePatient(officeNumber, patientId) {
        const office = this.offices.find(o => o.number === officeNumber);
        if (office) {
            const patient = office.queue.find(p => p.id === patientId);
            if (patient) {
                this.showConfirmModal(`Tem certeza que deseja remover ${patient.name} da fila?`, () => {
                    office.queue = office.queue.filter(p => p.id !== patientId);
                    this.updatePatientsQueue();
                    this.renderOffices();
                    this.saveData();
                    this.showNotification("Paciente removido da fila!", "success");
                });
            }
        }
    }

    // ===== CHAMADAS AVANÇADAS =====
    
    // Atualizar seletor de consultórios
    updateOfficeSelector() {
        const selector = document.getElementById("officeSelector");
        if (!selector) return;
        
        // Limpar opções existentes (exceto a primeira)
        selector.innerHTML = '<option value="">Todos os Consultórios</option>';
        
        // Adicionar opções dos consultórios
        this.offices.forEach(office => {
            const option = document.createElement("option");
            option.value = office.number;
            option.textContent = `Consultório ${office.number} - ${office.name}`;
            selector.appendChild(option);
        });
    }
    
    // Chamar próximo paciente do consultório selecionado
    callNextFromSelectedOffice() {
        const selector = document.getElementById("officeSelector");
        const selectedOffice = selector ? selector.value : "";
        
        if (!selectedOffice) {
            // Se nenhum consultório selecionado, chamar próximo disponível
            this.callNextAvailablePatient();
            return;
        }
        
        const officeNumber = parseInt(selectedOffice);
        const office = this.offices.find(o => o.number === officeNumber);
        
        if (!office) {
            this.showNotification("Consultório não encontrado!", "error");
            return;
        }
        
        if (office.queue.length === 0) {
            this.showNotification(`Nenhum paciente na fila do ${office.name}!`, "warning");
            return;
        }
        
        // Chamar próximo paciente do consultório (respeitando prioridades)
        this.callNextFromOffice(officeNumber);
    }
    
    // Chamar próximo paciente de um consultório específico
    callNextFromOffice(officeNumber) {
        const office = this.offices.find(o => o.number === officeNumber);
        if (!office || office.queue.length === 0) {
            this.showNotification(`Nenhum paciente na fila do consultório ${officeNumber}!`, "warning");
            return;
        }
        
        // Procurar por pacientes urgentes primeiro
        let patient = office.queue.find(p => p.priority === 'urgent');
        if (patient) {
            this.callPatient(officeNumber, patient.id);
            return;
        }
        
        // Procurar por pacientes prioritários
        patient = office.queue.find(p => p.priority === 'priority');
        if (patient) {
            this.callPatient(officeNumber, patient.id);
            return;
        }
        
        // Chamar próximo paciente normal
        patient = office.queue[0];
        this.callPatient(officeNumber, patient.id);
    }
    
    // Chamar urgente do consultório selecionado
    callUrgentFromSelected() {
        const selector = document.getElementById("officeSelector");
        const selectedOffice = selector ? selector.value : "";
        
        if (!selectedOffice) {
            // Se nenhum consultório selecionado, chamar urgente de qualquer consultório
            this.callUrgentPatient();
            return;
        }
        
        const officeNumber = parseInt(selectedOffice);
        this.callUrgentFromOffice(officeNumber);
    }
    
    // Chamar urgente de um consultório específico
    callUrgentFromOffice(officeNumber) {
        const office = this.offices.find(o => o.number === officeNumber);
        if (!office) {
            this.showNotification("Consultório não encontrado!", "error");
            return;
        }
        
        const urgentPatient = office.queue.find(p => p.priority === 'urgent');
        if (urgentPatient) {
            this.callPatient(officeNumber, urgentPatient.id);
        } else {
            this.showNotification(`Nenhum paciente urgente na fila do ${office.name}!`, "warning");
        }
    }
    
    // Chamar prioritário do consultório selecionado
    callPriorityFromSelected() {
        const selector = document.getElementById("officeSelector");
        const selectedOffice = selector ? selector.value : "";
        
        if (!selectedOffice) {
            // Se nenhum consultório selecionado, chamar prioritário de qualquer consultório
            this.callPriorityPatient();
            return;
        }
        
        const officeNumber = parseInt(selectedOffice);
        this.callPriorityFromOffice(officeNumber);
    }
    
    // Chamar prioritário de um consultório específico
    callPriorityFromOffice(officeNumber) {
        const office = this.offices.find(o => o.number === officeNumber);
        if (!office) {
            this.showNotification("Consultório não encontrado!", "error");
            return;
        }
        
        const priorityPatient = office.queue.find(p => p.priority === 'priority');
        if (priorityPatient) {
            this.callPatient(officeNumber, priorityPatient.id);
        } else {
            this.showNotification(`Nenhum paciente prioritário na fila do ${office.name}!`, "warning");
        }
    }
    
    // Chamar próximo paciente prioritário (qualquer consultório)
    callPriorityPatient() {
        for (let office of this.offices) {
            const priorityPatient = office.queue.find(p => p.priority === 'priority');
            if (priorityPatient) {
                this.callPatient(office.number, priorityPatient.id);
                return;
            }
        }
        this.showNotification("Nenhum paciente prioritário na fila!", "warning");
    }
    callPatient(officeNumber, patientId) {
        const office = this.offices.find(o => o.number === officeNumber);
        if (!office) return;

        const patientIndex = office.queue.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return;

        const patient = office.queue[patientIndex];
        
        // Remover da fila
        office.queue.splice(patientIndex, 1);
        
        // Definir como paciente atual
        office.currentPatient = patient;
        
        // Atualizar display
        this.updateCurrentCall(office, patient);
        
        // Adicionar ao histórico
        this.addToHistory(patient, office);
        
        // Reproduzir áudio
        this.speakCall(patient.name, office.name);
        
        // Salvar estado
        this.lastCalledOffice = office;
        this.updatePatientsQueue();
        this.renderOffices();
        this.updateRecentCalls();
        this.saveData();
        
        this.showNotification(`Chamando ${patient.name} para ${office.name}!`, "success");
    }

    callNextAvailablePatient() {
        // Procurar por pacientes urgentes primeiro
        for (let office of this.offices) {
            const urgentPatient = office.queue.find(p => p.priority === 'urgent');
            if (urgentPatient) {
                this.callPatient(office.number, urgentPatient.id);
                return;
            }
        }
        
        // Procurar por pacientes prioritários
        for (let office of this.offices) {
            const priorityPatient = office.queue.find(p => p.priority === 'priority');
            if (priorityPatient) {
                this.callPatient(office.number, priorityPatient.id);
                return;
            }
        }
        
        // Procurar próximo paciente normal
        for (let office of this.offices) {
            if (office.queue.length > 0) {
                this.callPatient(office.number, office.queue[0].id);
                return;
            }
        }
        
        this.showNotification("Nenhum paciente na fila!", "warning");
    }

    callPreviousPatient() {
        if (this.lastCalledOffice && this.lastCalledOffice.currentPatient) {
            const office = this.lastCalledOffice;
            const patient = office.currentPatient;
            
            this.updateCurrentCall(office, patient);
            this.speakCall(patient.name, office.name);
            this.showNotification(`Chamando novamente ${patient.name} para ${office.name}!`, "success");
        } else {
            this.showNotification("Nenhuma chamada anterior disponível!", "warning");
        }
    }

    callUrgentPatient() {
        for (let office of this.offices) {
            const urgentPatient = office.queue.find(p => p.priority === 'urgent');
            if (urgentPatient) {
                this.callPatient(office.number, urgentPatient.id);
                return;
            }
        }
        this.showNotification("Nenhum paciente urgente na fila!", "warning");
    }

    updateCurrentCall(office, patient) {
        const serviceType = this.serviceTypes.find(s => s.id === patient.serviceType);
        const serviceTypeName = serviceType ? serviceType.name : patient.serviceTypeName || "Tipo desconhecido";
        
        document.getElementById("currentPatient").textContent = patient.name;
        document.getElementById("currentProfessional").textContent = office.doctor;
        document.getElementById("currentOffice").textContent = `Consultório ${office.number} - ${office.name}`;
        document.getElementById("currentServiceType").textContent = serviceTypeName;
        
        const examDetail = document.getElementById("currentExamDetail");
        const examValue = document.getElementById("currentExam");
        
        if (patient.examType) {
            examDetail.style.display = "block";
            examValue.textContent = patient.examType;
        } else {
            examDetail.style.display = "none";
        }
    }

    addToHistory(patient, office) {
        const call = {
            id: Date.now(),
            patient: patient.name,
            office: `${office.name} - ${office.doctor}`,
            time: new Date().toLocaleTimeString("pt-BR"),
            serviceType: patient.serviceType,
            examType: patient.examType
        };
        
        this.recentCalls.unshift(call);
        
        // Manter apenas os últimos 10 chamados
        if (this.recentCalls.length > 10) {
            this.recentCalls = this.recentCalls.slice(0, 10);
        }
    }

    updateRecentCalls() {
        const container = document.getElementById("recentCalls");
        if (!container) return;

        container.innerHTML = "";

        if (this.recentCalls.length === 0) {
            container.innerHTML = '<div class="no-calls">Nenhuma chamada realizada ainda</div>';
            return;
        }

        this.recentCalls.forEach(call => {
            const callItem = document.createElement("div");
            callItem.className = "call-history-item";
            callItem.innerHTML = `
                <div class="call-info">
                    <div class="call-patient">${call.patient}</div>
                    <div class="call-office">${call.office}</div>
                </div>
                <div class="call-time">${call.time}</div>
            `;
            container.appendChild(callItem);
        });
    }

    // ===== SÍNTESE DE VOZ =====
    loadSpeechVoices() {
        if ('speechSynthesis' in window) {
            this.speechVoices = speechSynthesis.getVoices();
            speechSynthesis.onvoiceschanged = () => {
                this.speechVoices = speechSynthesis.getVoices();
            };
        }
    }

    speakCall(patientName, officeName) {
        if ('speechSynthesis' in window && this.soundVolume > 0) {
            const text = `${patientName}, compareça ao ${officeName}. ${patientName}, ${officeName}.`;
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configurar voz em português se disponível
            const portugueseVoice = this.speechVoices.find(voice => 
                voice.lang.includes('pt') || voice.lang.includes('PT')
            );
            
            if (portugueseVoice) {
                utterance.voice = portugueseVoice;
            }
            
            utterance.volume = this.soundVolume / 100;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            
            speechSynthesis.speak(utterance);
        }
    }

    testSound() {
        this.speakCall("João Silva", "Consultório 1 - Cardiologia");
        this.showNotification("Teste de som executado!", "info");
    }

    // ===== ATUALIZAÇÃO DO DISPLAY =====
    updateDisplay() {
        this.updateRecentCalls();
        this.renderOffices();
        this.updateMarquee();
    }
}

// Inicializar sistema
const passwordSystem = new PasswordSystem();

// Funções globais para compatibilidade
function login() {
    passwordSystem.login();
}

function logout() {
    passwordSystem.logout();
}

function togglePassword() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "👁️";
    }
}
