// MAIN SCRIPT - AVVIO APPLICAZIONE
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Avvio FantaVenezia...');
    
    // 1. Controlla se c'è una sessione attiva
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
        currentUser = session.user;
        console.log('👤 Utente loggato:', currentUser.email);
        loadPage('dashboard');
    } else {
        console.log('🔒 Nessun utente loggato');
        loadPage('auth');
    }
    
    // 2. Gestione password reset da URL
    handlePasswordResetFromUrl();
    
    // 3. Ascolta cambiamenti autenticazione
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            loadPage('dashboard');
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            loadPage('auth');
        }
    });
});

// GESTIONE PASSWORD RESET DA URL
async function handlePasswordResetFromUrl() {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            try {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: params.get('refresh_token')
                });
                
                if (!error) {
                    showAuthMessage('loginMessage', 'Imposta una nuova password', 'info');
                    window.location.hash = '#auth';
                }
            } catch (error) {
                console.error('Reset password error:', error);
            }
        }
    }
}

// FUNZIONI UTILITY GLOBALI
function showMessage(elementId, text, type = 'info') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = text;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
    
    // Auto-hide dopo 5 secondi
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}

function downloadPDF(pdfIndex) {
    const pdf = CONFIG.pdfs[pdfIndex];
    if (!pdf) return;
    
    window.open(pdf.link, '_blank');
}

function apriClassificheLive() {
    window.open(CONFIG.classificheUrl, '_blank');
}

// ESCAPE HTML (sicurezza)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}