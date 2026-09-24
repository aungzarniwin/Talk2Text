const textBox =
  document.getElementById("text");

const startBtn =
  document.getElementById("startBtn");

const stopBtn =
  document.getElementById("stopBtn");

const copyBtn =
  document.getElementById("copyBtn");

const downloadBtn =
  document.getElementById("downloadBtn");

const clearBtn =
  document.getElementById("clearBtn");

const language =
  document.getElementById("language");

const statusBox =
  document.getElementById("status");

const wordCount =
  document.getElementById("wordCount");

const audioFile =
  document.getElementById("audioFile");

const audio =
  document.getElementById("audio");


/* =========================
   WORD COUNT
========================= */

function updateWordCount() {

  const text =
    textBox.value.trim();

  if (!text) {

    wordCount.textContent =
      "0 words";

    return;

  }


  const words =
    text.split(/\s+/).length;


  wordCount.textContent =
    words + " words";

}


textBox.addEventListener(
  "input",
  updateWordCount
);


/* =========================
   SPEECH RECOGNITION
========================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition = null;


if (!SpeechRecognition) {

  statusBox.textContent =
    "❌ Speech Recognition မရပါ။ Google Chrome အသုံးပြုပါ။";

  startBtn.disabled = true;

}


else {

  recognition =
    new SpeechRecognition();


  recognition.continuous =
    true;


  recognition.interimResults =
    true;


  recognition.onstart =
    function () {

      startBtn.disabled =
        true;

      stopBtn.disabled =
        false;


      statusBox.textContent =
        "🔴 Recording... စကားပြောနေပါပြီ";

    };


  recognition.onresult =
    function (event) {

      let finalText = "";

      let interimText = "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        const transcript =
          event.results[i][0].transcript;


        if (
          event.results[i].isFinal
        ) {

          finalText +=
            transcript + " ";

        }

        else {

          interimText +=
            transcript;

        }

      }


      if (finalText) {

        textBox.value +=
          finalText;

        updateWordCount();

      }


      if (interimText) {

        statusBox.textContent =
          "🗣️ " + interimText;

      }

      else {

        statusBox.textContent =
          "🔴 Recording...";

      }

    };


  recognition.onerror =
    function (event) {

      console.log(
        "Speech Error:",
        event.error
      );


      statusBox.textContent =
        "⚠️ " + event.error;

    };


  recognition.onend =
    function () {

      startBtn.disabled =
        false;

      stopBtn.disabled =
        true;


      statusBox.textContent =
        "Ready — ထပ်မံစကားပြောနိုင်ပါတယ်။";

    };

}


/* =========================
   START RECORDING
========================= */

startBtn.onclick =
  function () {

    if (!recognition) {

      return;

    }


    recognition.lang =
      language.value;


    try {

      recognition.start();

    }

    catch (error) {

      console.log(error);

    }

  };


/* =========================
   STOP
========================= */

stopBtn.onclick =
  function () {

    if (recognition) {

      recognition.stop();

    }

  };


/* =========================
   COPY
========================= */

copyBtn.onclick =
  async function () {

    const text =
      textBox.value.trim();


    if (!text) {

      alert(
        "Copy လုပ်ရန် စာသားမရှိသေးပါ။"
      );

      return;

    }


    try {

      await navigator.clipboard
        .writeText(text);


      statusBox.textContent =
        "✅ Copy လုပ်ပြီးပါပြီ။";

    }

    catch (error) {

      alert(
        "Copy မလုပ်နိုင်ပါ။"
      );

    }

  };


/* =========================
   DOWNLOAD TXT
========================= */

downloadBtn.onclick =
  function () {

    const text =
      textBox.value.trim();


    if (!text) {

      alert(
        "Download လုပ်ရန် စာသားမရှိသေးပါ။"
      );

      return;

    }


    const blob =
      new Blob(
        ["\ufeff" + text],
        {
          type:
            "text/plain;charset=utf-8"
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "voice2text.txt";


    link.click();


    URL.revokeObjectURL(url);

  };


/* =========================
   CLEAR
========================= */

clearBtn.onclick =
  function () {

    textBox.value = "";

    updateWordCount();


    statusBox.textContent =
      "Ready — Start Recording ကိုနှိပ်ပါ။";

  };


/* =========================
   AUDIO FILE
========================= */

audioFile.onchange =
  function () {

    const file =
      audioFile.files[0];


    if (!file) {

      return;

    }


    const url =
      URL.createObjectURL(file);


    audio.src = url;

    audio.hidden = false;

    audio.load();


    statusBox.textContent =
      "🎧 Audio file loaded — Play ကိုနှိပ်နိုင်ပါတယ်။";

  };
