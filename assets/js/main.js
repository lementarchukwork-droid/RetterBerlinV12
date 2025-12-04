document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // mobile nav
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // cookie banner
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");

  const COOKIE_KEY = "retter_cookie_consent";

  function hideBanner() {
    if (cookieBanner) cookieBanner.style.display = "none";
  }

  function showBanner() {
    if (cookieBanner) cookieBanner.style.display = "flex";
  }

  try {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      showBanner();
    }
  } catch (e) {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      try {
        localStorage.setItem(COOKIE_KEY, "accepted");
      } catch (e) {}
      hideBanner();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      try {
        localStorage.setItem(COOKIE_KEY, "declined");
      } catch (e) {}
      hideBanner();
    });
  }

  // contact form submit binding
  const CONTACT_FORM_ID = "contactForm";
  const form = document.getElementById(CONTACT_FORM_ID);
  if (form) {
    form.addEventListener("submit", handleFormSubmission);
  }
});

// --- Modal Functions ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const content = modal.querySelector("[data-modal-content]");
  if (!content) return;

  modal.classList.remove("hidden");

  setTimeout(() => {
    content.classList.remove("scale-95", "opacity-0");
    content.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const content = modal.querySelector("[data-modal-content]");
  if (!content) return;

  content.classList.remove("scale-100", "opacity-100");
  content.classList.add("scale-95", "opacity-0");

  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

// --- Form Submission Logic with Telegram Integration ---
const TELEGRAM_BOT_TOKEN = "8420693302:AAHyYTKIKhbpBdN19zzSK4kxJapMWPZwipI";
const TELEGRAM_CHAT_ID = "7512603920";

async function handleFormSubmission(e) {
  e.preventDefault();

  const form = document.getElementById("contactForm");
  if (!form) return;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();
  const privacy = document.getElementById("privacy").checked;

  if (!name || !phone || !privacy) {
    openModal("errorModal");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHtml = submitBtn.innerHTML;

  submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Wird gesendet...';
  submitBtn.disabled = true;
  submitBtn.classList.add("btn-disabled");

  try {
    const telegramMessage = `
🔑 NEUE ANFRAGE - Schlüsseldienst Berlin

👤 Name: ${name}
📞 Telefon: ${phone}
💬 Nachricht: ${message || "Keine Nachricht"}
⏰ Zeit: ${new Date().toLocaleString("de-DE")}

🚨 BITTE SOFORT ZURÜCKRUFEN! 🚨
    `.trim();

    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
      }),
    });

    const result = await response.json();

    if (result.ok) {
      openModal("successModal");
      form.reset();
    } else {
      console.error("Telegram API Error:", result);
      throw new Error("Telegram API Fehler");
    }
  } catch (error) {
    console.error("Sende-Fehler:", error);
    openModal("errorModal");
  } finally {
    submitBtn.innerHTML = originalHtml;
    submitBtn.disabled = false;
    submitBtn.classList.remove("btn-disabled");
  }
}

// close modal on overlay click
window.addEventListener("click", function (event) {
  const successModal = document.getElementById("successModal");
  const errorModal = document.getElementById("errorModal");

  if (event.target === successModal) {
    closeModal("successModal");
  } else if (event.target === errorModal) {
    closeModal("errorModal");
  }
});


// FAQ Toggle
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      faqItems.forEach((i) => i.classList.remove('active'));
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
