  (function initDhammapadaEngine() {
    const dhammapadaVerses = [
      {
        source: "ධම්මපද පාළි - යමක වග්ගය (ගාථා අංකය: 1)",
        pali1: "“මනෝපුබ්බංගමා ධම්මා මනෝසෙට්ඨා මනෝමයා, මනසා චේ පදුට්ඨේන භාසති වා කරෝති වා,”",
        meaning1: "සියලු ධර්මයෝ සිත පෙරටු කොට ඇත්තාහ. සිතම ප්‍රධාන කොට ඇත්තාහ. කිපුණු සිතින් යමක් කියයිද කරයිද,",
        pali2: "තතෝ නං දුක්ඛමන්වේති චක්කංව වහතෝ පදං.”",
        meaning2: "ගොනා පස්සේ යන රථ රෝදය මෙන් දුක ඔහු පස්සේ යයි."
      },
      {
        source: "ධම්මපද පාළි - යමක වග්ගය (ගාථා අංකය: 2)",
        pali1: "“මනෝපුබ්බංගමා ධම්මා මනෝසෙට්ඨා මනෝමයා, මනසා චේ පසන්නේන භාසති වා කරෝති වා,”",
        meaning1: "සියලු ධර්මයෝ සිත පෙරටු කොට ඇත්තාහ. සිතම ප්‍රධාන කොට ඇත්තාහ. පැහැදුණු සිතින් යමක් කියයිද කරයිද,",
        pali2: "තතෝ නං සුඛමන්වේති ඡායාව අනපායිනී.”",
        meaning2: "නොවනස්ව යන සෙවනැල්ල මෙන් සැපය ඔහු පස්සේ යයි."
      },
      {
        source: "ධම්මපද පාළි - යමක වග්ගය (ගාථා අංකය: 5)",
        pali1: "“න හි වේරේන වේරානි සම්මන්තීධ කුදාචනං,”",
        meaning1: "මෙලොව වෛර කිරීමෙන් වෛරයෝ කිසි කලෙකත් නොසංසිඳෙති.",
        pali2: "අවේරේන ච සම්මන්ති ඒස ධම්මෝ සනන්තනෝ.”",
        meaning2: "අවෛරයෙන්ම සංසිඳෙති. මෙය සනාථන ධර්මයකි."
      },
      {
        source: "ධම්මපද පාළි - අප්පමාද වග්ගය (ගාථා අංකය: 21)",
        pali1: "“අප්පමාදෝ අමතපදං පමාදෝ මච්චුනෝ පදං,”",
        meaning1: "නොපමා බව අමෘතයට මාර්ගයයි. ප්‍රමාදය මෘත්‍යුවට මාර්ගයයි.",
        pali2: "අප්පමත්තා න මීයන්ති යේ පමත්තා යථා මතා.”",
        meaning2: "නොපමාවූවෝ නොමැරෙති, ප්‍රමාද වූවෝ මළවුන් වැන්නාහ."
      },
      {
        source: "ධම්මපද පාළි - චිත්ත වග්ගය (ගාථා අංකය: 35)",
        pali1: "“දුන්නිග්ගහස්ස ලහුනෝ යත්ථකාමනිපාතිනෝ,”",
        meaning1: "ග්‍රහණයට දුෂ්කර වූ, සැහැල්ලු වූ, කැමති තැනෙක වැටෙන සිත දමනය කිරීම යහපති.",
        pali2: "චිත්තස්ස දමථෝ සාධු චිත්තං දන්තං සුඛාවහං.”",
        meaning2: "දමනය කළ සිත සැප ගෙනදෙයි."
      },
      {
        source: "ධම්මපද පාළි - පණ්ඩිත වග්ගය (ගාථා අංකය: 81)",
        pali1: "“සේලෝ යථා ඒකඝනෝ වාතේන න සමීරති,”",
        meaning1: "තනි ගල් පර්වතයක් සුළඟින් නොසැලෙන්නාක් මෙන්,",
        pali2: "ඒවං නින්දාපසංසාසු න සමිඤ්ජන්ති පණ්ඩිතා.”",
        meaning2: "පණ්ඩිතයෝ නින්දා ප්‍රශංසා හමුවේ නොසැලෙති."
      },
      {
        source: "ධම්මපද පාළි - බුද්ධ වග්ගය (ගාථා අංකය: 183)",
        pali1: "“සබ්බපාපස්ස අකරණං කුසලස්ස උපසම්පදා,”",
        meaning1: "සියලු පව් නොකිරීමද, කුසල් රැස්කිරීමද,",
        pali2: "සචිත්තපරියෝදපනං ඒතං බුද්ධාන සාසනං.”",
        meaning2: "සිය සිත පිරිසිදු කිරීමද යන මෙය බුදුවරුන්ගේ අනුසාසනාවයි."
      }
    ];

    function getDailyVerse() {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      return dhammapadaVerses[dayOfYear % dhammapadaVerses.length];
    }

    function renderVerse(data) {
      document.getElementById('dpPaliText1').textContent = data.pali1;
      document.getElementById('dpSinhalaMeaning1').textContent = data.meaning1;
      document.getElementById('dpPaliText2').textContent = data.pali2;
      document.getElementById('dpSinhalaMeaning2').textContent = data.meaning2;
      document.getElementById('dpSourceText').textContent = data.source;
    }

    renderVerse(getDailyVerse());
  })();

