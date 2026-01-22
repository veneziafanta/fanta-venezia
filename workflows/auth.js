// Configurazione Supabase
const SUPABASE_URL = 'https://TUO_SUPABASE_URL.supabase.co';
const SUPABASE_KEY = 'TUO_SUPABASE_ANON_KEY';
const COMMON_PASSWORD = 'password123'; // Cambia questa password

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Controlla se l'utente è admin
function isAdmin(email) {
    const adminEmails = ['tuo@email.com']; // Aggiungi la tua email admin
    return adminEmails.includes(email);
}

// Login
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (password !== COMMON_PASSWORD) {
        document.getElementById('error-message').textContent = 'Password errata';
        return;
    }
    
    try {
        // Controlla se l'utente esiste
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);
        
        if (error) throw error;
        
        if (users.length === 0) {
            document.getElementById('error-message').textContent = 'Utente non autorizzato';
            return;
        }
        
        // Salva in sessionStorage e reindirizza
        sessionStorage.setItem('user', email);
        sessionStorage.setItem('authenticated', 'true');
        
        // Mostra sezione admin se l'utente è admin
        if (isAdmin(email)) {
            document.getElementById('admin-section').style.display = 'block';
        } else {
            window.location.href = 'dashboard.html';
        }
        
    } catch (error) {
        console.error('Errore login:', error);
        document.getElementById('error-message').textContent = 'Errore durante il login';
    }
}

// Aggiungi nuovo utente (solo admin)
async function addUser() {
    const newEmail = document.getElementById('new-user-email').value;
    const currentUser = sessionStorage.getItem('user');
    
    if (!isAdmin(currentUser)) {
        alert('Solo gli admin possono aggiungere utenti');
        return;
    }
    
    if (!newEmail) {
        alert('Inserisci un email');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ email: newEmail }]);
        
        if (error) throw error;
        
        alert('Utente aggiunto con successo!');
        document.getElementById('new-user-email').value = '';
        
    } catch (error) {
        console.error('Errore aggiunta utente:', error);
        alert('Errore nell\'aggiungere l\'utente');
    }
}

// Controlla autenticazione
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard.html') && !isAuthenticated) {
        window.location.href = 'login.html';
    }
    
    if (currentPage.includes('dashboard.html') && isAuthenticated) {
        document.getElementById('user-email').textContent = sessionStorage.getItem('user');
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authenticated');
    window.location.href = 'index.html';
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', checkAuth);