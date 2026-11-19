/* D9Legacy chapter interest form.
   Renders the formal Membership Interest Sheet on each chapter's own site.
   Letters are saved in this browser's localStorage under the same key the
   main D9Legacy site uses (d9legacy:d9kids-letters.v1), so a letter sent
   here shows up in the owner inbox on the same device. Nothing leaves
   the device: there is no backend. */
(function () {
  "use strict";
  var cfg = window.D9_INTEREST;
  if (!cfg) return;
  var mount = document.querySelector("[data-d9-interest-form]");
  if (!mount) return;

  var STORE_KEY = "d9legacy:d9kids-letters.v1";
  var GRADE_OPTIONS = ["Kindergarten", "1st grade", "2nd grade", "3rd grade", "4th grade", "5th grade", "6th grade", "7th grade or higher"];
  var BRING_OPTIONS = ["Kindness", "Good grades", "Step moves", "Big ideas", "Teamwork"];
  var LIKE_OPTIONS = ["Service", "History", "Colors", "Famous members", "Step and songs"];
  var INTEREST_OPTIONS = ["Community service", "Leadership", "Black history", "Volunteering", "Events and programs", "Mentoring", "Team activities"];
  var TALENT_OPTIONS = ["Singing", "Stepping", "Drawing", "Sports", "Reading", "Helping others"];
  var HOURS_OPTIONS = ["1 hour", "2-3 hours", "4 or more hours"];
  var SUBJECT_OPTIONS = ["Reading", "Math", "Science", "History", "Art", "Music", "Gym"];
  var FUN_OPTIONS = ["Community clean-up", "Reading buddy", "Step show", "Fundraiser", "Food drive"];
  var HEARD_OPTIONS = ["A friend", "My family", "School", "This website"];
  var PROMISE_OPTIONS = ["Yes, I promise", "I will try my best"];
  var RULES_OPTIONS = ["Yes, I agree", "I need to read the rules again"];

  /* Same five questions the main site's quiz asks, shuffled the same way. */
  function shuffle(items, seed) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = seed * (i + 3) * 7 % (i + 1);
      var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
    }
    return copy;
  }
  var baseQuestions = [
    { question: "When did " + cfg.name + " start?", correct: cfg.founded, others: ["March 3, 1975", "July 4, 1880"] },
    { question: "Where did " + cfg.name + " begin?", correct: cfg.place, others: ["Atlanta, GA", "Chicago, IL"] },
    { question: "What are " + cfg.nickname + "' colors?", correct: cfg.colors, others: ["Orange and silver", "Green and purple"] },
    { question: "Is " + cfg.name + " a fraternity or a sorority?", correct: cfg.kind, others: [cfg.kind === "Fraternity" ? "Sorority" : "Fraternity", "Neither one"] },
    { question: "What do all Divine Nine members promise to do?", correct: "Do well in school and help their communities", others: ["Win every step show", "Keep their colors a secret"] }
  ];
  var questions = baseQuestions.map(function (q, qi) {
    var order = shuffle([0, 1, 2], qi + cfg.letters.length * 5);
    var options = order.map(function (i) { return i === 0 ? q.correct : q.others[i - 1]; });
    return { question: q.question, options: options, answer: order.indexOf(0) };
  });

  var bondWord = cfg.kind === "Fraternity" ? "brotherhood" : "sisterhood";
  var todayStr = new Date().toLocaleDateString();

  var css = `
html,body{overflow-x:clip}
.d9if-doc{--acc:#4b2e83;--acc2:#cfb53b;font-family:'Cormorant Garamond',Georgia,serif;box-sizing:border-box;max-width:860px;margin:0 auto;background:#fffdf8;border:1px solid #e2d9c8;border-radius:10px;box-shadow:0 10px 30px rgba(30,20,15,.08);padding:34px clamp(18px,5vw,52px) 30px;color:#2b2320;font-size:17px;line-height:1.55}
.d9if-doc *{box-sizing:border-box}
.d9if-crest{display:block;width:96px;height:106px;object-fit:contain;margin:0 auto 14px}
.d9if-org{text-align:center;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#7a6a5c}
.d9if-title{text-align:center;font-size:clamp(28px,4.6vw,40px);margin:6px 0 4px;color:var(--acc)}
.d9if-sub{text-align:center;font-size:15px;color:#7a6a5c;margin-bottom:6px}
.d9if-disclaimer{text-align:center;font-size:14px;font-style:italic;color:#8a7a6b;margin:2px 0 0}
.d9if-faith{text-align:center;font-size:15px;color:#7a6a5c;margin:4px 0 10px}
.d9if-hr{border:0;border-top:2px solid var(--acc);margin:14px 0}
.d9if-hr.double{border-top:4px double var(--acc)}
.d9if-kicker{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a7a6b;text-align:center}
.d9if-guide p{margin:8px 0}
.d9if-guide ol{padding-left:1.3em;line-height:1.65}
.d9if-guide li{margin-bottom:8px}
.d9if-foot{font-size:13px;color:#8a7a6b;text-align:center;border-top:1px solid #e2d9c8;margin-top:18px;padding-top:10px}
.d9if-instructions{background:#faf5ea;border:1px solid #e8dec9;border-radius:8px;padding:12px 16px;font-size:15.5px}
.d9if-part{font-size:22px;margin:26px 0 10px;color:var(--acc);border-bottom:1px solid #e8dec9;padding-bottom:6px}
.d9if-blankrow{display:flex;flex-wrap:wrap;gap:18px;margin:12px 0}
.d9if-blank{flex:1 1 200px;display:flex;flex-direction:column;gap:2px}
.d9if-blank.is-wide{flex-basis:100%}
.d9if-blank input{font:inherit;padding:6px 4px;border:0;border-bottom:2px solid #b9a88f;background:transparent;color:#2b2320}
.d9if-blank input:focus{outline:none;border-bottom-color:var(--acc)}
.d9if-blank input.d9if-missing{border-bottom-color:#b3261e;background:#fdf3f2}
.d9if-blank span{font-size:13px;color:#8a7a6b;letter-spacing:.04em}
.d9if-note{font-size:14px;color:#8a7a6b;font-style:italic;margin:6px 0}
.d9if-q{font-weight:600;margin:16px 0 8px}
.d9if-chips{display:flex;flex-wrap:wrap;gap:8px}
.d9if-chip{font:inherit;font-size:15px;padding:8px 14px;border-radius:999px;border:1.5px solid #c9bba6;background:#fff;color:#3a2f28;cursor:pointer}
.d9if-chip:hover{border-color:var(--acc)}
.d9if-chip[data-active]{background:var(--acc);border-color:var(--acc);color:#fff}
.d9if-chip.d9if-right{background:#1e7a34;border-color:#1e7a34;color:#fff}
.d9if-chip.d9if-wrong{background:#b3261e;border-color:#b3261e;color:#fff}
.d9if-quiz{margin:6px 0 2px;padding:12px 14px;border:1px dashed #d8cbb4;border-radius:8px}
.d9if-quiz .d9if-q{margin-top:10px}
.d9if-affirm{background:#faf5ea;border:1px solid #e8dec9;border-radius:8px;padding:12px 16px;font-size:15.5px;margin:14px 0}
.d9if-sigline{display:flex;flex-direction:column;gap:2px;margin:16px 0}
.d9if-sigline .d9if-ruleline{height:26px;border-bottom:2px solid #b9a88f}
.d9if-sigline span{font-size:13px;color:#8a7a6b;letter-spacing:.04em}
.d9if-dateline{font-size:16px;margin:14px 0 0}
.d9if-sendrow{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;margin-top:22px}
.d9if-send{font:inherit;font-size:17px;font-weight:700;padding:12px 30px;border-radius:999px;border:0;background:var(--acc);color:#fff;cursor:pointer}
.d9if-send:hover{filter:brightness(1.12)}
.d9if-send[disabled]{opacity:.45;cursor:not-allowed;filter:none}
.d9if-hint{width:100%;text-align:center;font-size:14px;color:#8a7a6b;margin:8px 0 0}
.d9if-err{color:#b3261e;font-size:14px;text-align:center;width:100%;margin:6px 0 0}
.d9if-sent{max-width:760px;margin:0 auto;background:#fffdf8;border:1px solid #e2d9c8;border-radius:10px;box-shadow:0 10px 30px rgba(30,20,15,.08);padding:34px clamp(18px,5vw,52px);text-align:center;color:#2b2320;font-size:17px;line-height:1.55}
.d9if-sent h3{font-size:clamp(24px,4vw,32px);color:var(--acc);margin:0 0 10px}
.d9if-sent .d9if-small{font-size:14px;color:#8a7a6b}
.d9if-sent .d9if-sendrow a{display:inline-block;font:inherit;font-size:16px;font-weight:600;padding:10px 24px;border-radius:999px;border:1.5px solid var(--acc);color:var(--acc);text-decoration:none}
.d9if-sent .d9if-sendrow a.primary{background:var(--acc);color:#fff}
`;

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var state = {
    name: "", contact: "", grade: "",
    answers: {}, why: "", bring: "", like: "", service: "",
    interests: [], consider: "", bond: "", goals: "", subject: "",
    talent: "", leader: "", helped: "", heroMember: "", motto: "", hours: "", heard: "", funpick: "",
    d9means: "", inspires: "", leadmean: "", represent: "", learned: "", lookUpTo: "", event: "",
    promise: "", rules: "", signed: ""
  };
  var triedSend = false;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function blank(parent, label, key, wide) {
    var wrap = el("div", "d9if-blank" + (wide ? " is-wide" : ""));
    var input = document.createElement("input");
    input.type = "text";
    input.setAttribute("aria-label", label);
    input.maxLength = 120;
    input.value = state[key];
    input.addEventListener("input", function () { state[key] = input.value; });
    wrap.appendChild(input);
    wrap.appendChild(el("span", null, label));
    parent.appendChild(wrap);
    return input;
  }

  function chipRow(parent, label, options, key, onPick) {
    var field = el("div", "d9if-field");
    field.appendChild(el("p", "d9if-q", label));
    var chips = el("div", "d9if-chips");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", label);
    options.forEach(function (option) {
      var chip = el("button", "d9if-chip", option);
      chip.type = "button";
      if (state[key] === option) chip.setAttribute("data-active", "");
      chip.addEventListener("click", function () {
        state[key] = option;
        chips.querySelectorAll(".d9if-chip").forEach(function (c) { c.removeAttribute("data-active"); });
        chip.setAttribute("data-active", "");
        if (onPick) onPick(option);
      });
      chips.appendChild(chip);
    });
    field.appendChild(chips);
    parent.appendChild(field);
  }

  function multiChips(parent, label, options, key) {
    var field = el("div", "d9if-field");
    field.appendChild(el("p", "d9if-q", label));
    var chips = el("div", "d9if-chips");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", label);
    options.forEach(function (option) {
      var chip = el("button", "d9if-chip", option);
      chip.type = "button";
      if (state[key].indexOf(option) !== -1) chip.setAttribute("data-active", "");
      chip.addEventListener("click", function () {
        var at = state[key].indexOf(option);
        if (at === -1) {
          state[key].push(option);
          chip.setAttribute("data-active", "");
        } else {
          state[key].splice(at, 1);
          chip.removeAttribute("data-active");
        }
      });
      chips.appendChild(chip);
    });
    field.appendChild(chips);
    parent.appendChild(field);
  }

  function quizBlock(parent) {
    var quiz = el("div", "d9if-quiz");
    questions.forEach(function (q, qi) {
      var field = el("div", "d9if-quiz-q");
      field.appendChild(el("p", "d9if-q", "Quiz " + (qi + 1) + " of 5: " + q.question));
      var chips = el("div", "d9if-chips");
      chips.setAttribute("role", "group");
      chips.setAttribute("aria-label", q.question);
      q.options.forEach(function (option, oi) {
        var chip = el("button", "d9if-chip", option);
        chip.type = "button";
        if (state.answers[qi] === oi) chip.setAttribute("data-active", "");
        chip.addEventListener("click", function () {
          state.answers[qi] = oi;
          chips.querySelectorAll(".d9if-chip").forEach(function (c) { c.removeAttribute("data-active"); });
          chip.setAttribute("data-active", "");
        });
        chips.appendChild(chip);
      });
      field.appendChild(chips);
      quiz.appendChild(field);
    });
    parent.appendChild(quiz);
  }

  function ready() {
    return state.name.trim() !== "" && state.grade !== "" && state.why.trim() !== "" &&
      state.bring !== "" && state.promise !== "" &&
      questions.every(function (_, i) { return state.answers[i] !== undefined; }) &&
      state.like !== "" && state.service.trim() !== "" && state.signed.trim() !== "" &&
      state.interests.length > 0 &&
      state.consider.trim() !== "" && state.bond.trim() !== "" && state.goals.trim() !== "" &&
      state.subject !== "" &&
      state.talent !== "" && state.leader.trim() !== "" && state.helped.trim() !== "" &&
      state.heroMember.trim() !== "" &&
      state.motto.trim() !== "" && state.hours !== "" && state.heard !== "" && state.funpick !== "" &&
      state.d9means.trim() !== "" && state.inspires.trim() !== "" &&
      state.leadmean.trim() !== "" && state.represent.trim() !== "" &&
      state.learned.trim() !== "" && state.lookUpTo.trim() !== "" && state.event.trim() !== "" &&
      state.rules === "Yes, I agree";
  }

  function send() {
    var score = questions.reduce(function (total, q, i) {
      return total + (state.answers[i] === q.answer ? 1 : 0);
    }, 0);
    var letter = {
      id: "letter-" + Date.now(),
      name: state.name.trim().slice(0, 40),
      group: cfg.name + " (" + cfg.letters + ")",
      why: state.why.trim().slice(0, 300),
      bring: state.bring,
      grade: state.grade,
      contact: state.contact.trim().slice(0, 60),
      promise: state.promise,
      score: score,
      total: questions.length,
      sheet: {
        like: state.like,
        service: state.service.trim().slice(0, 200),
        signed: state.signed.trim().slice(0, 40),
        talent: state.talent,
        leader: state.leader.trim().slice(0, 200),
        helped: state.helped.trim().slice(0, 200),
        subject: state.subject,
        funpick: state.funpick,
        learned: state.learned.trim().slice(0, 200),
        lookUpTo: state.lookUpTo.trim().slice(0, 200),
        event: state.event.trim().slice(0, 200),
        heroMember: state.heroMember.trim().slice(0, 60),
        motto: state.motto.trim().slice(0, 120),
        hours: state.hours,
        heard: state.heard,
        rules: state.rules,
        interests: state.interests.slice(0, 10),
        consider: state.consider.trim().slice(0, 200),
        bond: state.bond.trim().slice(0, 200),
        goals: state.goals.trim().slice(0, 200),
        d9means: state.d9means.trim().slice(0, 200),
        inspires: state.inspires.trim().slice(0, 120),
        leadmean: state.leadmean.trim().slice(0, 200),
        represent: state.represent.trim().slice(0, 200),
        formDate: todayStr
      },
      date: new Date().toLocaleString()
    };
    var letters = [];
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) { var parsed = JSON.parse(raw); if (Array.isArray(parsed)) letters = parsed; }
    } catch (_) { letters = []; }
    letters = [letter].concat(letters).slice(0, 15);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(letters));
    } catch (_) {
      return false;
    }
    return true;
  }

  function renderSent(savedOk) {
    mount.replaceChildren();
    var panel = el("div", "d9if-sent");
    panel.style.setProperty("--acc", cfg.swatches[0]);
    panel.style.setProperty("--acc2", cfg.swatches[1]);
    panel.appendChild(el("h3", null, savedOk ? "Your letter is in the owner inbox!" : "Your letter could not be saved"));
    if (savedOk) {
      panel.appendChild(el("p", null, "Thank you, " + state.name.trim() + "! Your interest sheet for " + cfg.name + " is now waiting in the " + cfg.chapter + " owner inbox. The owner will read it and decide whether to accept it."));
      panel.appendChild(el("p", "d9if-small", "This pretend mailbox lives on this device only. The owner sees the letter when the owner inbox is opened on this same phone, tablet or computer. It does not reach anyone else's device."));
      var row = el("div", "d9if-sendrow");
      var again = el("a", "primary", "Write another letter");
      again.href = "#interest-form";
      again.addEventListener("click", function (e) { e.preventDefault(); reset(); renderForm(); });
      var inbox = el("a", null, "Open the owner inbox");
      inbox.href = "https://d9legacy.github.io/#/inbox";
      row.appendChild(again);
      row.appendChild(inbox);
      panel.appendChild(row);
    } else {
      panel.appendChild(el("p", null, "This browser would not let the site save the letter (storage is full or turned off). Try again, or use the join survey on the main D9Legacy site."));
    }
    mount.appendChild(panel);
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    Object.keys(state).forEach(function (k) {
      state[k] = k === "answers" ? {} : (k === "interests" ? [] : "");
    });
    triedSend = false;
  }

  function renderForm() {
    mount.replaceChildren();
    var doc = el("div", "d9if-doc");
    doc.style.setProperty("--acc", cfg.swatches[0]);
    doc.style.setProperty("--acc2", cfg.swatches[1]);

    var crest = document.createElement("img");
    crest.className = "d9if-crest";
    crest.src = "crest.png";
    crest.alt = cfg.name + " crest";
    if (cfg.crestBg) {
      crest.style.background = cfg.crestBg;
      crest.style.borderRadius = "14px";
      crest.style.padding = "10px";
    }
    doc.appendChild(crest);
    doc.appendChild(el("div", "d9if-org", "D9Legacy " + cfg.chapter));
    doc.appendChild(el("h3", "d9if-title", "Membership Interest Form"));
    doc.appendChild(el("div", "d9if-sub", cfg.name + " \u2022 A fan-made chapter \u2022 Not the real " + cfg.kind.toLowerCase()));
    doc.appendChild(el("div", "d9if-disclaimer", "This is an interest form, not an official membership application."));
    doc.appendChild(el("div", "d9if-faith", "\u271D With Jesus Christ \u271D"));
    doc.appendChild(el("hr", "d9if-hr double"));

    doc.appendChild(el("p", "d9if-kicker", "The Kids D9 \u00B7 A pretend fan club for kids \u00B7 Not the real Divine Nine"));
    var guide = el("div", "d9if-guide");
    guide.appendChild(el("p", null, "Guidelines for the completion and submission of the Membership Interest Form are listed below. A kid who asks to join the " + cfg.chapter + " is not voted on; however, he or she must finish every part of this form."));
    var ol = document.createElement("ol");
    [
      "Type your answers into the blanks. Answer every question and tell the truth - made-up answers may get your letter declined.",
      "Answer the five quiz questions about " + cfg.name + " in Part B, so the owner knows you learned about the group. The quiz never replaces this sheet - you do both.",
      "No grown-up has to sign or say anything. This club is just for kids, and you fill out your own form.",
      "Kids D9 chapters never haze. Members are kind and always lift others up. You promise to do this in the Final Section.",
      "Sign your name at the bottom, then press Send my letter. The date is added for you. Your form goes to the owner inbox, and the owner reads every one."
    ].forEach(function (item) { ol.appendChild(el("li", null, item)); });
    guide.appendChild(ol);
    doc.appendChild(guide);
    doc.appendChild(el("div", "d9if-foot", "D9Legacy Membership Intake Manual - Revised November 2026"));
    doc.appendChild(el("hr", "d9if-hr"));

    var instructions = el("p", "d9if-instructions");
    var strong = el("strong", null, "Instructions: ");
    instructions.appendChild(strong);
    instructions.appendChild(document.createTextNode("This form must be typed, signed, and sent to the " + cfg.chapter + " owner inbox. Any kid who asks to join must answer every question. This is an interest form, not an official membership application - it is a pretend fan club form, not a real sorority or fraternity form."));
    doc.appendChild(instructions);

    doc.appendChild(el("h4", "d9if-part", "Part A - About You"));
    var rowA = el("div", "d9if-blankrow");
    blank(rowA, "First name", "name");
    blank(rowA, "Text number (optional)", "contact");
    doc.appendChild(rowA);
    doc.appendChild(el("p", "d9if-note", "Only put a phone number or iCloud if you're in 4th grade or higher."));
    chipRow(doc, "Grade:", GRADE_OPTIONS, "grade");
    chipRow(doc, "Favorite subject in school:", SUBJECT_OPTIONS, "subject");

    doc.appendChild(el("h4", "d9if-part", "Part B - Your Chapter"));
    var chapLine = el("p", "d9if-q");
    chapLine.appendChild(document.createTextNode("Chapter you want to join: "));
    var chapStrong = el("strong", null, cfg.name + " (" + cfg.letters + ") - " + cfg.chapter);
    chapLine.appendChild(chapStrong);
    doc.appendChild(chapLine);
    quizBlock(doc);
    var rowB = el("div", "d9if-blankrow");
    blank(rowB, "Why do you want to join this chapter?", "why", true);
    doc.appendChild(rowB);
    chipRow(doc, "What do you like most about " + cfg.nickname + "?", LIKE_OPTIONS, "like");
    var rowB2 = el("div", "d9if-blankrow");
    blank(rowB2, "How would you help the community?", "service", true);
    doc.appendChild(rowB2);

    doc.appendChild(el("h4", "d9if-part", "Part C - Your Interests"));
    multiChips(doc, "What are you interested in? Pick all that fit.", INTEREST_OPTIONS, "interests");

    doc.appendChild(el("h4", "d9if-part", "Part D - Membership Questions"));
    var rowD1 = el("div", "d9if-blankrow");
    blank(rowD1, "Why should we consider you?", "consider", true);
    doc.appendChild(rowD1);
    chipRow(doc, "What can you bring to the organization?", BRING_OPTIONS, "bring");
    var rowD2 = el("div", "d9if-blankrow");
    blank(rowD2, "What does " + bondWord + " mean to you?", "bond", true);
    doc.appendChild(rowD2);
    var rowD3 = el("div", "d9if-blankrow");
    blank(rowD3, "What are your goals?", "goals", true);
    doc.appendChild(rowD3);
    chipRow(doc, "How did you hear about us?", HEARD_OPTIONS, "heard");

    doc.appendChild(el("h4", "d9if-part", "Part E - Talents, Time and Heart"));
    chipRow(doc, "What are you best at?", TALENT_OPTIONS, "talent");
    var rowE = el("div", "d9if-blankrow");
    blank(rowE, "Tell us about a time you were a leader", "leader", true);
    doc.appendChild(rowE);
    var rowE1 = el("div", "d9if-blankrow");
    blank(rowE1, "Tell us about a time you helped someone", "helped", true);
    doc.appendChild(rowE1);
    var rowE2 = el("div", "d9if-blankrow");
    blank(rowE2, "Which famous member inspires you, and why?", "heroMember", true);
    doc.appendChild(rowE2);
    var rowE3 = el("div", "d9if-blankrow");
    blank(rowE3, "Write a motto you promise to live by", "motto", true);
    doc.appendChild(rowE3);
    chipRow(doc, "How many hours a week can you help out?", HOURS_OPTIONS, "hours");
    chipRow(doc, "Which of these sounds most fun?", FUN_OPTIONS, "funpick");

    doc.appendChild(el("h4", "d9if-part", "Part F - Extra Questions"));
    var rowF1 = el("div", "d9if-blankrow");
    blank(rowF1, "What does the Divine Nine mean to you?", "d9means", true);
    doc.appendChild(rowF1);
    var rowF2 = el("div", "d9if-blankrow");
    blank(rowF2, "Which organization inspires you most?", "inspires", true);
    doc.appendChild(rowF2);
    var rowF3 = el("div", "d9if-blankrow");
    blank(rowF3, "What does leadership mean to you?", "leadmean", true);
    doc.appendChild(rowF3);
    var rowF4 = el("div", "d9if-blankrow");
    blank(rowF4, "What would you do to represent your organization positively?", "represent", true);
    doc.appendChild(rowF4);
    var rowF5 = el("div", "d9if-blankrow");
    blank(rowF5, "What is one thing you learned about " + cfg.name + " from this website?", "learned", true);
    doc.appendChild(rowF5);
    var rowF6 = el("div", "d9if-blankrow");
    blank(rowF6, "Who do you look up to, and why?", "lookUpTo", true);
    doc.appendChild(rowF6);
    var rowF7 = el("div", "d9if-blankrow");
    blank(rowF7, "If you could plan one chapter event, what would it be?", "event", true);
    doc.appendChild(rowF7);

    doc.appendChild(el("h4", "d9if-part", "Final Section"));
    chipRow(doc, "Do you promise to do well in school and help your community?", PROMISE_OPTIONS, "promise");
    doc.appendChild(el("p", "d9if-affirm", "I affirm that the information on this form is true and correct. I understand that made-up answers can get my letter declined, and I agree to be kind, never haze, and always lift others up."));
    chipRow(doc, "Do you agree?", RULES_OPTIONS, "rules");
    var repSig = el("div", "d9if-sigline");
    repSig.appendChild(el("div", "d9if-ruleline"));
    repSig.appendChild(el("span", null, "Organization representative signature - the chapter owner signs here after reading your letter. Leave it blank."));
    doc.appendChild(repSig);
    var rowG2 = el("div", "d9if-blankrow");
    blank(rowG2, "Applicant signature", "signed", true);
    doc.appendChild(rowG2);
    doc.appendChild(el("p", "d9if-dateline", "Date submitted: " + todayStr));
    doc.appendChild(el("div", "d9if-foot", "D9Legacy Membership Intake Manual - Revised November 2026 \u00B7 This is a kid-made fan club form. It is not from the real Divine Nine."));

    var sendRow = el("div", "d9if-sendrow");
    var sendBtn = el("button", "d9if-send", "Send my letter");
    sendBtn.type = "button";
    sendBtn.addEventListener("click", function () {
      triedSend = true;
      if (!ready()) {
        doc.querySelectorAll(".d9if-blank input").forEach(function (input) {
          var label = input.getAttribute("aria-label") || "";
          var optional = label.indexOf("optional") !== -1;
          input.classList.toggle("d9if-missing", !optional && input.value.trim() === "");
        });
        errMsg.textContent = "Finish every part of the form first - check the red blanks and any chips you skipped.";
        errMsg.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      renderSent(send());
    });
    sendRow.appendChild(sendBtn);
    var errMsg = el("p", "d9if-err");
    sendRow.appendChild(errMsg);
    sendRow.appendChild(el("p", "d9if-hint", "Finish every part of the form to send your letter. Your letter is saved on this device only."));
    doc.appendChild(sendRow);

    mount.appendChild(doc);
  }

  renderForm();
})();
