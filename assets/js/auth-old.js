/* assets/js/auth.js */
document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("hw_session") || "null");
  const DEFAULT_AVATAR = "/assets/images/avatars/default-avatar.png";
  if (!session) return;

  // find sign-in link (by href OR by text)
  let signLink = document.querySelector('a[href="signin.html"]');
  if (!signLink) {
    // fallback: find link with innerText containing "Sign in"
    const anchors = Array.from(document.querySelectorAll('nav a, header a'));
    signLink = anchors.find(a => /sign\s*in/i.test(a.textContent));
  }
  if (!signLink) return;

  // create avatar button
  const avatarBtn = document.createElement("button");
  avatarBtn.id = "userAvatarBtn";
  avatarBtn.className = "relative inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border dark:border-neutral-700";
  const avatarSrc = session.avatar || DEFAULT_AVATAR;
  avatarBtn.innerHTML = `<img src="${avatarSrc}" alt="avatar" class="w-full h-full object-cover">`;

  // replace the signLink with avatarBtn
  signLink.parentNode.insertBefore(avatarBtn, signLink);
  signLink.remove();

  // create popup container
  const popup = document.createElement("div");
  popup.id = "userPopup";

popup.className = "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-2xl";
popup.style.borderRadius = "14px";
if (window.innerWidth >= 768) {
  // PC / tablet
  popup.style.width = "340px";
} else {
  // mobile
  popup.style.width = "92vw";
  popup.style.maxWidth = "320px";
}
popup.style.overflow = "hidden";

  popup.style.position = "absolute";
  popup.style.minWidth = "220px";
  popup.style.display = "none";
  popup.style.zIndex = "9999";
  popup.className = "rounded-xl p-3 bg-white dark:bg-neutral-900 border dark:border-neutral-700 shadow-lg";

 popup.innerHTML = `
  <!-- Header (logo only) -->
  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 14px;
    border-bottom:1px solid rgba(0,0,0,0.08);
  " class="dark:border-neutral-700">

    <img src="assets/images/header-logo.png"
         style="height:18px;width:auto;object-fit:contain;">

    <!-- SAME logout button -->
    <button id="logoutBtn" style="
      font-size:12px;
      color:#6b7280;
      background:none;
      border:none;
      cursor:pointer;
    " class="dark:text-gray-300 hover:opacity-80">
      Sign out
    </button>

  </div>

  <!-- Profile -->
  <div style="
    display:flex;
    align-items:center;
    gap:14px;
    padding:18px 16px;
  ">

    <img src="${avatarSrc}" alt="avatar"
      style="
        width:52px;
        height:52px;
        border-radius:50%;
        object-fit:cover;
      "
      class="border dark:border-neutral-700">

    <div style="flex:1;min-width:0;">

      <div style="
        font-size:15px;
        font-weight:600;
        line-height:1.2;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      ">
        ${session.displayName || session.username || 'User'}
      </div>

      <div style="
        font-size:12px;
        color:#6b7280;
        margin-top:2px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      ">
        ${session.email || ''}
      </div>

      <div style="
        font-size:12px;
        color:#2563eb;
        margin-top:6px;
        cursor:pointer;
      ">
        My Black Hat account
      </div>

    </div>

  </div>

  <!-- Footer -->
  <div style="padding:0 16px 16px 16px;">

    <!-- SAME profile button -->
<button id="profileBtn"
  style="
    width:100%;
    padding:10px;
    border-radius:10px;
    font-size:13px;
    font-weight:500;
    cursor:pointer;
    transition:all 0.2s ease;
    border:1px solid transparent;
  "
  class="
    bg-gray-100 text-black border-gray-300
    hover:bg-gray-200
    dark:bg-neutral-800 dark:text-white dark:border-neutral-700
    dark:hover:bg-neutral-700
  ">
  Manage account
</button>

  </div>
`;
  document.body.appendChild(popup);

  // position popup below avatar
function positionPopup() {
  const rect = avatarBtn.getBoundingClientRect();
  const popupWidth = popup.offsetWidth || 340;

  let left = rect.right + window.scrollX - popupWidth;

  // prevent overflow on left
  if (left < 8) left = 8;

  const top = rect.bottom + window.scrollY + 10;

  popup.style.top = top + "px";
  popup.style.left = left + "px";
}

  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (popup.style.display === "none") {
      popup.style.display = "block";
      positionPopup();
    } else {
      popup.style.display = "none";
    }
  });

  // Close popup on outside click
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !avatarBtn.contains(e.target)) {
      popup.style.display = "none";
    }
  });

  // logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hw_session");
    window.location.reload();
  });

  // optional profile button (redirect)
  document.getElementById("profileBtn").addEventListener("click", () => {
    // you can create a profile.html; temporary redirect to contact/profile
    window.location.href = "account-center";
  });

  // reposition on resize/scroll
  window.addEventListener("resize", () => { if (popup.style.display === "block") positionPopup(); });
  window.addEventListener("scroll", () => { if (popup.style.display === "block") positionPopup(); });
});
