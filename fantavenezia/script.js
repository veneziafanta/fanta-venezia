// MAIN SCRIPT - AVVIO APPLICAZIONE
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Avvio FantaVenezia su GitHub Pages...');
    
    // Mostra stato caricamento
    console.log('URL attuale:', window.location.href);
    console.log('Base path:', BASE_PATH);
    
    // 1. Controlla se c'è una sessione attiva
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            currentUser = session.user;
            console.log('👤 Utente loggato:', currentUser.email);
            
            // Controlla se c'è un hash nell'URL
            const hashPage = window.location.hash.substring(1);
            if (hashPage) {
                loadPage(hashPage);
            } else {
                loadPage('dashboard');
            }
        } else {
            console.log('🔒 Nessun utente loggato');
            loadPage('auth');
        }
    } catch (error) {
        console.error('Errore controllo sessione:', error);
        loadPage('auth');
    }
    
    // 2. Gestione password reset da URL
    handlePasswordResetFromUrl();
    
    // 3. Ascolta cambiamenti autenticazione
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            if (!window.location.hash.includes('recovery')) {
                loadPage('dashboard');
            }
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            loadPage('auth');
        }
    });
});

// GESTIONE PASSWORD RESET DA URL
async function handlePasswordResetFromUrl() {
    const hash = window.location.hash;
    console.log('Hash URL:', hash);
    
    if (hash.includes('type=recovery')) {
        try {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            
            if (accessToken) {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: params.get('refresh_token')
                });
                
                if (!error) {
                    // Mostra form cambio password
                    loadPage('change-password');
                    // Pulisci hash
                    window.location.hash = '';
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Reset password error:', error);
            showMessage('authMessage', 'Link di reset scaduto o non valido', 'error');
        }
    }
}

// FUNZIONI UTILITY GLOBALI
function showMessage(elementId, text, type = 'info') {
    const element = document.getElementById(elementId);
    if (!element) {
        // Crea elemento se non esiste
        const msgDiv = document.createElement('div');
        msgDiv.id = elementId;
        msgDiv.className = `message ${type}`;
        msgDiv.textContent = text;
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '20px';
        msgDiv.style.left = '50%';
        msgDiv.style.transform = 'translateX(-50%)';
        msgDiv.style.zIndex = '1000';
        document.body.appendChild(msgDiv);
        
        setTimeout(() => msgDiv.remove(), 5000);
        return;
    }
    
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