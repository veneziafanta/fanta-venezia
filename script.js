// ==================== CONFIGURAZIONE SUPABASE ====================
const supabase = window.supabase.createClient(
    'https://norfhoxpzdnbainkbwlw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcmZob3hwemRuYmFpbmtid2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDY4MzUsImV4cCI6MjA3ODM4MjgzNX0.SPP1DnlpnRMPVtEDir1pb74tGfMqNzxeIqMGSKaVr7A'
);

// ==================== LISTA PDF ====================
const pdfs = [
    { 
        name: "Regolamento - Fantacalcio Venezia.pdf", 
        link: "https://drive.google.com/uc?export=download&id=1iZwtWh7W_U4YzYeAAucUB_5LBFcHJRj1" 
    },
    { 
        name: "Termini e Condizioni - Fantacalcio Venezia.pdf", 
        link: "https://drive.google.com/uc?export=download&id=1EsEGBJQxrCTlEnABfcbv7SPaNnvlv7WH" 
    }
];

// ==================== FUNZIONI DOWNLOAD PAGE ====================
function showDownloadPage() {
    document.getElementById('userSection').classList.add('hidden');
    document.getElementById('downloadPage').classList.remove('hidden');
}

function showUserSectionFromDownload() {
    document.getElementById('downloadPage').classList.add('hidden');
    document.getElementById('userSection').classList.remove('hidden');
}

function downloadDocument(pdf) {
    const link = document.createElement('a');
    link.href = pdf.link;
    link.download = pdf.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== FUNZIONI UI ====================
function showTab(tabName) {
    // Nascondi tutte le tab
    document.getElementById('loginTab').classList.add('hidden');
    document.getElementById('registerTab').classList.add('hidden');
    document.getElementById('resetTab').classList.add('hidden');
    
    // Rimuovi active da tutte le tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostra la tab richiesta
    if (tabName === 'login') {
        document.getElementById('loginTab').classList.remove('hidden');
        document.querySelectorAll('.tab')[0].classList.add('active');
    } else if (tabName === 'register') {
        document.getElementById('registerTab').classList.remove('hidden');
        document.querySelectorAll('.tab')[1].classList.add('active');
    } else if (tabName === 'reset') {
        document.getElementById('resetTab').classList.remove('hidden');
        // Non attivare nessuna tab per il reset
    }
    
    // Pulisci i messaggi
    clearMessages();
}

function showUserSection(email) {
    hideAllSections();
    document.getElementById('userSection').classList.remove('hidden');
    document.getElementById('userEmail').textContent = `Accesso effettuato come: ${email}`;
}

function showAuthSection() {
    hideAllSections();
    document.getElementById('authSection').classList.remove('hidden');
    showTab('login');
}

function showChangePasswordSection() {
    hideAllSections();
    document.getElementById('changePasswordSection').classList.remove('hidden');
}

function hideAllSections() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('changePasswordSection').classList.add('hidden');
    document.getElementById('userSection').classList.add('hidden');
    document.getElementById('downloadPage').classList.add('hidden');
}

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
}

function clearMessages() {
    document.getElementById('loginMessage').classList.add('hidden');
    document.getElementById('registerMessage').classList.add('hidden');
    document.getElementById('resetMessage').classList.add('hidden');
    document.getElementById('changePasswordMessage').classList.add('hidden');
}

// ==================== FUNZIONI AUTH ====================
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && session.user) {
        showUserSection(session.user.email);
    } else {
        showAuthSection();
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('loginMessage', 'Inserisci email e password', 'error');
        return;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        showMessage('loginMessage', error.message, 'error');
    } else {
        showMessage('loginMessage', 'Accesso effettuato!', 'success');
        setTimeout(() => showUserSection(data.user.email), 1000);
    }
}

async function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (!email || !password || !confirm) {
        showMessage('registerMessage', 'Compila tutti i campi', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('registerMessage', 'La password deve essere di almeno 6 caratteri', 'error');
        return;
    }
    
    if (password !== confirm) {
        showMessage('registerMessage', 'Le password non coincidono', 'error');
        return;
    }
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: 'https://fantavenezia.netlify.app'
        }
    });

    if (error) {
        showMessage('registerMessage', error.message, 'error');
    } else {
        showMessage('registerMessage', 'Registrazione completata! Controlla la tua email per verificare l\'account.', 'success');
        
        // Pulisci il form
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirm').value = '';
    }
}

async function resetPassword() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showMessage('resetMessage', 'Inserisci la tua email', 'error');
        return;
    }
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://fantavenezia.netlify.app'
    });

    if (error) {
        showMessage('resetMessage', error.message, 'error');
    } else {
        showMessage('resetMessage', 'Link di reset inviato! Controlla la tua email.', 'success');
        document.getElementById('resetEmail').value = '';
    }
}

async function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!newPassword || !confirmPassword) {
        showMessage('changePasswordMessage', 'Compila entrambi i campi', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('changePasswordMessage', 'La password deve essere di almeno 6 caratteri', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage('changePasswordMessage', 'Le password non coincidono', 'error');
        return;
    }
    
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        showMessage('changePasswordMessage', 'Errore: ' + error.message, 'error');
    } else {
        showMessage('changePasswordMessage', '✅ Password cambiata con successo! Ora puoi accedere con la nuova password.', 'success');
        
        // Fai logout e torna al login dopo 2 secondi
        setTimeout(async () => {
            await supabase.auth.signOut();
            showAuthSection();
            showMessage('loginMessage', 'Password cambiata! Accedi con la nuova password.', 'success');
        }, 2000);
    }
}

async function logout() {
    await supabase.auth.signOut();
    showAuthSection();
}

// ==================== GESTIONE RESET PASSWORD COMPLETA ====================
async function handlePasswordReset() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const type = urlParams.get('type');
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (type === 'recovery' && accessToken) {
        // Se è un ritorno dal reset password, mostra il form per cambiare password
        try {
            // Imposta la sessione temporanea
            const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });
            
            if (!error) {
                // Mostra il form per cambiare password
                showChangePasswordSection();
                // Pulisci l'URL
                window.location.hash = '';
            } else {
                throw error;
            }
        } catch (error) {
            showAuthSection();
            showMessage('loginMessage', 'Link di reset non valido o scaduto', 'error');
        }
    }
}

// ==================== INIZIALIZZAZIONE ====================
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    handlePasswordReset(); // Gestisce il ritorno dal reset password
    
    // Enter key per i form
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
    
    document.getElementById('regConfirm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') register();
    });
    
    document.getElementById('resetEmail').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') resetPassword();
    });
    
    document.getElementById('confirmNewPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') changePassword();
    });
});

// Ascolta cambiamenti di autenticazione
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        // Se l'utente si logga ma siamo nella sezione cambio password, non mostrare i download
        if (!document.getElementById('changePasswordSection').classList.contains('hidden')) {
            return;
        }
        showUserSection(session.user.email);
    } else if (event === 'SIGNED_OUT') {
        showAuthSection();
    }
});
