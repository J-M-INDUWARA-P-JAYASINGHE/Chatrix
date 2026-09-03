// index.js - Theme toggle + mobile sidebar + small utilities



// theme management (store in localStorage)
const htmlEl = document.documentElement;
const THEME_KEY = 'hw_theme';

function applyTheme(theme) {
  if (theme === 'dark') {
    htmlEl.classList.add('dark');
    htmlEl.setAttribute('data-theme', 'dark');
    document.body.style.backgroundColor = '#000000';
  } else {
    htmlEl.classList.remove('dark');
    htmlEl.setAttribute('data-theme', 'light');
    document.body.style.backgroundColor = '';
  }
  localStorage.setItem(THEME_KEY, theme);
}

// load saved theme or system preference
const saved = localStorage.getItem(THEME_KEY);
if (saved) applyTheme(saved);
else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// toggle button (desktop)
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const cur = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// mobile sidebar open/close
const mobileOpen = document.getElementById('mobileOpen');
const mobileClose = document.getElementById('mobileClose');
const mobileSidebar = document.getElementById('mobileSidebar');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

if (mobileOpen && mobileSidebar) {
  mobileOpen.addEventListener('click', () => {
    mobileSidebar.classList.remove('-translate-x-full');
  });
}
if (mobileClose && mobileSidebar) {
  mobileClose.addEventListener('click', () => {
    mobileSidebar.classList.add('-translate-x-full');
  });
}
if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener('click', () => {
    const cur = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (!mobileSidebar) return;
  if (!mobileSidebar.classList.contains('-translate-x-full')) {
    const sidebarRect = mobileSidebar.getBoundingClientRect();
    // if clicked outside sidebar
    if (e.target instanceof Element && !mobileSidebar.contains(e.target) && !e.target.closest('#mobileOpen')) {
      mobileSidebar.classList.add('-translate-x-full');
    }
  }
});













/* Sticky Header */
const hwHeader=document.getElementById("hwHeader");
window.addEventListener("scroll",()=>hwHeader.classList.toggle("scrolled",window.scrollY>10));

/* Active link */
const current=window.location.pathname;
document.querySelectorAll(".hw-nav").forEach(a=>{
  if(current.includes(a.getAttribute("href"))) a.classList.add("active");
});

/* Sidebar */
const hwOpen=document.getElementById("hwMenuOpen");
const hwClose=document.getElementById("hwMenuClose");
const sidebar=document.getElementById("hwSidebar");
const overlay=document.getElementById("hwOverlay");

hwOpen.onclick=()=>{
  sidebar.classList.add("active");
  overlay.classList.add("visible");
};
hwClose.onclick=closeSidebar;
overlay.onclick=closeSidebar;

function closeSidebar(){
  sidebar.classList.remove("active");
  overlay.classList.remove("visible");
}

/* Desktop Notification */
const bellPC=document.getElementById("hwBellPC");
const notifPC=document.getElementById("hwNotifPC");

bellPC?.addEventListener("click",()=>{
  notifPC.classList.toggle("hidden");
});

/* Mobile Notification */
const bellM=document.getElementById("hwBellM");
const notifM=document.getElementById("hwNotifM");

bellM?.addEventListener("click",()=>{
  notifM.classList.toggle("hidden");
});

/* Close dropdowns when clicking outside */
document.addEventListener("click",(e)=>{
  
  if (!bellPC?.contains(e.target) && !notifPC?.contains(e.target)){
    notifPC?.classList.add("hidden");
  }

  if (!bellM?.contains(e.target) && !notifM?.contains(e.target)){
    notifM?.classList.add("hidden");
  }

});





















(function () {
  const bellPC = document.getElementById("hwBellPC");
  const bellM  = document.getElementById("hwBellM");
  const frame  = document.getElementById("hwNotifFrame");
  const box    = document.getElementById("hwNotifBox");
  const close  = document.getElementById("hwNotifClose");
  const oldPC  = document.getElementById("hwNotifPC");
  const oldM   = document.getElementById("hwNotifM");

  function openNotif() {
    oldPC?.classList.add("hidden");
    oldM?.classList.add("hidden");
    frame.classList.remove("hidden");
  }

  function closeNotif() {
    frame.classList.add("hidden");
  }

  // Open
  bellPC?.addEventListener("click", openNotif);
  bellM?.addEventListener("click", openNotif);

  // Close icon
  close?.addEventListener("click", closeNotif);

  // Click outside to close
  frame.addEventListener("click", (e) => {
    if (!box.contains(e.target)) {
      closeNotif();
    }
  });
})();


























 const images = document.querySelectorAll('.parallax-img');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    images.forEach(img => {
      const speed = img.style.getPropertyValue('--speed');
      img.style.transform =
        `translate(-50%, ${scrollY * speed * -0.15}px)`;
    });
  });
















 const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach(item => observer.observe(item));



  













  (() => {
  const btn = document.getElementById("bhMegaBtn");
  const wrap = btn?.closest(".bh-mega");

  if (!btn || !wrap) return;

  btn.addEventListener("click", e => {
    e.stopPropagation();
    wrap.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    wrap.classList.remove("open");
  });
})();
























