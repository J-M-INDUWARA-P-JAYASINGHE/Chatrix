// 1. Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1EB3XUMWptxOHz0uXebC4ZBTPfFcKgZE",
  authDomain: "sadaham-maga.firebaseapp.com",
  projectId: "sadaham-maga",
  appId: "1:227536909225:web:6df27c989720ca74808ab8",
};

// Initialize Firebase App & Firestore using global firebase object
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. Format date: "June 4th, 2026"
function formatOrdinalDate(dateObj) {
  if (!dateObj) return "";
  const date = typeof dateObj.toDate === "function" ? dateObj.toDate() : new Date(dateObj);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinal = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  return `${month} ${day}${getOrdinal(day)}, ${year}`;
}

// 3. Load Latest 6 Articles
async function loadLatestSixArticles() {
  const gridContainer = document.getElementById("latestNewsGrid");
  const loader = document.getElementById("latestNewsLoader");

  if (!gridContainer) {
    console.error("Target container 'latestNewsGrid' was not found in the DOM.");
    return;
  }

  try {
    const snapshot = await db.collection("articles")
      .orderBy("createdAt", "desc")
      .limit(6)
      .get();

    if (!snapshot.empty) {
      gridContainer.innerHTML = ""; // Clear loader/placeholders

      snapshot.docs.forEach((docSnap) => {
        const article = docSnap.data();
        const articleId = docSnap.id;

        const imageSrc = article.mainImage && article.mainImage.trim() !== "" 
          ? article.mainImage 
          : "assets/images/open-graph-image-news.png";

        const formattedDate = formatOrdinalDate(article.createdAt);

        const card = document.createElement("article");
        card.className = "group cursor-pointer flex flex-col";
        card.innerHTML = `
          <!-- Image Wrapper -->
          <div class="aspect-video w-full overflow-hidden mb-4 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <img 
              src="${imageSrc}" 
              alt="${article.headline || ''}" 
              loading="lazy" 
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Headline -->
          <h3 class="text-lg font-bold text-[#c86414] hover:text-[#a34f0d] transition-colors leading-snug mb-2">
            ${article.headline || ''}
          </h3>

          <!-- Date -->
          <div class="text-xs text-slate-400 dark:text-slate-500 mb-3 font-medium">
            ${formattedDate}
          </div>

          <!-- Summary -->
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
            ${article.summary || ''}
          </p>
        `;

        card.onclick = () => {
          window.location.href = `sadaham-lipi?id=${articleId}`;
        };

        gridContainer.appendChild(card);
      });
    }

    if (loader) loader.remove();
    gridContainer.classList.remove("hidden");
  } catch (err) {
    console.error("Error loading articles from Firestore:", err);
    if (loader) loader.remove();
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadLatestSixArticles);
} else {
  loadLatestSixArticles();
}