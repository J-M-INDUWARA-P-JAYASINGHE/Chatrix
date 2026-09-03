/* assets/js/signin.js */
const firebaseConfig = {
  apiKey: "AIzaSyBO2Um_hyje276BKf96Alae-5_UmbbLDN4",
  authDomain: "cavexa-2009.firebaseapp.com",
  databaseURL: "https://cavexa-2009-default-rtdb.firebaseio.com",
  projectId: "cavexa-2009",
  storageBucket: "cavexa-2009.firebasestorage.app",
  messagingSenderId: "159385487748",
  appId: "1:159385487748:web:10e6a4ed33aca2aee5f5d1",
  measurementId: "G-0F7NN4J58V"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const realtimeDB = firebase.database();

const form = document.getElementById("signinForm");
const submitBtn = form.querySelector('button[type="submit"]');
const originalBtnText = submitBtn.innerHTML;
const resultEl = document.getElementById("signinResult");
function showError(msg){ resultEl.textContent = msg; }

/* default avatar path */
const DEFAULT_AVATAR = "/assets/images/avatars/default-avatar.png";

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  resultEl.textContent = "";


submitBtn.disabled = true;

submitBtn.innerHTML = `
<span style="
display:flex;
align-items:center;
justify-content:center;
gap:10px;
">
<svg
style="
width:18px;
height:18px;
animation:spin .8s linear infinite;
"
viewBox="0 0 24 24"
fill="none">
<circle
cx="12"
cy="12"
r="10"
stroke="currentColor"
stroke-width="3"
stroke-opacity=".25"/>
<path
d="M22 12a10 10 0 0 1-10 10"
stroke="currentColor"
stroke-width="3"
stroke-linecap="round"/>
</svg>
Signing in...
</span>
`;


  const loginId = (document.getElementById("loginId").value || "").trim().toLowerCase();
  const password = (document.getElementById("password").value || "");

  if (!loginId || !password) { showError("Enter username/email and password."); return; }

  try {
    let q;
    if (loginId.includes("@")) {
      q = await firestore.collection("users").where("email", "==", loginId).limit(1).get();
    } else {
      q = await firestore.collection("users").where("username", "==", loginId).limit(1).get();
    }

    if (q.empty) {

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;

  showError("No account found.");
  return;
}

    const doc = q.docs[0];
    const user = doc.data();

   if (user.passwordPlain !== password) {

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;

  showError("Incorrect password.");
  return;
}

    // read avatar from Realtime DB
    const avatarSnap = await realtimeDB.ref("avatars/" + user.uid).once("value");
    const avatarVal = avatarSnap.exists() ? avatarSnap.val() : null;

    const session = {
      uid: user.uid,
      displayName: user.displayName || (user.givenName? user.givenName + (user.familyName? ' ' + user.familyName : '') : user.username),
      email: user.email || null,
      username: user.username || null,
      avatar: avatarVal || DEFAULT_AVATAR
    };

    /* Current session */
localStorage.setItem(
  "hw_session",
  JSON.stringify(session)
);

/* Save account for switching */
let accounts = JSON.parse(
  localStorage.getItem("hw_accounts") || "[]"
);

/* remove old copy */
accounts = accounts.filter(
  a => a.uid !== session.uid
);

/* add newest first */
accounts.unshift(session);

/* keep max 20 */
accounts = accounts.slice(0,20);

localStorage.setItem(
  "hw_accounts",
  JSON.stringify(accounts)
);


    const redirect = localStorage.getItem("redirect_after_login");
localStorage.removeItem("redirect_after_login");

window.location.href = redirect || "index";


   

  } catch (err) {
    console.error(err);
    submitBtn.disabled = false;
submitBtn.innerHTML = originalBtnText;

showError("Sign in failed — network or permission issue.");
  }
});





/* ================================
   BASIC PROTECTION SCRIPT
   (You cannot fully block DevTools,
   but this blocks common shortcuts)
   ================================ */

/* Block Right Click */
document.addEventListener("contextmenu", e => e.preventDefault());

/* Block F12 and DevTools keys */
document.addEventListener("keydown", e => {
  // F12
  if (e.key === "F12") {
    e.preventDefault();
  }

  // Ctrl + Shift + (I, J, C)
  if (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key.toUpperCase())) {
    e.preventDefault();
  }

  // Ctrl + U (view source)
  if (e.ctrlKey && e.key.toLowerCase() === "u") {
    e.preventDefault();
  }

  // Block Ctrl key alone
  if (e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
  }

  // Block Shift key alone
  if (e.key === "Shift" && !e.ctrlKey) {
    e.preventDefault();
  }
});

/* Optional: Block selecting text */
document.addEventListener("selectstart", e => e.preventDefault());












