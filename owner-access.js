(() => {
  const ownerPasswords = {
    "ΑΦΑ": { name: "Alpha Phi Alpha", password: "AlphaGold1906" },
    "ΑΚΑ": { name: "Alpha Kappa Alpha", password: "PinkPearl1908" },
    "ΚΑΨ": { name: "Kappa Alpha Psi", password: "CrimsonCane1911" },
    "ΩΨΦ": { name: "Omega Psi Phi", password: "PurpleQue1911" },
    "ΔΣΘ": { name: "Delta Sigma Theta", password: "DeltaTorch1913" },
    "ΦΒΣ": { name: "Phi Beta Sigma", password: "BlueSigma1914" },
    "ΖΦΒ": { name: "Zeta Phi Beta", password: "WhiteDove1920" },
    "ΣΓΡ": { name: "Sigma Gamma Rho", password: "RoyalPoodle1922" },
    "ΙΦΘ": { name: "Iota Phi Theta", password: "SilverCentaur1963" }
  };
  const additionalOwnerPasswords = {
    "ΩΨΦ": { name: "Josh", password: "JoshOmega1911" },
    "ΔΣΘ": { name: "Kinte", password: "KinteDST1913" }
  };
  const sampleLetters = [
    { id: "sample-1", name: "Maya (sample)", group: "Delta Sigma Theta (ΔΣΘ)", why: "I want to help my community and learn to lead like Shirley Chisholm.", bring: "Kindness and a big smile", grade: "4th grade", promise: "Yes, I promise", score: 5, total: 5, date: "Sample letter" },
    { id: "sample-2", name: "Jaylen (sample)", group: "Kappa Alpha Psi (ΚΑΨ)", why: "I love stepping and I want to learn the canes.", bring: "Lots of energy", grade: "5th grade", promise: "Yes, I promise", score: 4, total: 5, date: "Sample letter" }
  ];
  const scopeKey = "d9legacy:group-owner-session";
  const storeKey = (key) => `d9legacy:${key}`;
  const readJSON = (key, fallback) => {
    try {
      const value = localStorage.getItem(storeKey(key));
      return value === null ? fallback : JSON.parse(value);
    } catch (_) {
      return fallback;
    }
  };
  const panel = document.createElement("section");
  panel.id = "d9-group-owner-panel";
  panel.className = "file-card";
  panel.style.cssText = "box-sizing:border-box;max-width:1040px;width:100%;margin:16px auto 32px;padding:24px;background:#fff;border:1px solid #e5ddd7;border-radius:8px;box-shadow:0 8px 24px rgba(30,20,15,.06);gap:16px;";
  panel.innerHTML = `
    <header>
      <p style="margin:0 0 6px;font-size:.9em;color:#74645b">Owner inbox</p>
      <h2 id="d9-owner-title" style="margin:0 0 8px">Owner access for each group</h2>
      <p id="d9-owner-note" style="margin:0">Choose a group and use its owner password. This pretend login is not real security. Do not use a real password.</p>
    </header>
    <div id="d9-owner-master-note" role="status" hidden></div>
    <div id="d9-owner-form-wrap">
      <form id="d9-owner-form">
        <label for="d9-owner-group" style="display:block;margin:12px 0 6px;font-weight:600">Group</label>
        <select id="d9-owner-group" style="box-sizing:border-box;width:100%;max-width:520px;padding:10px;border:1px solid #bfb4ad;border-radius:4px;background:#fff;font:inherit"></select>
        <label for="d9-owner-name" style="display:block;margin:12px 0 6px;font-weight:600">Owner name</label>
        <input id="d9-owner-name" type="text" autocomplete="off" style="box-sizing:border-box;width:100%;max-width:520px;padding:10px;border:1px solid #bfb4ad;border-radius:4px;font:inherit">
        <label for="d9-owner-password" style="display:block;margin:12px 0 6px;font-weight:600">Owner password</label>
        <input id="d9-owner-password" type="password" autocomplete="off" style="box-sizing:border-box;width:100%;max-width:520px;padding:10px;border:1px solid #bfb4ad;border-radius:4px;font:inherit">
        <div style="margin-top:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <button type="submit" class="file-button" style="cursor:pointer">Open owner inbox</button>
          <a href="/" class="file-button" style="text-decoration:none">Back to D9Legacy</a>
        </div>
      </form>
      <p id="d9-owner-status" role="status" aria-live="polite" style="margin:10px 0 0;color:#8b2424"></p>
    </div>
    <div id="d9-owner-inbox" hidden></div>
  `;
  document.getElementById("root").appendChild(panel);
  const groupSelect = panel.querySelector("#d9-owner-group");
  const nameInput = panel.querySelector("#d9-owner-name");
  const passwordInput = panel.querySelector("#d9-owner-password");
  const formWrap = panel.querySelector("#d9-owner-form-wrap");
  const status = panel.querySelector("#d9-owner-status");
  const inbox = panel.querySelector("#d9-owner-inbox");
  const masterNote = panel.querySelector("#d9-owner-master-note");
  Object.entries(ownerPasswords).forEach(([letters, org]) => {
    const option = document.createElement("option");
    option.value = letters;
    option.textContent = `${org.name} (${letters})`;
    groupSelect.appendChild(option);
  });
  const readScope = () => {
    try { return JSON.parse(sessionStorage.getItem(scopeKey) || "null"); }
    catch (_) { return null; }
  };
  const getMainSession = () => readJSON("d9kids-session.v1", null);
  const isInboxRoute = () => {
    const route = decodeURIComponent(location.hash.slice(1) || location.pathname || "/");
    return route === "/inbox" || route.endsWith("/inbox");
  };
  const text = (tag, value, style) => {
    const el = document.createElement(tag);
    el.textContent = value == null ? "" : String(value);
    if (style) el.style.cssText = style;
    return el;
  };
  function renderLetters(org) {
    inbox.replaceChildren();
    const letters = readJSON("d9kids-letters.v1", []);
    const decisions = readJSON("d9kids-decisions.v1", {});
    const matching = (Array.isArray(letters) ? letters : []).filter((letter) => typeof letter.group === "string" && letter.group.endsWith(`(${org.letters})`));
    const samples = sampleLetters.filter((letter) => letter.group.endsWith(`(${org.letters})`));
    const all = [...matching, ...samples];
    inbox.appendChild(text("h3", `${org.name} owner inbox`, "margin:8px 0 12px;font-size:1.2em"));
    inbox.appendChild(text("p", all.length ? `${all.filter((letter) => !decisions[letter.id]).length} letter(s) to review. Letters are saved on this device.` : "No join letters for this group yet. Letters sent from this device will appear here.", "margin:0 0 14px;color:#55473f"));
    if (!all.length) return;
    all.forEach((letter) => {
      const row = document.createElement("article");
      row.style.cssText = "padding:14px 0;border-top:1px solid #e7dfda";
      row.appendChild(text("h4", `${letter.name} wants to join ${letter.group}`, "margin:0 0 8px;font-size:1em"));
      let details = `Grade: ${letter.grade || "not said"}. Text at: ${letter.contact || "not given"}. Why: ${letter.why || ""} Will bring: ${letter.bring || ""}. Promise: ${letter.promise || ""}. Quiz: ${letter.score ?? "?"} out of ${letter.total ?? "?"}. ${letter.sheet ? `Sheet: likes ${letter.sheet.like}; would help by: ${letter.sheet.service}; signed ${letter.sheet.signed}.` : ""} ${letter.date || ""}`;
      if (letter.sheet) {
        const s = letter.sheet;
        const extra = [];
        if (Array.isArray(s.interests) && s.interests.length) extra.push(`Interests: ${s.interests.join(", ")}.`);
        if (s.consider) extra.push(`Why we should consider them: ${s.consider}.`);
        if (s.bond) extra.push(`What brotherhood/sisterhood means to them: ${s.bond}.`);
        if (s.goals) extra.push(`Goals: ${s.goals}.`);
        if (s.d9means) extra.push(`What the Divine Nine means to them: ${s.d9means}.`);
        if (s.inspires) extra.push(`Org that inspires them most: ${s.inspires}.`);
        if (s.leadmean) extra.push(`What leadership means to them: ${s.leadmean}.`);
        if (s.represent) extra.push(`How they would represent the org: ${s.represent}.`);
        if (s.motto) extra.push(`Motto: ${s.motto}.`);
        if (s.subject) extra.push(`Favorite subject: ${s.subject}.`);
        if (s.talent) extra.push(`Best at: ${s.talent}.`);
        if (s.leader) extra.push(`Leadership moment: ${s.leader}.`);
        if (s.helped) extra.push(`A time they helped someone: ${s.helped}.`);
        if (s.funpick) extra.push(`Sounds most fun: ${s.funpick}.`);
        if (s.learned) extra.push(`One thing they learned: ${s.learned}.`);
        if (s.lookUpTo) extra.push(`Looks up to: ${s.lookUpTo}.`);
        if (s.event) extra.push(`Chapter event they would plan: ${s.event}.`);
        if (s.heroMember) extra.push(`Famous member who inspires them: ${s.heroMember}.`);
        if (s.hours) extra.push(`Hours per week: ${s.hours}.`);
        if (s.heard) extra.push(`Heard about us from: ${s.heard}.`);
        if (extra.length) details += " " + extra.join(" ");
      }
      row.appendChild(text("p", details, "margin:0 0 8px;line-height:1.5"));
      row.appendChild(text("p", `Status: ${decisions[letter.id] === "accepted" ? "Accepted" : decisions[letter.id] === "declined" ? "Declined" : "Waiting"}.`, "margin:0 0 8px;font-weight:600"));
      if (letter.id.startsWith("sample-")) {
        row.appendChild(text("span", "Sample letter for practice.", "font-size:.9em;color:#74645b"));
      } else {
        const actions = document.createElement("div");
        actions.style.cssText = "display:flex;gap:8px;flex-wrap:wrap";
        ["accepted", "declined"].forEach((decision) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "file-button";
          button.textContent = decision === "accepted" ? "Accept" : "Decline";
          button.disabled = decisions[letter.id] === decision;
          button.addEventListener("click", () => {
            const latest = readJSON("d9kids-decisions.v1", {});
            latest[letter.id] = decision;
            localStorage.setItem(storeKey("d9kids-decisions.v1"), JSON.stringify(latest));
            render();
          });
          actions.appendChild(button);
        });
        row.appendChild(actions);
      }
      inbox.appendChild(row);
    });
  }
  function render() {
    panel.hidden = !isInboxRoute();
    panel.style.display = panel.hidden ? "none" : "flex";
    if (panel.hidden) return;
    const selectedLetters = groupSelect.value || Object.keys(ownerPasswords)[0];
    const org = { letters: selectedLetters, ...ownerPasswords[selectedLetters] };
    const mainSession = getMainSession();
    const isMasterOwner = mainSession?.role === "owner" && !mainSession.org;
    if (isMasterOwner) {
      formWrap.hidden = true;
      inbox.hidden = true;
      masterNote.hidden = false;
      masterNote.textContent = "The master owner login is active and still covers all nine inboxes. This page's group-specific passwords remain optional.";
      return;
    }
    masterNote.hidden = true;
    const scope = readScope();
    const isSignedInForSelected = scope?.org === selectedLetters;
    formWrap.hidden = isSignedInForSelected;
    inbox.hidden = !isSignedInForSelected;
    status.textContent = scope && !isSignedInForSelected ? `This owner login is only for ${ownerPasswords[scope.org]?.name || "its group"}. Enter this group's password to switch.` : "";
    if (isSignedInForSelected) {
      panel.querySelector("#d9-owner-title").textContent = `${org.name} owner access`;
      panel.querySelector("#d9-owner-note").textContent = `Welcome, ${scope.name}. This owner login can open only the ${org.name} owner inbox.`;
      renderLetters(org);
      let logout = inbox.querySelector("#d9-owner-logout");
      if (!logout) {
        logout = document.createElement("button");
        logout.id = "d9-owner-logout";
        logout.type = "button";
        logout.className = "file-button";
        logout.textContent = "Log out of this owner inbox";
        logout.style.marginTop = "12px";
        logout.addEventListener("click", () => {
          sessionStorage.removeItem(scopeKey);
          panel.querySelector("#d9-owner-title").textContent = "Owner access for each group";
          panel.querySelector("#d9-owner-note").textContent = "Choose a group and use its owner password. This pretend login is not real security. Do not use a real password.";
          render();
        });
        inbox.appendChild(logout);
      }
    } else {
      panel.querySelector("#d9-owner-title").textContent = "Owner access for each group";
      panel.querySelector("#d9-owner-note").textContent = `Choose a group and use its owner password. This pretend login is not real security. Do not use a real password.`;
    }
  }
  groupSelect.addEventListener("change", () => {
    status.textContent = "";
    passwordInput.value = "";
    render();
  });
  panel.querySelector("#d9-owner-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedLetters = groupSelect.value;
    const expected = ownerPasswords[selectedLetters];
    const additional = additionalOwnerPasswords[selectedLetters];
    const enteredPassword = passwordInput.value.trim();
    if (enteredPassword !== expected.password && enteredPassword !== additional?.password) {
      status.textContent = `That is not the owner password for ${expected.name}.`;
      return;
    }
    const scope = { org: selectedLetters, name: enteredPassword === additional?.password ? additional.name : (nameInput.value.trim() || "Owner") };
    sessionStorage.setItem(scopeKey, JSON.stringify(scope));
    passwordInput.value = "";
    status.textContent = "";
    render();
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  window.addEventListener("instinct-route", render);
  let panelObserver;
  const observePanel = () => panelObserver.observe(document.getElementById("root"), { childList: true, subtree: true });
  const renderGuarded = () => { panelObserver.disconnect(); try { render(); } finally { observePanel(); } };
  panelObserver = new MutationObserver(renderGuarded);
  observePanel();
  render();
})();
