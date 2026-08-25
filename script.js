const pages = [
  { image: "assets/luar_depan.webp", alt: "Sampul depan undangan" },
  { image: "assets/luar_belakang.webp", alt: "Bagian belakang undangan" },
  { image: "assets/dalam.webp", alt: "Bagian dalam undangan" },
  { image: "assets/dalam_isi.webp", alt: "Isi undangan" }
];

let current = 0;
let busy = false;

const book = document.getElementById("book");
const pageImage = document.getElementById("pageImage");
const recipient = document.getElementById("recipient");
const hint = document.getElementById("hint");
const stepText = document.getElementById("stepText");

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[ch]));
}

function getRecipient() {
  const params = new URLSearchParams(location.search);
  return (params.get("to") || "").trim();
}

const name = getRecipient();

if (name) {
  recipient.innerHTML = escapeHTML(name);
} else {
  recipient.textContent = "";
}

function updateUI() {
  stepText.textContent = `${current + 1} / ${pages.length}`;

  hint.textContent =
    current === 0 ? "Ketuk untuk membuka" :
    current === pages.length - 1 ? "Ketuk untuk kembali" :
    "Ketuk untuk lanjut";

  // Nama tamu hanya tampil di halaman pertama
  if (name && current === 0) {
    recipient.style.display = "";
    recipient.setAttribute("aria-hidden", "false");
  } else {
    recipient.style.display = "none";
    recipient.setAttribute("aria-hidden", "true");
  }
}

function nextPage() {
  if (busy) return;

  // At the final page, a tap returns to the cover.
  const next = current < pages.length - 1 ? current + 1 : 0;

  busy = true;

  book.classList.remove("turn-in", "turn-out");
  void book.offsetWidth;
  book.classList.add("turn-out");

  setTimeout(() => {
    pageImage.src = pages[next].image;
    pageImage.alt = pages[next].alt;
    current = next;

    updateUI();

    book.classList.remove("turn-out");
    book.classList.add("turn-in");

    setTimeout(() => {
      book.classList.remove("turn-in");
      busy = false;
    }, 390);
  }, 370);
}

book.addEventListener("click", nextPage);

book.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    nextPage();
  }
});

updateUI();
