(() => {
const memberPasswords = {
    "\u0391\u03A6\u0391": { password: "IceCold1906", hint: "The Alphas' famous call plus the year they started." },
    "\u0391\u039A\u0391": { password: "SkeeWee1908", hint: "The AKAs' famous call plus the year they started." },
    "\u039A\u0391\u03A8": { password: "KappaKane1911", hint: "What the Kappas twirl at step shows, plus the year they started." },
    "\u03A9\u03A8\u03A6": { password: "OmegaRoo1911", hint: "The Omegas' barking call plus the year they started." },
    "\u0394\u03A3\u0398": { password: "DeltaOoOop1913", hint: "The Deltas' famous call plus the year they started." },
    "\u03A6\u0392\u03A3": { password: "BluePhi1914", hint: "The Sigmas' famous shout, blue plus a Greek letter, plus the year they started." },
    "\u0396\u03A6\u0392": { password: "ZetaDove1920", hint: "The Zetas' white bird mascot plus the year they started." },
    "\u03A3\u0393\u03A1": { password: "PoodleEeYip1922", hint: "The SGRhos' dog mascot and their call, plus the year they started." },
    "\u0399\u03A6\u0398": { password: "IotaCentaur1963", hint: "The Iotas' half-horse mascot plus the year they started." }
  };
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
const additional = {
    "ΩΨΦ": { name: "Josh", password: "JoshOmega1911" },
    "ΔΣΘ": { name: "Kinte", password: "KinteDST1913" }
  };
const orgs = {"alpha-phi-alpha": "ΑΦΑ", "alpha-kappa-alpha": "ΑΚΑ", "kappa-alpha-psi": "ΚΑΨ", "omega-psi-phi": "ΩΨΦ", "delta-sigma-theta": "ΔΣΘ", "phi-beta-sigma": "ΦΒΣ", "zeta-phi-beta": "ΖΦΒ", "sigma-gamma-rho": "ΣΓΡ", "iota-phi-theta": "ΙΦΘ"};
const slug = location.pathname.split('/').filter(Boolean)[0];
const org = orgs[slug];
if (!org) return;
const form = document.getElementById('d9-chapter-login');
const buttons = document.querySelectorAll('[data-login-role]');
let role = 'member';
buttons.forEach(button => button.addEventListener('click', () => {
 role = button.dataset.loginRole;
 buttons.forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
 document.getElementById('d9-login-heading').textContent = role === 'owner' ? 'Owner login' : 'Member login';
 document.getElementById('d9-password-label').textContent = role === 'owner' ? 'D9Legacy owner code' : 'D9Legacy member code';
 document.getElementById('d9-login-description').textContent = role === 'owner' ? 'Review this chapter’s letters on this device.' : 'Open your chapter’s member inbox on this device.';
 document.getElementById('d9-login-password').value = '';
 document.getElementById('d9-login-status').textContent = '';
}));
form.addEventListener('submit', event => {
 event.preventDefault();
 const name = document.getElementById('d9-login-name').value.trim();
 const entered = document.getElementById('d9-login-password').value.trim();
 const valid = role === 'owner' ? entered === ownerPasswords[org].password || entered === additional[org]?.password : entered === memberPasswords[org].password;
 const status = document.getElementById('d9-login-status');
 if (!valid) { status.textContent = 'That is not the D9Legacy ' + role + ' code for this chapter. Ask Josh for the right code.'; return; }
 try {
  if (role === 'owner') {
   sessionStorage.setItem('d9legacy:group-owner-session', JSON.stringify({org, name}));
   localStorage.removeItem('d9legacy:d9kids-session.v1');
  } else {
   sessionStorage.removeItem('d9legacy:group-owner-session');
   localStorage.setItem('d9legacy:d9kids-session.v1', JSON.stringify({role:'member',name}));
   let unlocked = JSON.parse(localStorage.getItem('d9legacy:d9kids-unlocked.v1') || '[]');
   if (!Array.isArray(unlocked)) unlocked = [];
   if (!unlocked.includes(org)) unlocked.push(org);
   localStorage.setItem('d9legacy:d9kids-unlocked.v1', JSON.stringify(unlocked));
  }
  location.href = '/?chapter=' + encodeURIComponent(org) + '#/inbox';
 } catch (_) { status.textContent = 'This browser could not save your login. Allow site storage and try again.'; }
});
})();
