// ==================== CONFIGURAZIONE ====================
const supabaseUrl = 'https://norfhoxpzdnbainkbwlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcmZob3hwemRuYmFpbmtid2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDY4MzUsImV4cCI6MjA3ODM4MjgzNX0.SPP1DnlpnRMPVtEDir1pb74tGfMqNzxeIqMGSKaVr7A';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Password unica per tutti gli utenti
const UNIVERSAL_PASSWORD = "FantaVenezia";

// ==================== LISTA PDF ====================
const pdfs = [
    { 
        name: "Regolamento - Fantacalcio Venezia.pdf", 
        link: "https://drive.google.com/uc?export=download&id=1iZwtWh7W_U4YzYeAAucUB_5LBFcHJRj1" 
    },
    { 
        name: "Termini e Condizioni - Fantacalcio Venezia.pdf", 
        link: "https://drive.google.com/uc?export=download&id=1P0_fQiFKq1IjCyEToVT515-Thpc1OtMe" 
    }
];

// ==================== SISTEMA DI AUTENTICAZIONE SEMPLIFICATO ====================
async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Mostra messaggio di caricamento
    showMessage('loginMessage', '🔐 Verifica in corso...', 'success');
    
    // Controlla che i campi siano compilati
    if (!username) {
        showMessage('loginMessage', '❌ Inserisci il tuo username', 'error');
        return;
    }
    
    if (!password) {
        showMessage('loginMessage', '❌ Inserisci la password', 'error');
        return;
    }
    
    // Controlla la password unica
    if (password !== UNIVERSAL_PASSWORD) {
        showMessage('loginMessage', '❌ Password non valida', 'error');
        return;
    }
    
    try {
        // Cerca l'utente nella tabella "utenti" di Supabase
        const { data, error } = await supabase
            .from('utenti')
            .select('*')
            .eq('username', username.toLowerCase())
            .single();
        
        if (error || !data) {
            showMessage('loginMessage', '❌ Username non trovato. Contatta lo staff.', 'error');
            return;
        }
        
        // Salva i dati dell'utente in localStorage
        localStorage.setItem('fantavenezia_user', JSON.stringify({
            username: data.username,
            nome_completo: data.nome_completo,
            email: data.email,
            squadra: data.squadra,
            data_registrazione: data.data_registrazione
        }));
        
        // Mostra messaggio di successo
        showMessage('loginMessage', '✅ Accesso riuscito!', 'success');
        
        // Mostra la sezione utente dopo 1 secondo
        setTimeout(() => {
            showUserSection(data.nome_completo, data.username);
        }, 1000);
        
    } catch (error) {
        console.error('Errore durante il login:', error);
        showMessage('loginMessage', '❌ Errore di sistema. Riprova più tardi.', 'error');
    }
}

function showUserSection(nomeCompleto, username) {
    hideAllSections();
    document.getElementById('userSection').classList.remove('hidden');
    
    // Personalizza il messaggio di benvenuto
    document.getElementById('welcomeMessage').textContent = `👋 Benvenuto ${nomeCompleto || username}!`;
    document.getElementById('userDisplayName').textContent = `Accesso come: ${username}`;
}

function showAuthSection() {
    hideAllSections();
    document.getElementById('authSection').classList.remove('hidden');
    
    // Pulisci i campi del form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    
    // Pulisci i messaggi
    clearMessages();
}

function logout() {
    // Rimuovi i dati dalla localStorage
    localStorage.removeItem('fantavenezia_user');
    
    // Torna alla schermata di login
    showAuthSection();
}

// ==================== GESTIONE NAVIGAZIONE ====================
function hideAllSections() {
    const sections = [
        'authSection', 'userSection', 'downloadPage', 'iscrizioneSection', 
        'alboOroPage', 'stagione2526Page', 'partecipantiPage',
        'listaPartecipanti2526Page', 'staffPage', 'quotaIscrizionePage', 'donazioniPage'
    ];
    sections.forEach(section => {
        document.getElementById(section)?.classList.add('hidden');
    });
}

function showDownloadPage() {
    hideAllSections();
    document.getElementById('downloadPage').classList.remove('hidden');
}

function showIscrizionePage() {
    hideAllSections();
    document.getElementById('iscrizioneSection').classList.remove('hidden');
    document.getElementById('iscrizioneForm').reset();
    aggiornaBottoneIscrizione();
}

function showAlboOroPage() {
    hideAllSections();
    document.getElementById('alboOroPage').classList.remove('hidden');
}

