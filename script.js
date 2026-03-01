const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveal() {
  const targets = $$(".reveal");
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  targets.forEach((target) => observer.observe(target));
}

function initParticles() {
  const host = $("#heroParticles");
  if (!host || prefersReducedMotion) return;

  const count = Math.min(42, Math.max(20, Math.floor(window.innerWidth / 40)));

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    dot.className = "particle";
    const size = 2 + Math.random() * 5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${30 + Math.random() * 70}%`;
    dot.style.animationDuration = `${10 + Math.random() * 14}s`;
    dot.style.animationDelay = `${-Math.random() * 12}s`;
    host.appendChild(dot);
  }
}

function initSmoothDemoLink() {
  const trigger = $("[data-scroll-to='demo']");
  const target = $("#demo");
  if (!trigger || !target) return;

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function initPricingToggle() {
  const buttons = $$(".toggle-btn");
  const cards = $$(".price-card");
  if (!buttons.length || !cards.length) return;

  const updatePrices = (mode) => {
    cards.forEach((card) => {
      const value = card.dataset[mode];
      const valueEl = $(".value", card);
      const periodEl = $(".period", card);
      if (!value || !valueEl || !periodEl) return;

      valueEl.textContent = value;
      periodEl.textContent = mode === "monthly" ? "/Monat" : "/Monat*";
    });

    const notes = {
      monthly: {
        starter: "~200 Nachrichten/Tag, 1 Kanal, Basis-Features",
        pro: "~1.000 Nachrichten/Tag, 2 Kanäle, E-Mail, Kalender, Daten",
        business: "~5.000 Nachrichten/Tag, Unlimited, Voice, Bilder, Code"
      },
      yearly: {
        starter: "Jährlich abgerechnet: 190 EUR/Jahr (2 Monate gratis)",
        pro: "Jährlich abgerechnet: 490 EUR/Jahr (2 Monate gratis)",
        business: "Jährlich abgerechnet: 990 EUR/Jahr (2 Monate gratis)"
      }
    };

    cards.forEach((card) => {
      const key = card.dataset.plan;
      const note = $(".billing-note", card);
      if (key && note) {
        note.textContent = notes[mode][key];
      }
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.billing;
      if (!mode) return;

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      updatePrices(mode);
    });
  });
}

function initFaq() {
  const items = $$(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = $(".faq-question", item);
    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((entry) => {
        entry.classList.remove("open");
        const btn = $(".faq-question", entry);
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initDemoChat() {
  const chat = $("#demoChat");
  const typing = $("#typingIndicator");
  const form = $("#demoForm");
  const input = $("#demoInput");

  if (!chat || !typing || !form || !input) return;

  const pushMessage = (role, text) => {
    const line = document.createElement("div");
    line.className = `msg ${role}`;
    line.textContent = text;
    chat.appendChild(line);
    chat.scrollTop = chat.scrollHeight;
  };

  // Initial greeting
  setTimeout(() => {
    typing.classList.add("visible");
    setTimeout(() => {
      typing.classList.remove("visible");
      pushMessage("agent", "Hey! Ich bin eine Demo des XIIM Agents. Was kann ich für dich tun?");
    }, 800);
  }, 500);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    pushMessage("user", text);
    input.value = "";

    // Simulate agent typing
    setTimeout(() => {
      typing.classList.add("visible");

      // Agent response
      setTimeout(() => {
        typing.classList.remove("visible");
        pushMessage("agent", "Das ist eine Demo-Antwort! In der Vollversion würde ich mich jetzt um deine Anfrage kümmern. 😎");
      }, 1200 + Math.random() * 800); // Random delay 1.2s - 2.0s

    }, 400);
  });
}

function initConfigurator() {
  const nameInput = $("#agentName");
  const greeting = $("#configGreeting");
  const response = $("#configResponse");
  const chips = $$(".chip");

  if (!nameInput || !greeting) return;

  const personalities = {
    professional: { greeting: "Guten Tag! Ich bin <strong>%NAME%</strong>. Wie kann ich Ihnen behilflich sein?", response: "Sie haben 3 Termine heute. Um 10:00 das Team-Meeting, 14:00 Kundencall und 16:30 Review. Soll ich die Agenda vorbereiten?" },
    friendly: { greeting: "Hey! 😊 Ich bin <strong>%NAME%</strong>! Was kann ich für dich tun?", response: "Du hast heute 3 Termine — aber erstmal: vergiss nicht genug Wasser zu trinken! ☕ Soll ich dir die Übersicht schicken?" },
    witty: { greeting: "Na, wer hat hier nach einem Genie gefragt? Ich bin <strong>%NAME%</strong>. Schieß los.", response: "3 Termine. 47 ungelesene Mails. Und du fragst mich was ansteht? Alles. Alles steht an. 😏" },
    chill: { greeting: "Yo, ich bin <strong>%NAME%</strong>. Was geht? ✌️", response: "3 Termine heute, easy. Erstes erst um 10 — du hast noch Zeit für Kaffee. ☕" }
  };

  let currentPersonality = "professional";

  function updatePreview() {
    const name = nameInput.value.trim() || "Dein Agent";
    const p = personalities[currentPersonality];
    greeting.innerHTML = p.greeting.replace("%NAME%", name);
    response.innerHTML = p.response;
  }

  nameInput.addEventListener("input", updatePreview);

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentPersonality = chip.dataset.personality;
      updatePreview();
    });
  });
}

function initMobileFeatureTabs() {
  if (window.innerWidth > 480) return;

  const featuresSection = $("#features .container");
  if (!featuresSection) return;

  const categories = $$(".feature-category", featuresSection);
  if (!categories.length) return;

  const tabLabels = ["💬 Messaging", "📅 Produktivität", "📄 Dokumente", "⏰ Proaktiv", "🚀 Power"];

  const tabBar = document.createElement("div");
  tabBar.className = "mobile-category-tabs";

  categories.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "mobile-cat-tab" + (i === 0 ? " active" : "");
    btn.textContent = tabLabels[i] || cat.querySelector(".category-title")?.textContent || `Tab ${i + 1}`;
    btn.addEventListener("click", () => {
      $$(".mobile-cat-tab", tabBar).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      categories.forEach(c => c.classList.remove("mobile-active"));
      cat.classList.add("mobile-active");
      // Ensure reveal visible
      $$(".reveal", cat).forEach(el => el.classList.add("visible"));
    });
    tabBar.appendChild(btn);
  });

  // Insert before first category
  categories[0].parentNode.insertBefore(tabBar, categories[0]);
  categories[0].classList.add("mobile-active");
}

// Re-init on resize
let mobileTabsInitialized = false;
function checkMobileTabs() {
  if (window.innerWidth <= 480 && !mobileTabsInitialized) {
    initMobileFeatureTabs();
    mobileTabsInitialized = true;
  }
}

function initBurger() {
  const btn = $("#burgerBtn");
  const nav = $("#navLinks");
  if (!btn || !nav) return;

  function toggle(open) {
    const isOpen = open ?? !nav.classList.contains("open");
    btn.classList.toggle("open", isOpen);
    nav.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  btn.addEventListener("click", () => toggle());

  // Close on link click
  $$("a", nav).forEach(a => {
    a.addEventListener("click", () => toggle(false));
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) toggle(false);
  });
}

initBurger();
initReveal();
initParticles();
initSmoothDemoLink();
initPricingToggle();
initFaq();
initDemoChat();
initConfigurator();
checkMobileTabs();
window.addEventListener("resize", checkMobileTabs);
