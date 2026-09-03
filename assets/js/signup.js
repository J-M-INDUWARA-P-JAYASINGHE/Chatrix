/* assets/js/signup.js */
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

const modal = document.getElementById("signupModal");
const iframe = document.getElementById("signupFrame");
const closeModal = document.getElementById("closeModal");
const DEFAULT_AVATAR = "/assets/images/avatars/default-avatar.png";

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

/**
 * Listen for messages from the iframe (account wizard).
 * expected message: { status: "created", uid: "<uid>" }
 */
window.addEventListener("message", async (ev) => {
  if (!ev.data || typeof ev.data !== "object") return;
  const msg = ev.data;

  if (msg.status === "created" && msg.uid) {
    try {
      // fetch user doc by uid (users collection uses doc id = uid in account wizard)
      const userDoc = await firestore.collection("users").doc(msg.uid).get();
      if (!userDoc.exists) {
        console.warn("User doc not found for uid:", msg.uid);
        return;
      }
      const user = userDoc.data();

      // fetch avatar from realtimedb
      const avatarSnap = await realtimeDB.ref("avatars/" + user.uid).once("value");
      const avatarVal = avatarSnap.exists() ? avatarSnap.val() : null;

      // create session object
      const session = {
        uid: user.uid,
        displayName: user.displayName || (user.givenName? user.givenName + (user.familyName? ' ' + user.familyName : '') : user.username),
        email: user.email || null,
        username: user.username || null,
        avatar: avatarVal || DEFAULT_AVATAR
      };

      // store session and close modal
      localStorage.setItem("hw_session", JSON.stringify(session));

      // notify iframe if needed
      try { iframe.contentWindow.postMessage({ status: "parent_ack", ok: true }, "*"); } catch(e) {}

      // close the modal and redirect to index
      modal.style.display = "none";
      // reload parent pages or redirect to index
      window.location.href = "index.html";

    } catch (err) {
      console.error("Failed to auto-login after signup:", err);
    }
  }
});
