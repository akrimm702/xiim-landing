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
  if (!chat || !typing) return;

  const script = [
    { role: "user", text: "Hey XIIM, ich brauche einen schnellen Start in den Tag." },
    {
      role: "agent",
      text: "Guten Morgen, Leon. Ich habe deinen Kalender gecheckt: 9:30 Sales-Meeting, 13:00 Kunden-Call."
    },
    { role: "user", text: "Bitte recherchiere die wichtigsten AI-Operations-Trends für 2026." },
    {
      role: "agent",
      text: "Läuft. Top 3 Trends: Agentic Workflows, multimodale Automatisierung und sichere On-Prem-Hybridmodelle. Soll ich ein 1-Seiten-Briefing schicken?"
    },
    { role: "user", text: "Ja. Und erinnere mich um 16:45 an den Follow-up." },
    {
      role: "agent",
      text: "Erledigt. Erinnerung ist gesetzt und Briefing in dein Postfach geplant."
    }
  ];

  let index = 0;

  const pushMessage = () => {
    if (index >= script.length) {
      setTimeout(() => {
        chat.textContent = "";
        index = 0;
        pushMessage();
      }, 3000);
      return;
    }

    const { role, text } = script[index];
    typing.classList.add("visible");

    setTimeout(
      () => {
        typing.classList.remove("visible");
        const line = document.createElement("div");
        line.className = `msg ${role}`;
        line.textContent = text;
        chat.appendChild(line);
        chat.scrollTop = chat.scrollHeight;
        index += 1;

        setTimeout(pushMessage, role === "agent" ? 1350 : 900);
      },
      role === "agent" ? 800 : 450
    );
  };

  pushMessage();
}

initReveal();
initParticles();
initSmoothDemoLink();
initPricingToggle();
initFaq();
initDemoChat();