function showPartecipantiPage() {
    hideAllSections();
    document.getElementById('partecipantiPage').classList.remove('hidden');
}

function mostraStaff() {
    hideAllSections();
    document.getElementById('staffPage').classList.remove('hidden');
}

function mostraQuotaIscrizione() {
    hideAllSections();
    document.getElementById('quotaIscrizionePage').classList.remove('hidden');
}

function mostraDonazioni() {
    hideAllSections();
    document.getElementById('donazioniPage').classList.remove('hidden');
}

// Funzioni di navigazione secondarie
function mostraStagione2526() {
    hideAllSections();
    document.getElementById('stagione2526Page').classList.remove('hidden');
}

function tornaAdAlboOro() {
    hideAllSections();
    document.getElementById('alboOroPage').classList.remove('hidden');
}

function mostraListaPartecipanti2526() {
    hideAllSections();
    document.getElementById('listaPartecipanti2526Page').classList.remove('hidden');
}

function tornaAPartecipanti() {
    hideAllSections();
    document.getElementById('partecipantiPage').classList.remove('hidden');
}

// ==================== FUNZIONI UTILITY ====================
function downloadDocument(pdf) {
    const link = document.createElement('a');
    link.href = pdf.link;
    link.download = pdf.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function apriClassificheLive() {
    window.open('https://leghe.fantacalcio.it/fantaferroviavenezia?id=428212', '_blank');
}

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
}

function clearMessages() {
    const messages = ['loginMessage', 'registerMessage', 'resetMessage', 'changePasswordMessage', 'iscrizioneMessage'];
    messages.forEach(msg => {
        document.getElementById(msg)?.classList.add('hidden');
    });
}

// ==================== FUNZIONI ISCRIZIONE ====================
function aggiornaBottoneIscrizione() {
    const nome = document.getElementById('nome').value.trim();
    const cognome = document.getElementById('cognome').value.trim();
    const nomeSquadra = document.getElementById('nomeSquadra').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const termini = document.getElementById('termini').checked;
    const bottone = document.getElementById('inviaIscrizione');
    
    const formCompleto = nome && cognome && nomeSquadra && telefono && termini;
    
    if (formCompleto) {
        bottone.disabled = false;
        bottone.style.background = '#28a745';
    } else {
        bottone.disabled = true;
        bottone.style.background = '#6c757d';
    }
}

async function getCurrentUserEmail() {
    const userData = JSON.parse(localStorage.getItem('fantavenezia_user') || '{}');
    return userData.email || 'Email non disponibile';
}

