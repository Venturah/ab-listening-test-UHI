// static/main.js
// Mobile-first A/B listening test (tap-to-play, one-at-a-time, Formspree submit)

// IMPORTANT:
// iPhone Safari typically WILL NOT play .ogg or .flac.
// Use .m4a (AAC), .mp3, or .wav for mobile participants.

const tests = [
  // For TODAY: keep only trials that will actually play on phones.
  // Your WAV/WAV ones should work on iPhone + Android + desktop.
  // Remove/replace FLAC/OGG trials until you re-encode.

  {
    category: "Sample Rate",
    track: "BeeMoved Sample – A vs B",
    a: "https://dl.dropboxusercontent.com/scl/fi/strs7zkmid2y5b22nc2nw/Sample_BeeMoved_96kHz24bit.wav?rlkey=rp7twg4vwzmw3hf0ggkam4w05",
    b: "https://dl.dropboxusercontent.com/scl/fi/3o33mfqke8vdsau3not9h/Sample_BeeMoved_44.1kHz24bit.wav?rlkey=trgyju2rhpkghss8wynkj9ecs"
  },
  {
    category: "Sample Rate",
    track: "Speech Sample – A vs B",
    a: "https://dl.dropboxusercontent.com/scl/fi/b851rh617ic74tj0b97cm/Speech-Sample-44.1khz-24bit.wav?rlkey=2gtzvxne84jd13th2t40ty49n",
    b: "https://dl.dropboxusercontent.com/scl/fi/fyreuan90rld642n8t5z9/Speech-Sample-96kHz-24.wav?rlkey=p98hi80ji72abdb6w8l6zl75a"
  },
  {
    category: "Sample Rate",
    track: "Synth Track – A vs B",
    a: "https://dl.dropboxusercontent.com/scl/fi/orh3s6p7uwrfyjvv9hon3/Synth-with-Reverb-and-Crystalizer-44.1kHz-14-LUFS.wav?rlkey=1oocz6mwf0htxddjdj0cqo3tp",
    b: "https://dl.dropboxusercontent.com/scl/fi/cyzpffbywxffgk0fq5hv6/Synth-with-Reverb-and-Crystalizer-96kHz-14LUFS.wav?rlkey=mi9rurc965fjif5g7e41jgoh8"
  },
  {
    category: "Bit Depth",
    track: "Classical Sample – A vs B",
    a: "https://dl.dropboxusercontent.com/scl/fi/eqkprivccz3yfall4mhmx/Bruckner-Symphony-32bitdepth-Sample.wav?rlkey=rjybd5ep7i9gqtsfqvhpnzspy",
    b: "https://dl.dropboxusercontent.com/scl/fi/pddf31pnx5l2m1t1aongb/Bruckner-Symphony-16bitdepth-Sample.wav?rlkey=ihzcynxiapfem1nevit2a9zrl"
  },
  {
    category: "Bit Depth",
    track: "Dub Techno Sample – A vs B",
    a: "https://dl.dropboxusercontent.com/scl/fi/4uahd2vjpy2jsu1pjioqe/Dub-Techno-Synthesised-Track-44.1khz-16-bit.wav?rlkey=4q69u5yakgti56sjmc448uxel",
    b: "https://dl.dropboxusercontent.com/scl/fi/vjs6ek6jrg3j85qbfi6in/Dub-Techno-Synthesised-Track-44.1khz-32-bit.wav?rlkey=10hw8r9fn2nzdricp300ir98p"
  },

  // TEMP: keep MP3 vs FLAC/OGG OUT until you re-encode to WAV or M4A.
  // Once you have a lossless WAV or AAC for the "B" file, we re-add bitrate trials.
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

    const flip = Math.random() < 0.5;
    const urlA = flip ? test.b : test.a;
    const urlB = flip ? test.a : test.b;

    section.innerHTML = `
      <div class="trial-header">
        <div class="trial-title">${index + 1}. ${test.track}</div>
        <div class="trial-meta">${test.category}</div>
      </div>

      <div class="trial-controls">
        <button type="button" class="btn" id="playA${index}">Play A</button>
        <button type="button" class="btn" id="playB${index}">Play B</button>
        <button type="button" class="btn btn-secondary" id="stop${index}">Stop</button>
      </div>

      <audio id="player${index}" preload="none" playsinline></audio>
      <div class="trial-status" id="status${index}"></div>

      <fieldset class="trial-choice">
        <legend>Which do you prefer?</legend>
        <label class="radio"><input type="radio" name="choice${index}" value="A" required> Prefer A</label>
        <label class="radio"><input type="radio" name="choice${index}" value="B" required> Prefer B</label>
        <label class="radio"><input type="radio" name="choice${index}" value="No difference" required> No difference</label>
      </fieldset>

      <details class="trial-notes">
        <summary>Optional: notes (what did you hear?)</summary>
        <textarea name="notes${index}" rows="2" placeholder="E.g., clearer vocals, less harsh highs, tighter bass..."></textarea>
      </details>

      <input type="hidden" name="flip${index}" value="${flip ? "1" : "0"}">
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
        section.dataset.presentedA = urlA;
        section.dataset.presentedB = urlB;
        section.dataset.flip = flip ? "1" : "0";
      } catch (e) {
        console.error(e);
        setStatus(`Couldn't play ${label}. Use .m4a/.mp3/.wav for mobile.`);
        alert(`Audio failed for ${label}.\n\nIf you're on iPhone/Safari, FLAC and OGG usually won't play.\nUse AAC (.m4a), MP3, or WAV.`);
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
    player.addEventListener("pause", () => {
      if (player.currentTime > 0) setStatus("Paused.");
    });
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
