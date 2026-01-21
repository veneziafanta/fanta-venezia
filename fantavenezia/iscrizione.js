// INIZIALIZZA PAGINA ISCRIZIONE
function initIscrizionePage() {
    if (!currentUser) {
        showMessage('iscrizioneMessage', 'Devi essere loggato per iscriverti', 'error');
        setTimeout(() => goToAuth(), 2000);
        return;
    }
    
    // Aggiorna bottone in tempo reale
    const inputs = ['nome', 'cognome', 'nomeSquadra', 'telefono', 'termini'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateIscrizioneButton);
            element.addEventListener('change', updateIscrizioneButton);
        }
    });
    
    // Setup form
    updateIscrizioneButton();
}

// AGGIORNA STATO BOTTONE ISCRIZIONE
function updateIscrizioneButton() {
    const nome = document.getElementById('nome')?.value.trim() || '';
    const cognome = document.getElementById('cognome')?.value.trim() || '';
    const nomeSquadra = document.getElementById('nomeSquadra')?.value.trim() || '';
    const telefono = document.getElementById('telefono')?.value.trim() || '';
    const termini = document.getElementById('termini')?.checked || false;
    
    const button = document.getElementById('inviaIscrizione');
    if (!button) return;
    
    const isValid = nome && cognome && nomeSquadra && telefono && termini;
    
    button.disabled = !isValid;
    button.style.background = isValid ? '#28a745' : '#6c757d';
}

// INVIA ISCRIZIONE
async function inviaIscrizione(event) {
    if (event) event.preventDefault();
    
    const button = document.getElementById('inviaIscrizione');
    const messageDiv = document.getElementById('iscrizioneMessage');
    
    // Disabilita bottone durante invio
    button.disabled = true;
    button.innerHTML = '⏳ INVIO IN CORSO...';
    button.style.background = '#6c757d';
    
    try {
        // Raccogli dati
        const dati = {
            nome: document.getElementById('nome').value.trim(),
            cognome: document.getElementById('cognome').value.trim(),
            nome_squadra: document.getElementById('nomeSquadra').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: currentUser.email,
            data_iscrizione: new Date().toLocaleString('it-IT'),
            stagione: '2026/2027'
        };
        
        console.log('Invio dati iscrizione:', dati);
        
        // 1. Salva su Supabase
        const { data, error } = await supabase
            .from('iscrizioni')
            .insert([dati]);
        
        if (error) throw error;
        
        // 2. Invia email allo staff
        try {
            await emailjs.send(CONFIG.emailjsService, CONFIG.emailjsTemplate, {
                to_email: 'veneziafanta@gmail.com',
                from_name: `${dati.nome} ${dati.cognome}`,
                nome: dati.nome,
                cognome: dati.cognome,
                nome_squadra: dati.nome_squadra,
                telefono: dati.telefono,
                email_utente: dati.email,
                data_iscrizione: dati.data_iscrizione,
                stagione: dati.stagione,
                subject: `Nuova Iscrizione ${dati.stagione} - ${dati.nome} ${dati.cognome}`
            });
            
            console.log('✅ Email inviata a staff');
            
        } catch (emailError) {
            console.warn('⚠️ Email non inviata:', emailError);
            // Continua comunque, non bloccare
        }
        
        // 3. Mostra successo
        messageDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h3 style="color: #155724;">Iscrizione Confermata!</h3>
                <p><strong>${dati.nome} ${dati.cognome}</strong></p>
                <p>Squadra: <strong>${dati.nome_squadra}</strong></p>
                <p>Stagione: <strong>${dati.stagione}</strong></p>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    Riceverai conferma WhatsApp dopo il pagamento.
                </p>
            </div>
        `;
        messageDiv.className = 'message success';
        messageDiv.classList.remove('hidden');
        
        // 4. Reset form
        document.getElementById('nome').value = '';
        document.getElementById('cognome').value = '';
        document.getElementById('nomeSquadra').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('termini').checked = false;
        
        // 5. Torna alla dashboard dopo 8 secondi
        setTimeout(() => {
            goToDashboard();
            showMessage('dashboardMessage', 'Iscrizione completata!', 'success');
        }, 8000);
        
    } catch (error) {
        console.error('❌ Errore iscrizione:', error);
        
        messageDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <h3 style="color: #721c24;">Errore</h3>
                <p>${error.message}</p>
                <p style="margin-top: 10px; font-size: 14px;">
                    Contatta lo staff se il problema persiste.
                </p>
            </div>
        `;
        messageDiv.className = 'message error';
        messageDiv.classList.remove('hidden');
        
        // Riabilita bottone
        button.disabled = false;
        button.innerHTML = 'INVIA ISCRIZIONE';
        updateIscrizioneButton();
    }
}

// MODAL TERMINI
function apriTermini() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'terminiModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="chiudiTermini()">×</span>
            <h3>Termini e Condizioni</h3>
            <iframe src="${CONFIG.pdfs[1].link}" width="100%" height="500" style="border: none;"></iframe>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn" onclick="chiudiTermini()">Chiudi</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function chiudiTermini() {
    const modal = document.getElementById('terminiModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}