const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("registerForm");
const status = document.getElementById("status");
const downloadSection = document.getElementById("downloadSection");
const pdfList = document.getElementById("pdfList");

// Apri/chiudi modal
openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// PDF (da aggiornare dopo)
const pdfs = [
  { name: "Fanta Venezia - Regolamento.pdf", link: "https://drive.google.com/uc?export=download&id=1iZwtWh7W_U4YzYeAAucUB_5LBFcHJRj1" },
  { name: "Termini e Condizioni - Fantacalcio Venezia.pdf", link: "https://drive.google.com/uc?export=download&id=1iZwtWh7W_U4YzYeAAucUB_5LBFcHJRj1" },
  ];

// Invia form (da configurare al prossimo passo)
form.onsubmit = async (e) => {
  e.preventDefault();
  status.textContent = "Invio in corso...";

  const formData = new FormData(form);
  try {
    const res = await fetch("https://formspree.io/f/xkgkwppk", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      status.innerHTML = "<span style='color:green'>Registrazione completata!</span>";
      modal.style.display = "none";
      showDownloads();
    } else {
      status.innerHTML = "<span style='color:red'>Errore. Riprova.</span>";
    }
  } catch (err) {
    status.innerHTML = "<span style='color:red'>Errore di rete.</span>";
  }
};

function showDownloads() {
  downloadSection.classList.remove("hidden");
  if (pdfs.length === 0) {
    pdfList.innerHTML = "<li>Nessun PDF disponibile al momento.</li>";
  } else {
    pdfs.forEach(pdf => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${pdf.link}" target="_blank">${pdf.name}</a>`;
      pdfList.appendChild(li);
    });
  }

}


