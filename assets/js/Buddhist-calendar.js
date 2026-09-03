
  (function initBuddhistCalendarEngine() {
    let currentDate = new Date();
    const today = new Date();

    const sinhalaDays = [
      { main: 'රිවි දින', alt: '(ඉරිදා)' },
      { main: 'සඳු දින', alt: '(සඳුදා)' },
      { main: 'කුජ දින', alt: '(අඟහරුවාදා)' },
      { main: 'බුද දින', alt: '(බදාදා)' },
      { main: 'ගුරු දින', alt: '(බ්‍රහස්පතින්දා)' },
      { main: 'ශුක්‍ර දින', alt: '(සිකුරාදා)' },
      { main: 'ශනි දින', alt: '(සෙනසුරාදා)' }
    ];

    const sinhalaMonths = [
      'දුරුතු මස',   // Jan
      'නවනම් මස',  // Feb
      'මැදින් මස',   // Mar
      'බක් මස',     // Apr
      'වෙසක් මස',    // May
      'පොසොන් මස',   // Jun
      'ඇසළ මස',    // Jul
      'නිකිණි මස',   // Aug
      'බිනර මස',    // Sep
      'වප් මස',     // Oct
      'ඉල් මස',     // Nov
      'උඳුප් මස'    // Dec
    ];

    // Full Moon Poya Day Lookup Map (YYYY-MM-DD)
    const poyaDaysData = {
      '2026-01-03': 'දුරුතු පෝය',
      '2026-02-01': 'නවනම් පෝය',
      '2026-03-03': 'මැදින් පෝය',
      '2026-04-01': 'බක් පෝය',
      '2026-05-01': 'වෙසක් පෝය',
      '2026-05-31': 'අධි වෙසක් පෝය',
      '2026-06-29': 'පොසොන් පෝය',
      '2026-07-29': 'ඇසළ පෝය',
      '2026-08-27': 'නිකිණි පෝය',
      '2026-09-26': 'බිනර පෝය',
      '2026-10-25': 'වප් පෝය',
      '2026-11-24': 'ඉල් පෝය',
      '2026-12-23': 'උඳුප් පෝය'
    };

    function formatDateKey(year, monthIndex, dayNum) {
      const m = String(monthIndex + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      return `${year}-${m}-${d}`;
    }

    function renderMonthGrid(date) {
      const grid = document.getElementById('calDaysGrid');
      const title = document.getElementById('calMonthYearTitle');
      const subTitle = document.getElementById('calMonthSinhalaSub');
      const poyaNote = document.getElementById('calPoyaMonthNote');

      if (!grid || !title) return;

      grid.innerHTML = '';

      const year = date.getFullYear();
      const month = date.getMonth();

      title.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (subTitle) subTitle.textContent = sinhalaMonths[month] + ' (' + (year + 543) + ' B.E.)';

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let monthPoyaText = '';

      // Blank lead cells
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'py-2.5';
        grid.appendChild(emptyCell);
      }

      // Populate month dates
      for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        const dateKey = formatDateKey(year, month, day);
        const poyaName = poyaDaysData[dateKey];
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        if (poyaName) {
          monthPoyaText = `${day} වෙනිදා - ${poyaName}`;
        }

        dayCell.className = 'py-2 rounded-md transition cursor-default font-bold flex items-center justify-center relative group min-h-[42px]';

        if (poyaName) {
          // Yellow-to-Orange Badge for Poya Day
          dayCell.innerHTML = `
            <span class="w-9 h-9 rounded-md bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-500 text-slate-950 font-black flex items-center justify-center border border-yellow-300 shadow-md transition transform hover:scale-105">
              ${day}
            </span>
            <div class="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-yellow-300 text-xs px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap font-['Noto_Serif_Sinhala',serif] z-20 border border-orange-500/30">
              🌕 ${poyaName}
            </div>
          `;
        } else if (isToday) {
          // Highlight today with Yellow-Orange Gradient
          dayCell.className += ' bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-950 font-black shadow-md scale-105';
          dayCell.textContent = day;
        } else {
          // Regular day
          dayCell.className += ' text-gray-800 dark:text-gray-200 hover:bg-orange-500/10 dark:hover:bg-white/10 hover:text-orange-600 dark:hover:text-yellow-300';
          dayCell.textContent = day;
        }

        grid.appendChild(dayCell);
      }

      if (poyaNote) {
        poyaNote.textContent = monthPoyaText ? `🌕 ${monthPoyaText}` : '';
      }
    }

    function updateDayCard() {
      const now = new Date();
      const year = now.getFullYear();
      const monthIndex = now.getMonth();
      const dateNum = now.getDate();
      const dayIndex = now.getDay();
      const beYear = year + 543;

      const calCardBeYear = document.getElementById('calCardBeYear');
      const calCardMonthSinhala = document.getElementById('calCardMonthSinhala');
      const calCardDayNumber = document.getElementById('calCardDayNumber');
      const calCardDaySinhala = document.getElementById('calCardDaySinhala');
      const calCardDaySinhalaBracket = document.getElementById('calCardDaySinhalaBracket');
      const calCardGregorianYear = document.getElementById('calCardGregorianYear');

      if (calCardBeYear) calCardBeYear.textContent = beYear;
      if (calCardMonthSinhala) calCardMonthSinhala.textContent = sinhalaMonths[monthIndex];
      if (calCardDayNumber) calCardDayNumber.textContent = dateNum;
      if (calCardDaySinhala) calCardDaySinhala.textContent = sinhalaDays[dayIndex].main;
      if (calCardDaySinhalaBracket) calCardDaySinhalaBracket.textContent = sinhalaDays[dayIndex].alt;
      if (calCardGregorianYear) calCardGregorianYear.textContent = year + ' AD';
    }

    function updateLiveClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const clockEl = document.getElementById('calCardLiveClock');
      if (clockEl) clockEl.textContent = timeStr;
    }

    // Navigation Events
    document.getElementById('calPrevMonthBtn')?.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderMonthGrid(currentDate);
    });

    document.getElementById('calNextMonthBtn')?.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderMonthGrid(currentDate);
    });

    document.getElementById('calTodayBtn')?.addEventListener('click', () => {
      currentDate = new Date();
      renderMonthGrid(currentDate);
    });

    // Run Engine
    renderMonthGrid(currentDate);
    updateDayCard();
    updateLiveClock();

    // Intervals
    setInterval(updateLiveClock, 1000);
    setInterval(() => {
      updateDayCard();
      renderMonthGrid(currentDate);
    }, 3600000);
  })();

