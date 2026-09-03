/* assets/js/auth.js */
document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("hw_session") || "null");
  const DEFAULT_AVATAR = "/assets/images/avatars/default-avatar.png";
  if (!session) return;

  // find sign-in link (by href OR by text)
  let signLink = document.querySelector('a[href="signin"]');
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
<div style="padding:0 16px 16px 16px;display:flex;flex-direction:column;gap:8px;">

<button id="profileBtn"
  style="
    width:100%;
    height:44px;
    border-radius:12px;
    border:none;
    cursor:pointer;
  "
  class="
    bg-gray-100 text-black
    dark:bg-neutral-800 dark:text-white
  ">
  Manage account
</button>

<button id="switchAccountBtn"
  style="
    width:100%;
    height:44px;
    border-radius:12px;
    border:none;
    cursor:pointer;
    font-weight:600;
    background:#2563eb;
    color:white;
  ">
  Switch account
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





/* ===========================
   FACEBOOK ACCOUNTS CENTER STYLE
=========================== */

const switchModal = document.createElement("div");

switchModal.id = "accountSwitcherModal";

switchModal.style.cssText = `
position:fixed;
inset:0;
display:none;
background:rgba(0,0,0,.55);
backdrop-filter:blur(6px);
z-index:999999;
`;

document.body.appendChild(switchModal);

