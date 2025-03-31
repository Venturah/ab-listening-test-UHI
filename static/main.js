const tests = [
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
    {
      category: "Bit Rate",
      track: "Pop Music Sample – A vs B",
      a: "https://dl.dropboxusercontent.com/scl/fi/p4b90hupj4hy5vki781w2/How-You-Like-That_MP3_64kbps.mp3?rlkey=qswee0lxnnvua6fgyrwyobjh0",
      b: "https://dl.dropboxusercontent.com/scl/fi/m85i7f51hk57k4qb9xtud/How-You-Like-That-FLAC_1937_kbps.flac?rlkey=4vgube62r4otgi0bof7c02hia"
    },
  {
    category: "Bit Rate",
    track: "Speech Sample – A vs B",
    a: "https://dl.dropboxusercontent.com/scl/fi/82r4f6f7d5rnx49uafhfb/Speech-Sample-44.1khz-24bit_OGG_90kbps.ogg?rlkey=cvqknqhvj2wezlzecbmryzpeq",
    b: "https://dl.dropboxusercontent.com/scl/fi/zf5rizzvrxl9c7obd822x/Speech-Sample-48khz-24bit196kbpsMP3.mp3?rlkey=56j60w7r8srzjxlmuossz0ups"
  },
    {
      category: "Bit Rate",
      track: "Electronic Track – A vs B",
      a: "https://dl.dropboxusercontent.com/scl/fi/ec2ehh87lelzilj0i4qr1/Tatreal-Totally-Dead-Uncompressed-48khz-24bit_FLAC_1913kbps.flac?rlkey=5lbq7cgyon25zsebvgpbwlmr1",
      b: "https://dl.dropboxusercontent.com/scl/fi/g3yuler0t4b3o7acee73j/Tatreal-Totally-Dead-Uncompressed-48khz-24bitOGG_238kbps.ogg?rlkey=w0sk87qh0dttvzppvzr2w98y4"
    }
];

window.onload = () => {
  const container = document.getElementById("testContainer");

  tests.forEach((test, index) => {
const section = document.createElement("div");
section.classList.add("test-section");

    section.innerHTML = `
      <h3>${test.category}: ${test.track}</h3>
      <audio id="audioA${index}" src="${test.a}" controls></audio><br>
      <audio id="audioB${index}" src="${test.b}" controls></audio><br>
      <label><input type="radio" name="choice${index}" value="A"> Prefer A</label>
      <label><input type="radio" name="choice${index}" value="B"> Prefer B</label>
      <label><input type="radio" name="choice${index}" value="No difference"> No Difference</label>
      <hr>
    `;
    container.appendChild(section);
  });
};

function getFormData() {
  const form = document.getElementById("demographicForm");
  const data = new FormData(form);
  const obj = {};
  for (const [key, value] of data.entries()) {
    obj[key] = value;
  }
  return obj;
}

function submitResults() {
  const formData = getFormData();
  const testResults = tests.map((test, index) => {
    const choice = document.querySelector(`input[name="choice${index}"]:checked`);
    return {
      category: test.category,
      track: test.track,
      choice: choice ? choice.value : "No response"
    };
  });

  const payload = {
    participant: formData,
    responses: testResults,
    timestamp: new Date().toISOString()
  };

  fetch("https://formspree.io/f/xrbpavzq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (res.ok) {
        alert("Your responses have been emailed successfully. Thank you!");
      } else {
        alert("Something went wrong. Please try again.");
      }
    })
    .catch(err => {
      console.error("Error submitting:", err);
      alert("Submission failed.");
    });
}
// paste your actual main.js here
