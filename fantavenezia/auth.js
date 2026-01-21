// INIZIALIZZA PAGINA AUTH
function initAuthPage() {
    // Tab system
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Enter key
    document.getElementById('loginPassword')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
    
    document.getElementById('regConfirm')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') register();
    });
    
    document.getElementById('resetEmail')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') resetPassword();
    });
    
    // Mostra tab login di default
    showTab('login');
}

// TAB SYSTEM
function showTab(tabName) {
    // Nascondi tutto
    document.getElementById('loginTab').classList.add('hidden');
    document.getElementById('registerTab').classList.add('hidden');
    document.getElementById('resetTab').classList.add('hidden');
    
    // Rimuovi active
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostra tab selezionato
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Pulisci messaggi
    clearAuthMessages();
}

// LOGIN
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showAuthMessage('loginMessage', 'Inserisci email e password', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        
        currentUser = data.user;
        showAuthMessage('loginMessage', 'Accesso effettuato!', 'success');
        setTimeout(() => goToDashboard(), 1000);
        
    } catch (error) {
        showAuthMessage('loginMessage', error.message, 'error');
    }
}

// REGISTRAZIONE
async function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    // Validazioni
    if (!email || !password || !confirm) {
        showAuthMessage('registerMessage', 'Compila tutti i campi', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('registerMessage', 'Password almeno 6 caratteri', 'error');
        return;
    }
    
    if (password !== confirm) {
        showAuthMessage('registerMessage', 'Password diverse', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: CONFIG.redirectUrl }
        });
        
        if (error) throw error;
        
        showAuthMessage('registerMessage', '✅ Registrato! Controlla l\'email per verificare.', 'success');
        
        // Pulisci form
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirm').value = '';
        
    } catch (error) {
        showAuthMessage('registerMessage', error.message, 'error');
    }
}

// RESET PASSWORD
async function resetPassword() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showAuthMessage('resetMessage', 'Inserisci email', 'error');
        return;
    }
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: CONFIG.redirectUrl
        });
        
        if (error) throw error;
        
        showAuthMessage('resetMessage', '✅ Link inviato! Controlla l\'email.', 'success');
        document.getElementById('resetEmail').value = '';
        
    } catch (error) {
        showAuthMessage('resetMessage', error.message, 'error');
    }
}

// LOGOUT
async function logout() {
    await supabase.auth.signOut();
    currentUser = null;
    goToAuth();
}

// UTILITY
function showAuthMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
}

function clearAuthMessages() {
    ['loginMessage', 'registerMessage', 'resetMessage'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });
}