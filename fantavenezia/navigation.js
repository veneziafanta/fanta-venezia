// VARIABILI GLOBALI
let currentUser = null;

// PER GITHUB PAGES - Definisci il percorso base
const BASE_PATH = window.location.hostname.includes('github.io') 
    ? '/fanta-venezia/'  // NOME DEL TUO REPOSITORY
    : '/';

// CARICA UNA PAGINA DINAMICAMENTE
async function loadPage(pageName) {
    try {
        console.log(`🚀 Caricamento: ${pageName}`);
        
        // Mostra loader
        document.getElementById('app').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Caricamento ${pageName}...</p>
            </div>
        `;
        
        // PERCORSI DA PROVARE (per GitHub Pages)
        const pathsToTry = [
            `pages/${pageName}.html`,                    // Cartella pages
            `${pageName}.html`,                          // Radice
            `${BASE_PATH}pages/${pageName}.html`,        // Con base path
            `${BASE_PATH}${pageName}.html`               // Pagina nella radice
        ];
        
        let html = '';
        let success = false;
        
        // Prova tutti i percorsi
        for (let i = 0; i < pathsToTry.length; i++) {
            try {
                const path = pathsToTry[i];
                console.log(`🔍 Provando: ${path}`);
                
                const response = await fetch(path);
                
                if (response.ok) {
                    html = await response.text();
                    success = true;
                    console.log(`✅ Trovato su: ${path}`);
                    break;
                }
            } catch (err) {
                // Continua con il prossimo percorso
                continue;
            }
        }
        
        if (!success) {
            throw new Error(`Pagina ${pageName} non trovata`);
        }
        
        // Inserisci HTML nella pagina
        document.getElementById('app').innerHTML = html;
        
        // Aggiorna URL (senza ricaricare la pagina)
        window.history.pushState({ page: pageName }, '', `#${pageName}`);
        
        // Inizializza eventi della pagina
        initPageEvents(pageName);
        
    } catch (error) {
        console.error('❌ Errore caricamento pagina:', error);
        
        // Mostra errore
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>⚠️ Errore</h1>
                    <p>Pagina non disponibile</p>
                </div>
                <div class="content" style="text-align: center; padding: 50px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">😕</div>
                    <h3>Impossibile caricare la pagina</h3>
                    <p style="margin: 20px 0;">${error.message}</p>
                    <button class="btn" onclick="goToAuth()" style="margin-top: 20px;">
                        ← Torna al Login
                    </button>
                </div>
            </div>
        `;
    }
}

// INIZIALIZZA EVENTI PER PAGINA
function initPageEvents(pageName) {
    console.log(`🎬 Inizializzando eventi per: ${pageName}`);
    
    switch(pageName) {
        case 'auth':
            initAuthPage();
            break;
        case 'dashboard':
            initDashboardPage();
            break;
        case 'download':
            initDownloadPage();
            break;
        case 'iscrizione':
            initIscrizionePage();
            break;
        case 'albo-oro':
            initAlboOroPage();
            break;
        case 'partecipanti':
            initPartecipantiPage();
            break;
        case 'staff':
            initStaffPage();
            break;
        case 'quota':
            initQuotaPage();
            break;
        case 'donazioni':
            initDonazioniPage();
            break;
    }
}

// FUNZIONI DI NAVIGAZIONE
function goToDashboard() { loadPage('dashboard'); }
function goToAuth() { loadPage('auth'); }
function goToDownload() { loadPage('download'); }
function goToIscrizione() { loadPage('iscrizione'); }
function goToAlboOro() { loadPage('albo-oro'); }
function goToPartecipanti() { loadPage('partecipanti'); }
function goToStaff() { loadPage('staff'); }
function goToQuota() { loadPage('quota'); }
function goToDonazioni() { loadPage('donazioni'); }
function goToStagione2526() { loadPage('stagione-2526'); }
function goToListaPartecipanti() { loadPage('lista-partecipanti'); }
function goBack() { window.history.back(); }

// GESTIONE HISTORY
window.addEventListener('popstate', function(event) {
    const page = window.location.hash.substring(1) || 'auth';
    loadPage(page);
});

// UTILITY
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div class="message error" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;">
            ${message}
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}