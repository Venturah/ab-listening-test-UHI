// static/main.js
// Mobile-first A/B listening test (tap-to-play, one-at-a-time, Formspree submit)

const tests = [
  // -------- Lossless vs 256k (4 trials) --------
  {
    category: "Three Drives – Greece 2000",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 256k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/5g2u1co5yj1yyux3pvzt0/Three_Drives-Greece_2000_.wav?rlkey=exp0tlp5ye7xdvpfh1adx4arv",
    b: "https://dl.dropboxusercontent.com/scl/fi/rd4mbmrm2i38m344ombhj/Three_Drives-Greece_2000__256k_aac.m4a?rlkey=o5qhjrdfjciyiatootgwhx0a9"
  },
  {
    category: "High Command – Eclipse of the Dual Moons",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 256k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/kie5qx1co7fcvypgfvr0k/High_Command-Eclipse_of_the_Dual_Moons.wav?rlkey=uhwogv7tp0sl1weapt3wpqv3i",
    b: "https://dl.dropboxusercontent.com/scl/fi/ebz5f6atvstrrqk7ohyp2/High_Command-Eclipse_of_the_Dual_Moons_256k_aac.m4a?rlkey=yztbzurs1ihnyrtxczorhk5y4"
  },
  {
    category: "Harmony – Ecstasy",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 256k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/qgrehkcx77291eatb0dn3/Harmony_Ecstasy_.wav?rlkey=pm84cshtbk5gjkcm3l9pohiio",
    b: "https://dl.dropboxusercontent.com/scl/fi/gmw6iqiqsb9qberx4dmit/Harmony_Ecstasy__256k_aac.m4a?rlkey=2z5l7vjh1mmha84d4qibofn2l"
  },
  {
    category: "Bruckner – Symphony",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 256k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/qfqc77eb8p8fgupu54i1y/Bruckner_Symphony.wav?rlkey=j1x723iu92374d08m3dggc3fx",
    b: "https://dl.dropboxusercontent.com/scl/fi/yst7y68t4fo6hcixcmo6y/Bruckner_Symphony_256k_aac.m4a?rlkey=aa8wtpylkffg9sd1bwqrrjghl"
  },

  // -------- Lossless vs 128k (4 trials) --------
  {
    category: "Potty Mouth – Favorite Food",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 128k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/9vab047lcaqb8wrvcnyzv/Potty_Mouth-Favorite_Food_.wav?rlkey=lx347ep5wcjq8h3oq4dtiyytb",
    b: "https://dl.dropboxusercontent.com/scl/fi/kwrzp0jq6551zygokp788/Potty_Mouth-Favorite_Food__128k_aac.m4a?rlkey=t3pfhsuvlra2kzlnvs62gojk1"
  },
  {
    category: "Podcast Sample",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 128k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/bc4mjrf4jvatoczzvlsrc/Podcast_.wav?rlkey=5wgl48kqlzevw7qewloj85cj0",
    b: "https://dl.dropboxusercontent.com/scl/fi/g7ol0wq737yequg1jd0cg/Podcast__128k_aac.m4a?rlkey=qpieomyl9zx4z765kb4u5aht4"
  },
  {
    category: "Danny Brown & underscores – Copycats",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 128k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/6x57smbo9prw2rls9z2q3/Danny_Brown-underscores-Copycats.wav?rlkey=icr1565g0k1evdxwzrvcjymvr",
    b: "https://dl.dropboxusercontent.com/scl/fi/yittg0pyckgpgoootciq6/Danny_Brown_underscores-Copycats_128k_aac.m4a?rlkey=qtcw7j2k8bbxgcrs1x34bmte5"
  },
  {
    category: "beabadoobee – Take A Bite",
    track: "Version A vs Version B",
    comparison: "Lossless (WAV) vs 128k AAC",
    a: "https://dl.dropboxusercontent.com/scl/fi/rlqar7ovx75udyhfnvqnj/beabadoobee-Take_A_Bite_.wav?rlkey=yo3uzdiy2jzwmxpzjoc8cs62k",
    b: "https://dl.dropboxusercontent.com/scl/fi/qhy0ggn4akfg9snooypdt/beabadoobee-Take_A_Bite__128k_aac.m4a?rlkey=dmfuwtmwskqf1h2ekdle3ovvb"
  }
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrbpavzq";

function stopAllAudio() {
  document.querySelectorAll("audio").forEach(a => {
    if (!a.paused) a.pause();
    try { a.currentTime = 0; } catch {}
  });
}

function getFormData() {
  const form = document.getElementById("demographicForm");
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function renderTrials() {
  const container = document.getElementById("testContainer");
  container.innerHTML = "";

  tests.forEach((test, index) => {
    const section = document.createElement("section");
    section.className = "trial-card";
    section.dataset.index = String(index);

    // Randomise which file is presented as A vs B
    const flip = Math.random() < 0.5;
    const urlA = flip ? test.b : test.a;
    const urlB = flip ? test.a : test.b;

    // Save mapping immediately (even if they never press play)
    section.dataset.presentedA = urlA;
    section.dataset.presentedB = urlB;
    section.dataset.flip = flip ? "1" : "0";
    section.dataset.playCountA = "0";
    section.dataset.playCountB = "0";

    section.innerHTML = `
      <div class="trial-header">
        <div class="trial-title">${index + 1}. ${test.category}</div>
        <div class="trial-meta">${test.track}</div>
      </div>

      <div class="trial-hint">
        Compare A and B. Choose which sounds higher quality, or select "No difference".
      </div>

      <div class="trial-controls">
        <button type="button" class="btn" id="playA${index}">Play A</button>
        <button type="button" class="btn" id="playB${index}">Play B</button>
        <button type="button" class="btn btn-secondary" id="stop${index}">Stop</button>
      </div>

      <audio id="player${index}" preload="none" playsinline></audio>
      <div class="trial-status" id="status${index}"></div>

      <fieldset class="trial-choice">
        <legend>Which sounds higher quality?</legend>
        <label class="radio"><input type="radio" name="choice${index}" value="A" required> A sounds higher quality</label>
        <label class="radio"><input type="radio" name="choice${index}" value="B" required> B sounds higher quality</label>
        <label class="radio"><input type="radio" name="choice${index}" value="No difference" required> No difference</label>
      </fieldset>

      <details class="trial-notes">
        <summary>Optional: notes (what did you hear?)</summary>
        <textarea name="notes${index}" rows="2" placeholder="E.g., clearer vocals, less harsh highs, smeared transients..."></textarea>
      </details>

      <input type="hidden" name="flip${index}" value="${flip ? "1" : "0"}">
      <input type="hidden" name="comparison${index}" value="${test.comparison}">
    `;

    container.appendChild(section);

    const player = document.getElementById(`player${index}`);
    const status = document.getElementById(`status${index}`);
    const playA = document.getElementById(`playA${index}`);
    const playB = document.getElementById(`playB${index}`);
    const stop = document.getElementById(`stop${index}`);

    const setStatus = (msg) => { status.textContent = msg; };

    let playCountA = 0;
    let playCountB = 0;

    async function play(url, label) {
      try {
        stopAllAudio();
        player.src = url;
        player.load();

        setStatus(`Playing ${label}…`);
        await player.play();

        if (label === "A") playCountA++;
        if (label === "B") playCountB++;

        section.dataset.playCountA = String(playCountA);
        section.dataset.playCountB = String(playCountB);
      } catch (e) {
        console.error(e);
        setStatus(`Couldn't play ${label}.`);
      }
    }

    playA.addEventListener("click", () => play(urlA, "A"));
    playB.addEventListener("click", () => play(urlB, "B"));

    stop.addEventListener("click", () => {
      player.pause();
      try { player.currentTime = 0; } catch {}
      setStatus("Stopped.");
    });

    player.addEventListener("ended", () => setStatus("Finished."));
  });
}

function collectResponses() {
  return tests.map((test, index) => {
    const choice = document.querySelector(`input[name="choice${index}"]:checked`);
    const notes = document.querySelector(`textarea[name="notes${index}"]`);
    const card = document.querySelector(`.trial-card[data-index="${index}"]`);

    return {
      category: test.category,
      track: test.track,
      comparison: test.comparison,
      choice: choice ? choice.value : "No response",
      notes: notes ? (notes.value || "").trim() : "",
      playCountA: card?.dataset.playCountA ? Number(card.dataset.playCountA) : 0,
      playCountB: card?.dataset.playCountB ? Number(card.dataset.playCountB) : 0,
      flipped: card?.dataset.flip === "1",
      presentedAUrl: card?.dataset.presentedA || "",
      presentedBUrl: card?.dataset.presentedB || ""
    };
  });
}

function validateAllAnswered() {
  const missing = tests
    .map((_, i) => ({ i, checked: !!document.querySelector(`input[name="choice${i}"]:checked`) }))
    .filter(x => !x.checked)
    .map(x => x.i + 1);

  if (missing.length) {
    alert(`Please answer all trials before submitting.\nMissing: ${missing.join(", ")}`);
    return false;
  }
  return true;
}

async function submitResults() {
  try {
    stopAllAudio();

    if (!validateAllAnswered()) return;

    const participant = getFormData();
    const responses = collectResponses();

    const payload = {
      participant,
      responses,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) alert("Submitted. Thank you!");
    else alert("Something went wrong submitting. Please try again.");
  } catch (err) {
    console.error("Error submitting:", err);
    alert("Submission failed.");
  }
}

window.addEventListener("load", () => {
  renderTrials();
});
