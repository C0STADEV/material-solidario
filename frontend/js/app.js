// Configuração da API
const API_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Configurar headers padrão
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : ''
    };
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Logout
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showPage('landingPage');
}

// Get discount text
function getDiscountText(points) {
    if (points >= 30) return "15% de desconto em livrarias parceiras!";
    if (points >= 20) return "10% de desconto em livrarias parceiras!";
    if (points >= 10) return "5% de desconto em livrarias parceiras!";
    return "Você ainda não tem desconto";
}

// Load user donations and calculate points
async function loadUserDonations() {
    try {
        const response = await fetch(`${API_URL}/donations/user/${currentUser.id}`, {
            headers: getHeaders()
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('totalPontos').textContent = data.totalPoints;
            document.getElementById('descontoText').textContent = getDiscountText(data.totalPoints);
        }
    } catch (error) {
        console.error('Erro ao carregar doações:', error);
    }
}

// Update user info in dashboard
function updateDashboard(user) {
    if (user.type === 'solicitante') {
        document.getElementById('solicitanteNome').textContent = user.nome;
        document.getElementById('solicitanteEmail').textContent = user.email;
        document.getElementById('solicitanteCidade').textContent = user.cidade || '';
        document.getElementById('solicitanteTelefone').textContent = user.telefone;
    } else {
        document.getElementById('doadorNome').textContent = user.nome;
        document.getElementById('doadorEmail').textContent = user.email;
        document.getElementById('doadorTelefone').textContent = user.telefone;
        loadUserDonations();
    }
}

// Solicitante Login
document.getElementById('solicitanteLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                type: 'solicitante'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateDashboard(currentUser);
            showPage('solicitanteDashboard');
            showNotification('Login realizado com sucesso!');
        } else {
            showNotification(data.error || 'Erro no login', 'error');
        }
    } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Solicitante Cadastro
document.getElementById('solicitanteCadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'solicitante',
                nome: formData.get('nome'),
                email: formData.get('email'),
                password: formData.get('password'),
                telefone: formData.get('telefone'),
                cidade: formData.get('cidade'),
                endereco: formData.get('endereco'),
                bairro: formData.get('bairro')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateDashboard(currentUser);
            showPage('solicitanteDashboard');
            showNotification('Cadastro realizado com sucesso!');
        } else {
            showNotification(data.error || 'Erro no cadastro', 'error');
        }
    } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Doador Login
document.getElementById('doadorLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                type: 'doador'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateDashboard(currentUser);
            showPage('doadorDashboard');
            showNotification('Login realizado com sucesso!');
        } else {
            showNotification(data.error || 'Erro no login', 'error');
        }
    } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Doador Cadastro
document.getElementById('doadorCadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'doador',
                nome: formData.get('nome'),
                email: formData.get('email'),
                password: formData.get('password'),
                telefone: formData.get('telefone')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateDashboard(currentUser);
            showPage('doadorDashboard');
            showNotification('Cadastro realizado com sucesso!');
        } else {
            showNotification(data.error || 'Erro no cadastro', 'error');
        }
    } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Limit material selection to 3
document.querySelectorAll('.material-check').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checked = document.querySelectorAll('.material-check:checked');
        if (checked.length > 3) {
            checkbox.checked = false;
            alert('Você pode selecionar no máximo 3 itens!');
        }
    });
});

// Solicitação Form
document.getElementById('solicitacaoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const checkedMaterials = [];
    document.querySelectorAll('.material-check:checked').forEach(cb => {
        checkedMaterials.push(cb.value);
    });
    
    try {
        const response = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                nome_criancas: formData.get('nome_criancas'),
                quantidade: formData.get('quantidade'),
                serie: formData.get('serie'),
                ciente: formData.get('ciente'),
                materiais: checkedMaterials
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Solicitação confirmada com sucesso! Retire os materiais no CRAS da sua cidade.');
            e.target.reset();
        } else {
            showNotification(data.error || 'Erro ao registrar solicitação', 'error');
        }
    } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Doação Form
document.getElementById('doacaoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const checkedItems = [];
    document.querySelectorAll('.item-doacao:checked').forEach(cb => {
        checkedItems.push(cb.value);
    });
    
    try {
        const response = await fetch(`${API_URL}/donations`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                doou_antes: formData.get('doou_antes'),
                items: checkedItems,
                data_entrega: formData.get('data_entrega'),
                cras: formData.get('cras')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(`Doação confirmada! Você ganhou ${data.points} pontos.`);
            e.target.reset();
            loadUserDonations(); // Atualiza os pontos
        } else {
            showNotification(data.error || 'Erro ao registrar doação', 'error');
        }
    } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Check if user is logged in on page load
if (authToken && currentUser) {
    if (currentUser.type === 'solicitante') {
        updateDashboard(currentUser);
        showPage('solicitanteDashboard');
    } else if (currentUser.type === 'doador') {
        updateDashboard(currentUser);
        showPage('doadorDashboard');
    }
}