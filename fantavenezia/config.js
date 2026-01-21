// CONFIGURAZIONI GLOBALI
const CONFIG = {
    // Supabase
    supabaseUrl: 'https://norfhoxpzdnbainkbwlw.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcmZob3hwemRuYmFpbmtid2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDY4MzUsImV4cCI6MjA3ODM4MjgzNX0.SPP1DnlpnRMPVtEDir1pb74tGfMqNzxeIqMGSKaVr7A',
    
    // EmailJS
    emailjsKey: 'Q43lIRoGk8Gy3AuET',
    emailjsService: 'service_eh1l8ai',
    emailjsTemplate: 'template_bqk6pxy',
    
    // PDF
    pdfs: [
        { 
            name: "Regolamento - Fantacalcio Venezia.pdf", 
            link: "https://drive.google.com/uc?export=download&id=1iZwtWh7W_U4YzYeAAucUB_5LBFcHJRj1" 
        },
        { 
            name: "Termini e Condizioni - Fantacalcio Venezia.pdf", 
            link: "https://drive.google.com/uc?export=download&id=1P0_fQiFKq1IjCyEToVT515-Thpc1OtMe" 
        }
    ],
    
    // URL
    redirectUrl: 'https://veneziafanta.github.io/fanta-venezia/',
    classificheUrl: 'https://leghe.fantacalcio.it/fantaferroviavenezia?id=428212'
};

// Inizializza Supabase
const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// Inizializza EmailJS
emailjs.init(CONFIG.emailjsKey);