async function inviaIscrizione(event) {
    if (event) event.preventDefault();
    
    const bottone = document.getElementById('inviaIscrizione');
    const messaggio = document.getElementById('iscrizioneMessage');
    
    bottone.disabled = true;
    bottone.textContent = 'INVIO IN CORSO...';
    bottone.style.background = '#6c757d';
    
    try {
        const userData = JSON.parse(localStorage.getItem('fantavenezia_user') || '{}');
        const userEmail = userData.email || '';
        
        const datiIscrizione = {
            nome: document.getElementById('nome').value.trim(),
            cognome: document.getElementById('cognome').value.trim(),
            nome_squadra: document.getElementById('nomeSquadra').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: userEmail,
            data_iscrizione: new Date().toLocaleString('it-IT'),
            stagione: '2026/2027'
        };
        
        console.log('Dati da salvare:', datiIscrizione);
        
        // 1. SALVA SU SUPABASE
        const { data, error } = await supabase
            .from('iscrizioni')
            .insert([datiIscrizione]);
        
        if (error) throw error;

        // 2. INVIA L'EMAIL A STAFF
        try {
            // Inizializza EmailJS se non già fatto
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS non caricato');
            } else {
                await emailjs.send('service_eh1l8ai', 'template_bqk6pxy', {
                    to_email: 'veneziafanta@gmail.com',
                    from_name: `${datiIscrizione.nome} ${datiIscrizione.cognome}`,
                    nome: datiIscrizione.nome,
                    cognome: datiIscrizione.cognome,
                    nome_squadra: datiIscrizione.nome_squadra,
                    telefono: datiIscrizione.telefono,
                    email_utente: datiIscrizione.email,
                    data_iscrizione: datiIscrizione.data_iscrizione,
                    stagione: datiIscrizione.stagione,
                    subject: `Nuova Iscrizione Stagione ${datiIscrizione.stagione} - ${datiIscrizione.nome} ${datiIscrizione.cognome}`
                });
                
                console.log('Email inviata con successo a veneziafanta@gmail.com');
            }
            
        } catch (emailError) {
            console.error('Errore invio email:', emailError);
        }

        // 3. MOSTRA MESSAGGIO DI SUCCESSO
        messaggio.innerHTML = `
            <div style="text-align: center; padding: 15px;">
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h3 style="color: #155724; margin-bottom: 15px;">Iscrizione Confermata!</h3>
                <p style="margin-bottom: 10px;">
                    <strong>La tua richiesta per la stagione ${datiIscrizione.stagione} è stata registrata con successo.</strong>
                </p>
                <p style="margin-bottom: 5px;">
                    📋 <strong>Dati inseriti:</strong><br>
                    - Nome: ${datiIscrizione.nome} ${datiIscrizione.cognome}<br>
                    - Squadra: ${datiIscrizione.nome_squadra}<br>
                    - Telefono: ${datiIscrizione.telefono}<br>
                    - Email: ${datiIscrizione.email}
                </p>
                <p style="margin-top: 15px; padding: 12px; background: #e7f3ff; border-radius: 8px;">
                    <strong>🚀 Prossimi passi:</strong><br>
                    Una volta effettuato il pagamento della quota stagionale,<br>
                    <strong>riceverai un messaggio WhatsApp di conferma dallo Staff entro 24/48 ore.</strong>
                </p>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                    Verrai reindirizzato alla home page tra 15 secondi...
                </p>
            </div>
        `;
        messaggio.className = 'message success';
        messaggio.classList.remove('hidden');
        
        // RESET MANUALE DEI CAMPI
        document.getElementById('nome').value = '';
        document.getElementById('cognome').value = '';
        document.getElementById('nomeSquadra').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('termini').checked = false;
        aggiornaBottoneIscrizione();
        
        // Reindirizza alla home dopo 15 secondi
        setTimeout(() => {
            showUserSection();
        }, 15000);
        
    } catch (error) {
        console.error('Errore durante l\'iscrizione:', error);
        messaggio.innerHTML = `
            <div style="text-align: center; padding: 15px;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <h3 style="color: #721c24; margin-bottom: 10px;">Errore durante la registrazione</h3>
                <p>Si è verificato un problema: ${error.message}</p>
                <p style="margin-top: 15px; font-size: 14px;">
                    Se il problema persiste, contatta lo Staff tramite la sezione "STAFF".
                </p>
            </div>
        `;
        messaggio.className = 'message error';
        messaggio.classList.remove('hidden');
        
        // Riabilita il bottone
        bottone.disabled = false;
        bottone.textContent = 'INVIA ISCRIZIONE';
        aggiornaBottoneIscrizione();
    }
}

// ==================== MODAL TERMINI E CONDIZIONI ====================
function apriTermini() {
    document.getElementById('terminiModal').style.display = 'block';
    caricaTermini();
}

function chiudiTermini() {
    document.getElementById('terminiModal').style.display = 'none';
}

function caricaTermini() {
    const terminiContent = document.getElementById('terminiContent');
    terminiContent.innerHTML = `
        <iframe 
            src="https://drive.google.com/file/d/1P0_fQiFKq1IjCyEToVT515-Thpc1OtMe/preview" 
            width="100%" 
            height="500" 
            style="border: none; border-radius: 8px;"
            allow="autoplay"
        ></iframe>
    `;
}

// ==================== INIZIALIZZAZIONE ====================
document.addEventListener('DOMContentLoaded', function() {
    // Controlla se l'utente è già loggato
    const userData = localStorage.getItem('fantavenezia_user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            showUserSection(user.nome_completo, user.username);
        } catch (error) {
            // Se ci sono errori, mostra la schermata di login
            showAuthSection();
        }
    } else {
        showAuthSection();
    }
    
    // Aggiungi listener per il tasto Enter
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
    
    document.getElementById('loginUsername').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
    
    // Event listeners per form iscrizione
    const iscrizioneInputs = ['nome', 'cognome', 'nomeSquadra', 'telefono'];
    iscrizioneInputs.forEach(input => {
        document.getElementById(input).addEventListener('input', aggiornaBottoneIscrizione);
    });
    document.getElementById('termini').addEventListener('change', aggiornaBottoneIscrizione);

    // Click outside modal
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('terminiModal');
        if (e.target === modal) {
            chiudiTermini();
        }
    });
});