(() => {
  const section = document.getElementById("bh-delivery");
  const loader  = document.getElementById("bh-delivery-loader");
  const content = document.getElementById("bh-delivery-content");

  if (!section || !content) return;

  // Detect mobile (safe + simple)
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // ✅ MOBILE: skip loader completely
  if (isMobile) {
    if (loader) loader.style.display = "none";
    content.classList.remove("opacity-0", "translate-y-4");
    return;
  }

  // ✅ DESKTOP: show loader with 1s delay
  let revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;

    if (loader) loader.style.display = "none";
    content.classList.remove("opacity-0", "translate-y-4");
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(reveal, 1000); // 1s loader
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -20% 0px"
    }
  );

  observer.observe(section);

  // Safety fallback (never stuck)
  setTimeout(reveal, 3000);
})();







 function toggleHeroVideo() {
    const video = document.getElementById('heroVideo');
    const btn = document.querySelector('.video-control');

    if (video.paused) {
      video.play();
      btn.textContent = '⏸';
    } else {
      video.pause();
      btn.textContent = '▶';
    }
  }



/* YEAR */
document.getElementById("msYear").textContent =
  new Date().getFullYear();

/* REGION */
(function () {
  const el = document.getElementById("msRegion");
  if (!el) return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const map = {

    /* ================= ASIA ================= */
    "Asia/Colombo": "Sri Lanka",
    "Asia/Kolkata": "India",
    "Asia/Dhaka": "Bangladesh",
    "Asia/Karachi": "Pakistan",
    "Asia/Kathmandu": "Nepal",
    "Asia/Thimphu": "Bhutan",
    "Asia/Yangon": "Myanmar",
    "Asia/Bangkok": "Thailand",
    "Asia/Phnom_Penh": "Cambodia",
    "Asia/Vientiane": "Laos",
    "Asia/Hanoi": "Vietnam",
    "Asia/Jakarta": "Indonesia",
    "Asia/Pontianak": "Indonesia",
    "Asia/Makassar": "Indonesia",
    "Asia/Jayapura": "Indonesia",
    "Asia/Manila": "Philippines",
    "Asia/Kuala_Lumpur": "Malaysia",
    "Asia/Kuching": "Malaysia",
    "Asia/Singapore": "Singapore",
    "Asia/Brunei": "Brunei",
    "Asia/Shanghai": "China",
    "Asia/Urumqi": "China",
    "Asia/Beijing": "China",
    "Asia/Hong_Kong": "Hong Kong",
    "Asia/Macau": "Macau",
    "Asia/Taipei": "Taiwan",
    "Asia/Seoul": "South Korea",
    "Asia/Tokyo": "Japan",
    "Asia/Pyongyang": "North Korea",
    "Asia/Ulaanbaatar": "Mongolia",
    "Asia/Tashkent": "Uzbekistan",
    "Asia/Samarkand": "Uzbekistan",
    "Asia/Bishkek": "Kyrgyzstan",
    "Asia/Almaty": "Kazakhstan",
    "Asia/Aqtau": "Kazakhstan",
    "Asia/Dushanbe": "Tajikistan",
    "Asia/Ashgabat": "Turkmenistan",
    "Asia/Kabul": "Afghanistan",
    "Asia/Tehran": "Iran",
    "Asia/Baghdad": "Iraq",
    "Asia/Kuwait": "Kuwait",
    "Asia/Qatar": "Qatar",
    "Asia/Bahrain": "Bahrain",
    "Asia/Dubai": "United Arab Emirates",
    "Asia/Abu_Dhabi": "United Arab Emirates",
    "Asia/Muscat": "Oman",
    "Asia/Riyadh": "Saudi Arabia",
    "Asia/Aden": "Yemen",
    "Asia/Amman": "Jordan",
    "Asia/Jerusalem": "Israel",
    "Asia/Beirut": "Lebanon",
    "Asia/Damascus": "Syria",

    /* ================= EUROPE ================= */
    "Europe/London": "United Kingdom",
    "Europe/Dublin": "Ireland",
    "Europe/Paris": "France",
    "Europe/Monaco": "Monaco",
    "Europe/Berlin": "Germany",
    "Europe/Vienna": "Austria",
    "Europe/Zurich": "Switzerland",
    "Europe/Rome": "Italy",
    "Europe/Madrid": "Spain",
    "Europe/Lisbon": "Portugal",
    "Europe/Andorra": "Andorra",
    "Europe/Amsterdam": "Netherlands",
    "Europe/Brussels": "Belgium",
    "Europe/Luxembourg": "Luxembourg",
    "Europe/Copenhagen": "Denmark",
    "Europe/Oslo": "Norway",
    "Europe/Stockholm": "Sweden",
    "Europe/Helsinki": "Finland",
    "Europe/Tallinn": "Estonia",
    "Europe/Riga": "Latvia",
    "Europe/Vilnius": "Lithuania",
    "Europe/Warsaw": "Poland",
    "Europe/Prague": "Czech Republic",
    "Europe/Bratislava": "Slovakia",
    "Europe/Budapest": "Hungary",
    "Europe/Athens": "Greece",
    "Europe/Sofia": "Bulgaria",
    "Europe/Bucharest": "Romania",
    "Europe/Belgrade": "Serbia",
    "Europe/Zagreb": "Croatia",
    "Europe/Ljubljana": "Slovenia",
    "Europe/Sarajevo": "Bosnia and Herzegovina",
    "Europe/Skopje": "North Macedonia",
    "Europe/Podgorica": "Montenegro",
    "Europe/Tirane": "Albania",
    "Europe/Chisinau": "Moldova",
    "Europe/Kyiv": "Ukraine",
    "Europe/Minsk": "Belarus",
    "Europe/Moscow": "Russia",
    "Europe/Kaliningrad": "Russia",

    /* ================= AFRICA ================= */
    "Africa/Cairo": "Egypt",
    "Africa/Tripoli": "Libya",
    "Africa/Tunis": "Tunisia",
    "Africa/Algiers": "Algeria",
    "Africa/Casablanca": "Morocco",
    "Africa/Khartoum": "Sudan",
    "Africa/Juba": "South Sudan",
    "Africa/Addis_Ababa": "Ethiopia",
    "Africa/Nairobi": "Kenya",
    "Africa/Kampala": "Uganda",
    "Africa/Dar_es_Salaam": "Tanzania",
    "Africa/Kigali": "Rwanda",
    "Africa/Bujumbura": "Burundi",
    "Africa/Lagos": "Nigeria",
    "Africa/Accra": "Ghana",
    "Africa/Abidjan": "Ivory Coast",
    "Africa/Dakar": "Senegal",
    "Africa/Bamako": "Mali",
    "Africa/Nouakchott": "Mauritania",
    "Africa/Freetown": "Sierra Leone",
    "Africa/Monrovia": "Liberia",
    "Africa/Johannesburg": "South Africa",
    "Africa/Cape_Town": "South Africa",
    "Africa/Gaborone": "Botswana",
    "Africa/Windhoek": "Namibia",
    "Africa/Harare": "Zimbabwe",
    "Africa/Lusaka": "Zambia",
    "Africa/Maputo": "Mozambique",
    "Africa/Antananarivo": "Madagascar",

    /* ================= AMERICAS ================= */
    "America/New_York": "United States",
    "America/Detroit": "United States",
    "America/Chicago": "United States",
    "America/Denver": "United States",
    "America/Phoenix": "United States",
    "America/Los_Angeles": "United States",
    "America/Anchorage": "United States",
    "America/Adak": "United States",
    "America/Toronto": "Canada",
    "America/Montreal": "Canada",
    "America/Vancouver": "Canada",
    "America/Edmonton": "Canada",
    "America/Winnipeg": "Canada",
    "America/Halifax": "Canada",
    "America/St_Johns": "Canada",
    "America/Mexico_City": "Mexico",
    "America/Cancun": "Mexico",
    "America/Guatemala": "Guatemala",
    "America/Belize": "Belize",
    "America/Tegucigalpa": "Honduras",
    "America/San_Salvador": "El Salvador",
    "America/Managua": "Nicaragua",
    "America/Costa_Rica": "Costa Rica",
    "America/Panama": "Panama",
    "America/Havana": "Cuba",
    "America/Jamaica": "Jamaica",
    "America/Santo_Domingo": "Dominican Republic",
    "America/Puerto_Rico": "Puerto Rico",
    "America/Bogota": "Colombia",
    "America/Lima": "Peru",
    "America/Quito": "Ecuador",
    "America/Caracas": "Venezuela",
    "America/La_Paz": "Bolivia",
    "America/Asuncion": "Paraguay",
    "America/Santiago": "Chile",
    "America/Montevideo": "Uruguay",
    "America/Buenos_Aires": "Argentina",
    "America/Sao_Paulo": "Brazil",
    "America/Rio_Branco": "Brazil",
    "America/Manaus": "Brazil",
    "America/Recife": "Brazil",

    /* ================= OCEANIA ================= */
    "Australia/Sydney": "Australia",
    "Australia/Melbourne": "Australia",
    "Australia/Brisbane": "Australia",
    "Australia/Adelaide": "Australia",
    "Australia/Perth": "Australia",
    "Australia/Darwin": "Australia",
    "Pacific/Auckland": "New Zealand",
    "Pacific/Chatham": "New Zealand",
    "Pacific/Fiji": "Fiji",
    "Pacific/Tongatapu": "Tonga",
    "Pacific/Apia": "Samoa",
    "Pacific/Port_Moresby": "Papua New Guinea",
    "Pacific/Guadalcanal": "Solomon Islands",
    "Pacific/Tarawa": "Kiribati"
  };

  el.textContent = map[tz] || "Worldwide Operations";
})();