function openAccountSwitcher(){

const current =
JSON.parse(
localStorage.getItem("hw_session")
);

const accounts =
JSON.parse(
localStorage.getItem("hw_accounts") || "[]"
);

const isMobile =
window.innerWidth < 768;

switchModal.innerHTML = `

<div id="accountSheet"

style="
position:absolute;

${isMobile
? `
left:0;
right:0;
bottom:0;
max-height:92vh;
border-radius:24px 24px 0 0;
animation:sheetUp .22s ease;
`
:
`
left:50%;
top:50%;
transform:translate(-50%,-50%);
width:430px;
border-radius:12px;
animation:popupIn .18s ease;
`
}

overflow:hidden;

background:
${
document.documentElement.classList.contains("dark")
?
`
radial-gradient(
circle at top left,
rgba(34,197,94,.22),
transparent 42%
),
radial-gradient(
circle at bottom right,
rgba(236,72,153,.20),
transparent 42%
),
radial-gradient(
circle at top right,
rgba(59,130,246,.18),
transparent 40%
),
radial-gradient(
circle at center,
rgba(255,255,255,.03),
transparent 55%
),
#0f1115
`
:
`
radial-gradient(
circle at top left,
rgba(86,255,190,.65),
transparent 42%
),
radial-gradient(
circle at bottom right,
rgba(255,105,180,.55),
transparent 42%
),
radial-gradient(
circle at top right,
rgba(255,220,120,.30),
transparent 45%
),
radial-gradient(
circle at center,
rgba(255,255,255,.55),
transparent 55%
),
#f3f4f6
`
};

box-shadow:0 20px 80px rgba(0,0,0,.35);
"
>

${
isMobile
?
`
<div style="
display:flex;
justify-content:center;
padding:10px 0;
">
<div style="
width:42px;
height:4px;
border-radius:999px;
background:#c9ccd1;
"></div>
</div>
`
:
""
}

<div style="
padding:14px;
">

<!-- CURRENT ACCOUNT -->

<div style="
background:${
document.documentElement.classList.contains("dark")
? "rgba(24,24,27,.92)"
: "rgba(255,255,255,.92)"
};

backdrop-filter:blur(20px);
-webkit-backdrop-filter:blur(20px);

border:1px solid ${
document.documentElement.classList.contains("dark")
? "rgba(255,255,255,.06)"
: "rgba(0,0,0,.05)"
};

border-radius:8px;
overflow:hidden;
margin-bottom:14px;
"
class="dark:bg-neutral-800">

<div
id="currentAccountCard">
</div>



<div
id="addAccountRow"

style="
display:flex;
align-items:center;
gap:14px;
padding:14px;
cursor:pointer;
border-top:1px solid rgba(0,0,0,.08);
">

<div style="
width:36px;
height:36px;
border-radius:50%;
background:#1877f2;
display:flex;
align-items:center;
justify-content:center;
color:white;
font-size:22px;
font-weight:500;
">
<i class="ri-add-line"></i>
</div>

<div style="
font-weight:600;
">
Add Account
</div>

</div>



<div
id="createAccountBtn"

style="
display:flex;
align-items:center;
gap:14px;
padding:14px;
cursor:pointer;
border-top:1px solid rgba(0,0,0,.08);
">

<div style="
width:36px;
height:36px;
border-radius:50%;
background:${
document.documentElement.classList.contains("dark")
? "#2a2d33"
: "#f0f2f5"
};
display:flex;
align-items:center;
justify-content:center;
font-size:22px;
font-weight:500;
color:${
document.documentElement.classList.contains("dark")
? "#e5e7eb"
: "#1f2937"
};
">
<i class="ri-add-line"></i>
</div>

<div style="
font-weight:600;
">
Create New Account
</div>

</div>

</div>

<!-- SAVED ACCOUNTS -->

<div style="
font-size:12px;
font-weight:600;
color:#65676b;
margin-bottom:8px;
padding-left:4px;
">
Saved Accounts
</div>

<div
id="savedAccounts"

style="
background:${
document.documentElement.classList.contains("dark")
? "rgba(24,24,27,.92)"
: "rgba(255,255,255,.92)"
};

backdrop-filter:blur(20px);
-webkit-backdrop-filter:blur(20px);

border:1px solid ${
document.documentElement.classList.contains("dark")
? "rgba(255,255,255,.06)"
: "rgba(0,0,0,.05)"
};

border-radius:8px;
overflow:hidden;
"
class="dark:bg-neutral-800">
</div>

<button
id="accountsCenterBtn"

style="
width:100%;
margin-top:14px;
height:46px;

border:1px solid ${
document.documentElement.classList.contains("dark")
? "rgba(255,255,255,.08)"
: "#d0d7de"
};

background:${
document.documentElement.classList.contains("dark")
? "rgba(30,32,38,.92)"
: "rgba(255,255,255,.92)"
};

backdrop-filter:blur(16px);

border-radius:8px;

font-weight:600;

cursor:pointer;

color:${
document.documentElement.classList.contains("dark")
? "#f3f4f6"
: "#1f2937"
};
"
class="
dark:bg-neutral-800
dark:border-neutral-700
">
Go to Accounts Center
</button>

</div>

</div>
`;

switchModal.style.display = "block";

/* CURRENT */

const currentBox =
document.getElementById(
"currentAccountCard"
);

if(current){

currentBox.innerHTML = `

<div style="
display:flex;
align-items:center;
padding:14px;
">

<img
src="${current.avatar}"
style="
width:44px;
height:44px;
border-radius:50%;
object-fit:cover;
">

<div style="
margin-left:12px;
flex:1;
">

<div style="
font-weight:600;
">
${current.displayName || "User"}
</div>

<div style="
font-size:12px;
opacity:.7;
">
${current.email || ""}
</div>

</div>

<div style="
width:18px;
height:18px;
border-radius:50%;
background:#1877f2;
display:flex;
align-items:center;
justify-content:center;
color:white;
font-size:11px;
">
✓
</div>

</div>
`;
}

/* SAVED */

const list =
document.getElementById(
"savedAccounts"
);

accounts
.filter(
a =>
!current ||
a.uid !== current.uid
)
.forEach(acc=>{

const row =
document.createElement("div");

row.style.cssText=`
display:flex;
align-items:center;
gap:12px;
padding:12px 14px;
cursor:pointer;
border-top:1px solid rgba(0,0,0,.06);
`;

row.innerHTML=`

<img
src="${acc.avatar}"
style="
width:42px;
height:42px;
border-radius:50%;
object-fit:cover;
">

<div style="
flex:1;
min-width:0;
">

<div style="
font-weight:600;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
">
${acc.displayName || "User"}
</div>

<div style="
font-size:12px;
opacity:.7;
">
${acc.email || ""}
</div>

</div>

<button
class="removeAccount"
data-uid="${acc.uid}"
style="
border:none;
background:none;
font-size:20px;
cursor:pointer;
opacity:.5;
">
×
</button>
`;

row.onclick=(e)=>{

if(
e.target.classList.contains(
"removeAccount"
)
) return;

localStorage.setItem(
"hw_session",
JSON.stringify(acc)
);

location.reload();

};

list.appendChild(row);

});

document
.querySelectorAll(".removeAccount")
.forEach(btn=>{

btn.onclick=(e)=>{

e.stopPropagation();

let accounts =
JSON.parse(
localStorage.getItem(
"hw_accounts"
)||"[]"
);

accounts =
accounts.filter(
a =>
a.uid !==
btn.dataset.uid
);

localStorage.setItem(
"hw_accounts",
JSON.stringify(accounts)
);

openAccountSwitcher();

};

});


document
.getElementById(
"addAccountRow"
)
.onclick=()=>{

localStorage.setItem(
"redirect_after_login",
location.href
);

location.href =
"signin.html";

};


document
.getElementById(
"createAccountBtn"
)
.onclick=()=>{

localStorage.setItem(
"redirect_after_login",
location.href
);

location.href="signup";

};

document
.getElementById(
"accountsCenterBtn"
)
.onclick=()=>{

window.location.href =
"account-center";

};

}

document.addEventListener("click",e=>{

if(
e.target.id==="switchAccountBtn"
){
openAccountSwitcher();
}

if(
e.target===switchModal
){
switchModal.style.display="none";
}

});

const style =
document.createElement("style");

style.innerHTML=`

@keyframes sheetUp{
from{
transform:translateY(100%);
}
to{
transform:translateY(0);
}
}

@keyframes popupIn{
from{
opacity:0;
transform:
translate(-50%,-45%);
}
to{
opacity:1;
transform:
translate(-50%,-50%);
}
}

`;

document.head.appendChild(style);


  // reposition on resize/scroll
  window.addEventListener("resize", () => { if (popup.style.display === "block") positionPopup(); });
  window.addEventListener("scroll", () => { if (popup.style.display === "block") positionPopup(); });
});
