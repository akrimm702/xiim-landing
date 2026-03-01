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

  const scenarios = {
    executive: {
      stats: { tasks: "12", time: "3.5h", skills: "8" },
      script: [
        { role: "user", text: "Was steht heute an?" },
        { role: "agent", text: "Guten Morgen. 3 Termine: 9:30 Sales-Meeting, 13:00 Kundencall mit Müller GmbH, 16:00 Sprint Review. Ich hab dir die Agenda für 9:30 schon vorbereitet." },
        { role: "user", text: "Checke meine E-Mails. Nur Wichtiges." },
        { role: "agent", text: "2 relevante Mails: Angebot von DataVault braucht Freigabe bis 14 Uhr. Und dein Steuerberater will einen Rückruf. Rest ist Newsletter-Spam — hab ich archiviert." },
        { role: "user", text: "Erinnere mich um 13:50 an den Call und bereite ein Briefing über Müller GmbH vor." },
        { role: "agent", text: "Erinnerung gesetzt. Briefing: Müller GmbH, 340 MA, Automotive-Zulieferer, letzter Kontakt am 12.02. — offene Punkte waren Pricing und Rollout-Timeline. Schick ich dir 10 Min vorher." }
      ]
    },
    research: {
      stats: { tasks: "8", time: "5h", skills: "6" },
      script: [
        { role: "user", text: "Recherchiere den europäischen AI-Agent-Markt 2026. Zahlen und Trends." },
        { role: "agent", text: "Läuft. Erste Ergebnisse: Marktvolumen €4.2 Mrd, +67% YoY. Top-Segmente: Customer Service Agents (38%), Sales Automation (24%), Internal Ops (21%). Soll ich tiefer gehen?" },
        { role: "user", text: "Ja. Vergleich die Top 5 Anbieter und pack das in ein PDF." },
        { role: "agent", text: "Done. PDF mit 5-Seiten-Analyse erstellt: Marktübersicht, Anbietervergleich (Features, Pricing, Stärken/Schwächen), Trend-Prognose 2027. Sende ich dir per Mail oder hier?" },
        { role: "user", text: "Hier. Und tracke den Markt wöchentlich für mich." },
        { role: "agent", text: "📎 AI-Agent-Markt-Europa-2026.pdf — Wöchentliches Monitoring ist eingerichtet. Jeden Montag 8:00 bekommst du ein Update mit neuen Entwicklungen." }
      ]
    },
    creative: {
      stats: { tasks: "15", time: "4h", skills: "10" },
      script: [
        { role: "user", text: "Schreib mir 3 LinkedIn-Posts über AI im Mittelstand. Professionell aber nicht langweilig." },
        { role: "agent", text: "Hier die drei Posts:

1. 🏭 "94% der deutschen Mittelständler sagen: KI ist relevant. 12% nutzen sie. Die Lücke? Kein Tech-Problem — ein Mut-Problem."

2. 📊 "Mein Agent hat heute 47 Mails..."

Soll ich sie einzeln ausarbeiten mit Hashtags?" },
        { role: "user", text: "Post 1 gefällt mir. Mach den fertig mit CTA und generiere ein passendes Bild dazu." },
        { role: "agent", text: "Post ist fertig mit CTA: "Was ist euer erster KI-Use-Case? Kommentiert 👇"

🎨 Bild generiert: Clean Infografik, dunkelblau, mit der 94% vs 12% Statistik. Minimalistisch, LinkedIn-optimiert. Soll ich beides direkt posten?" },
        { role: "user", text: "Zeig mir erst das Bild." },
        { role: "agent", text: "📎 linkedin-ai-mittelstand-v1.png — 1200x627px, LinkedIn-Format. Zwei Varianten: mit und ohne dein Firmenlogo. Passt das oder soll ich was ändern?" }
      ]
    },
    developer: {
      stats: { tasks: "20", time: "6h", skills: "12" },
      script: [
        { role: "user", text: "Check den CI-Status von xiim-platform. Irgendwas rot?" },
        { role: "agent", text: "CI ist grün ✅ Letzter Run: main@a3f291c vor 23 Min. Alle 4 Test-Suites passed (Provisioning, Billing, Lifecycle, Token-Tracker). Coverage bei 87%." },
        { role: "user", text: "Schreib mir eine Migration für ein neues usage_logs Table. Columns: agent_id, tokens_in, tokens_out, timestamp, endpoint." },
        { role: "agent", text: "Migration 002_usage_logs.sql erstellt:

CREATE TABLE usage_logs mit allen Columns, Index auf agent_id+timestamp, Foreign Key auf agents(id). Soll ich den PR direkt aufmachen?" },
        { role: "user", text: "Ja. Und schreib gleich die Tests dazu." },
        { role: "agent", text: "PR #47 ist offen: "feat: usage_logs table + tracking"
— Migration + SQLAlchemy Model + 6 Tests (insert, query by agent, date range filter, aggregation, cleanup, FK constraint). Review-ready." }
      ]
    }
  };

  let currentScenario = "executive";
  let chatTimeout = null;
  let index = 0;

  function updateStats(scenario) {
    const s = scenarios[scenario].stats;
    const tasks = $("#statTasks");
    const time = $("#statTime");
    const skills = $("#statSkills");
    if (tasks) tasks.textContent = s.tasks;
    if (time) time.textContent = s.time;
    if (skills) skills.textContent = s.skills;
  }

  function clearChat() {
    if (chatTimeout) clearTimeout(chatTimeout);
    chat.innerHTML = "";
    index = 0;
  }

  function pushMessage() {
    const script = scenarios[currentScenario].script;
    if (index >= script.length) {
      chatTimeout = setTimeout(() => {
        clearChat();
        pushMessage();
      }, 4000);
      return;
    }

    const { role, text } = script[index];
    typing.classList.add("visible");

    chatTimeout = setTimeout(() => {
      typing.classList.remove("visible");
      const line = document.createElement("div");
      line.className = "msg " + role;
      const textEl = document.createElement("span");
      textEl.className = "msg-text";
      textEl.textContent = text;
      line.appendChild(textEl);
      const time = document.createElement("span");
      time.className = "msg-time";
      const now = new Date();
      time.textContent = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
      line.appendChild(time);
      chat.appendChild(line);
      chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
      index += 1;
      chatTimeout = setTimeout(pushMessage, role === "agent" ? 1800 : 900);
    }, role === "agent" ? 1000 : 450);
  }

  // Init tabs
  const tabs = $$(".usecase-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentScenario = tab.dataset.scenario;
      updateStats(currentScenario);
      clearChat();
      pushMessage();
    });
  });

  updateStats(currentScenario);
  pushMessage();
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

checkMobileTabs();
window.addEventListener("resize", checkMobileTabs);
