// VARIABILI GLOBALI
let currentUser = null;

// CARICA UNA PAGINA DINAMICAMENTE
async function loadPage(pageName) {
    try {
        console.log(`Caricamento pagina: ${pageName}`);
        
        // Mostra loader
        document.getElementById('app').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Caricamento...</p>
            </div>
        `;
        
        // Carica HTML della pagina
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`Pagina ${pageName} non trovata`);
        
        const html = await response.text();
        document.getElementById('app').innerHTML = html;
        
        // Aggiorna URL (per deep linking)
        window.location.hash = `#${pageName}`;
        
        // Inizializza eventi specifici della pagina
        initPageEvents(pageName);
        
    } catch (error) {
        console.error('Errore caricamento pagina:', error);
        showError('Errore nel caricamento della pagina');
    }
}

// INIZIALIZZA EVENTI PER PAGINA
function initPageEvents(pageName) {
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

// NAVIGAZIONE PAGINE (funzioni pubbliche)
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

// TORNA INDIETRO
function goBack() {
    const history = window.location.hash.split('/');
    if (history.length > 1) {
        loadPage(history[history.length - 2]);
    } else {
        goToDashboard();
    }
}

// UTILITY
function showError(message) {
    document.getElementById('app').innerHTML = `
        <div class="error-container">
            <h2>❌ Errore</h2>
            <p>${message}</p>
            <button class="btn" onclick="goToAuth()">Torna al Login</button>
        </div>
    `;
}

// GESTIONE URL/HASH
window.addEventListener('hashchange', () => {
    const page = window.location.hash.substring(1) || 'auth';
    loadPage(page);
});