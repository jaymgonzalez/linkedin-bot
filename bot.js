function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pasteAsType(message, textarea, index) {
  var speed = 50
  if (index < message.length) {
  textarea.value += message.charAt(index)
  index++
  setTimeout(pasteAsType, speed)
  }
}
  
async function connect(profile, i) {
  try {
    const a=document.querySelector(`#${profile.id} a`);
    if(a===null){
        run();
        return;
    };
    const url = a.href;
    const connectBtn = document.querySelector(
      `#${profile.id} button[aria-label^='Connect']`
    );
    if (connectBtn === null && profiles && profiles[i + 1]) {
      connect(
        profiles[i + 1],
        i + 1
      );
      return;
    } else if (connectBtn === null) {
      run();
      return;
    }
    connectBtn.click();
    await sleep(2000);
    const addNoteBtn = document.querySelectorAll(
      "button[aria-label^='Add a note']"
    )[0];
    const h2 = document.getElementById("send-invite-modal").innerHTML;
    if (h2.trim() === "Connect") {
      const dismiss = document.querySelector("button[aria-label^='Dismiss']");
      profile.parentNode.removeChild(profile);
      dismiss.click();
      run();
      return;
    }
    if (addNoteBtn === null) {
      run();
      return;
    }
    addNoteBtn.click();
    await sleep(1000);

    writeMessage()

    const sendInvitationBtn = document.querySelector(
      "button[aria-label^='Done']"
    );
    await sleep(22000);
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
    if (sendInvitationBtn.disabled) {
      sendInvitationBtn.classList.remove("artdeco-button--disabled");
      sendInvitationBtn.removeAttribute("disabled");
      sendInvitationBtn.click();
    } else {
      sendInvitationBtn.click();
    }
    await sleep(2500);
    run();
    console.log('Requested + Profile Visited:', i, name, url);
  } catch (e) {
    console.error(e);
    if (profile) {
      connect(
        profile,
        i
      );
    }
  }
}

var connected = [];
var profiles = [];

async function run() {
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(250);
  profiles = document.querySelectorAll("li.search-result");
  profiles.forEach(profile => {
    const connectBtn = document.querySelector(
      `#${profile.id} button[aria-label^='Connect']`
    );
    if (connectBtn===null) {
      profile.parentNode.removeChild(profile);
    }
  });

  if (profiles.length === 0) {
    console.log("Next Page >");
    const nextPageBtn = document.querySelector("button[aria-label^='Next']");
    nextPageBtn.click();
    await sleep(3500);
    run();
  } else {
    connect(
      profiles[connected.length],
      connected.length
    );
  }
}

function writeMessage () {
  const name = document
      .getElementById("send-invite-modal")
      .innerHTML.replace("Invite ", "")
      .replace(" to connect", "")
      .trim();
  const textarea = document.querySelector("#custom-message");
  const message = `Hey ${name}, Hope you are well! I asked for a career change within my current company, Decibel, to be a DevOps professional. They have already approved this change and now I'm studying Docker and Linux Commands. I'm eager to start ASAP to apply this new knowledge and also, I'd like to increase my network within this sector so I'll be grateful if we could connect on here :) Have a good day, Jaime`;
  let index = 0
  pasteAsType(message, textarea, index)
}

run();
