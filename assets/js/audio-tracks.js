
  (function initDharmaAudioEngine() {
    const audioTracks = [
      {
        id: 0,
        title: "අඤ්ඤාකොණ්ඩඤ්ඤ මහරහතන් වහන්සේගේ අසිරිමත් මුනි ගුණ",
        cover: "assets/images/hero.jpg",
        src: "tracks/top/අඤ්ඤාකොණ්ඩඤ්ඤ මහරහතන් වහන්සේගේ අසිරිමත් මුනි ගුණ.MP3"
      },
      {
        id: 1,
        title: "නිගණ්ඨ දැලට හසු ව සිටි මහා නුවණැතියා වහා ධර්මයට පැමිණි අසිරිය ~ උපාලි සූත්‍රය",
        cover: "assets/images/hero.jpg",
        src: "tracks/top/නිගණ්ඨ දැලට හසු ව සිටි මහා නුවණැතියා වහා ධර්මයට පැමිණි අසිරිය ~ උපාලි සූත්‍රය.mp3"
      },
      {
        id: 2,
        title: "මේ අවස්ථාව හරියට තේරුම් ගත්තොත් ඔබ කවදාවත් ධර්මයේ හැසිරෙන්න ප්‍රමාද වෙන්නෙ නෑ. (අක්ඛණ සූත්‍රය)",
        cover: "assets/images/hero.jpg",
        src: "tracks/top/මේ අවස්ථාව හරියට තේරුම් ගත්තොත් ඔබ කවදාවත් ධර්මයේ හැසිරෙන්න ප්‍රමාද වෙන්නෙ නෑ. (අක්ඛණ සූත්‍රය).mp3"
      },
      {
        id: 3,
        title: "සිතේ ඇවිලෙන ගිනි නිවන දහම - වෙසක් පොහෝදා විශේෂ ධර්ම දේශනය",
        cover: "assets/images/hero.jpg",
        src: "tracks/top/සිතේ ඇවිලෙන ගිනි නිවන දහම - වෙසක් පොහෝදා විශේෂ ධර්ම දේශනය.mp3"
      }
    ];

    const audioElement = new Audio();
    audioElement.preload = "metadata";
    const container = document.getElementById('audioTrackList');
    
    // Bottom Player References
    const bottomPlayer = document.getElementById('bottomAudioPlayer');
    const bottomTrackTitle = document.getElementById('bottomTrackTitle');
    const bottomTrackImg = document.getElementById('bottomTrackImg');
    const bottomPlayIcon = document.getElementById('bottomPlayIcon');
    const bottomCurrentTime = document.getElementById('bottomCurrentTime');
    const bottomTotalDuration = document.getElementById('bottomTotalDuration');
    const bottomProgressBar = document.getElementById('bottomProgressBar');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');

    let currentTrackId = null;
    let lastVolume = 1;
    let isShuffle = false;
    let isRepeat = false;

    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return "00:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function seededRandom(seed) {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    // High Density 500-Bar Waveform Engine
    function generateWaveformBars(trackId, count = 500) {
      let barsHTML = '';
      let seed = (trackId + 1) * 7777;
      for (let i = 0; i < count; i++) {
        const rawRand = seededRandom(seed + i);
        const heightPercent = Math.floor(rawRand * 75) + 20;
        barsHTML += `<div class="wf-bar w-[1px] bg-slate-400/40 dark:bg-slate-600/50 transition-all duration-75 shrink-0" style="height: ${heightPercent}%"></div>`;
      }
      return barsHTML;
    }

    // Force Direct Browser File Download Engine
    window.forceDownloadFile = async function(url, filename) {
      const dlIcon = document.getElementById('dlIcon');
      const dlText = document.getElementById('dlText');
      try {
        if (dlIcon) dlIcon.className = "ri-loader-4-line animate-spin text-sm";
        if (dlText) dlText.textContent = "...";

        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'dharma-deshana.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        // Direct link fallback if fetch is blocked by CORS policy
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'dharma-deshana.mp3';
        link.target = "_self";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } finally {
        if (dlIcon) dlIcon.className = "ri-download-2-line text-sm";
        if (dlText) dlText.textContent = "Download";
      }
    };

    window.forceDownloadCurrentTrack = function() {
      if (currentTrackId !== null) {
        const track = audioTracks.find(t => t.id === currentTrackId);
        if (track) window.forceDownloadFile(track.src, `${track.title}.mp3`);
      }
    };

    function renderAudioCards() {
      container.innerHTML = '';

      audioTracks.forEach((track) => {
        const card = document.createElement('div');
        card.className = `group relative bg-[#f8f9fa] dark:bg-[#121824] border border-slate-200/90 dark:border-white/10 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-300 shadow-sm hover:border-orange-500/50 hover:shadow-md`;
        card.id = `track-card-${track.id}`;

        card.innerHTML = `
          <!-- Cover Thumbnail -->
          <div class="relative w-full sm:w-28 h-28 shrink-0 bg-slate-800 rounded-md overflow-hidden shadow-sm">
            <img src="${track.cover}" alt="${track.title}" class="w-full h-full object-cover" onError="this.onerror=null;this.src='assets/images/hero.jpg';" />
          </div>

          <!-- Main Track Info & 500-Bar Waveform -->
          <div class="flex-1 flex flex-col justify-between h-full min-w-0 space-y-2">
            
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <button onclick="window.togglePlayTrack(${track.id})" aria-label="Play Track" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md transform active:scale-95 transition">
                  <i id="play-icon-${track.id}" class="ri-play-fill text-2xl sm:text-3xl ml-0.5"></i>
                </button>

                <div class="min-w-0">
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400 block truncate font-['Inter',sans-serif]">
                    මහමෙව්නාව (Mahamevnawa)
                  </span>
                  <h3 class="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate font-['Noto_Serif_Sinhala',serif]" title="${track.title}">
                    ${track.title}
                  </h3>
                </div>
              </div>

              <div class="hidden sm:flex items-center shrink-0">
                <img src="https://blackhatdevelopers.netlify.app/assets/images/header-logo.png" alt="Header Logo" class="h-6 object-contain opacity-80 hover:opacity-100 transition" />
              </div>
            </div>

            <!-- Waveform Canvas -->
            <div class="relative py-2 group/wf cursor-pointer overflow-hidden" onclick="window.seekTrack(event, ${track.id})">
              <div id="waveform-${track.id}" class="h-11 flex items-end justify-between gap-[0.5px] w-full overflow-hidden px-0.5">
                ${generateWaveformBars(track.id, 500)}
              </div>

              <div class="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded select-none">
                <span id="time-display-${track.id}">00:00</span>
              </div>
            </div>

            <!-- Card Bottom Bar -->
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/80 dark:border-white/5">
              <div class="flex items-center gap-2">
                <button onclick="window.forceDownloadFile('${track.src}', '${track.title}.mp3')" class="flex items-center gap-1 hover:text-orange-500 transition text-[11px] font-medium border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 shadow-2xs">
                  <i class="ri-download-line"></i> Download
                </button>
              </div>
            </div>

          </div>
        `;

        container.appendChild(card);

        // Metadata load for individual durations
        const tempAudio = new Audio();
        tempAudio.src = track.src;
        tempAudio.addEventListener('loadedmetadata', () => {
          const timeEl = document.getElementById(`time-display-${track.id}`);
          if (timeEl && currentTrackId !== track.id) {
            timeEl.textContent = formatTime(tempAudio.duration);
          }
        });
      });
    }

    window.togglePlayTrack = function(id) {
      const track = audioTracks.find(t => t.id === id);
      if (!track) return;

      if (currentTrackId === id) {
        if (audioElement.paused) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
      } else {
        if (currentTrackId !== null) {
          updatePlayIcon(currentTrackId, false);
          resetWaveformUI(currentTrackId);
        }
        currentTrackId = id;
        audioElement.src = track.src;
        
        // Sync Bottom Player Data
        bottomTrackTitle.textContent = track.title;
        bottomTrackImg.src = track.cover;
        bottomPlayer.classList.remove('translate-y-full');

        audioElement.play();
      }
    };

    window.togglePlayActive = function() {
      if (currentTrackId === null) {
        window.togglePlayTrack(0);
      } else {
        if (audioElement.paused) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
      }
    };

    window.playNextTrack = function() {
      if (currentTrackId === null) return;
      let nextId;
      if (isShuffle) {
        nextId = Math.floor(Math.random() * audioTracks.length);
      } else {
        nextId = (currentTrackId + 1) % audioTracks.length;
      }
      window.togglePlayTrack(nextId);
    };

    window.playPreviousTrack = function() {
      if (currentTrackId === null) return;
      const prevId = (currentTrackId - 1 + audioTracks.length) % audioTracks.length;
      window.togglePlayTrack(prevId);
    };

    window.seekOffset = function(seconds) {
      if (!audioElement.duration) return;
      audioElement.currentTime = Math.max(0, Math.min(audioElement.duration, audioElement.currentTime + seconds));
    };

    window.toggleShuffle = function() {
      isShuffle = !isShuffle;
      if (shuffleBtn) {
        shuffleBtn.className = isShuffle 
          ? "hidden md:flex text-orange-500 bg-orange-500/10 p-1.5 transition rounded-full" 
          : "hidden md:flex text-slate-400 hover:text-orange-500 p-1.5 transition rounded-full";
      }
    };

    window.toggleRepeat = function() {
      isRepeat = !isRepeat;
      if (repeatBtn) {
        repeatBtn.className = isRepeat 
          ? "hidden md:flex text-orange-500 bg-orange-500/10 p-1.5 transition rounded-full" 
          : "hidden md:flex text-slate-400 hover:text-orange-500 p-1.5 transition rounded-full";
      }
    };

    window.closeBottomPlayer = function() {
      audioElement.pause();
      bottomPlayer.classList.add('translate-y-full');
    };

    function updatePlayIcon(id, isPlaying) {
      const icon = document.getElementById(`play-icon-${id}`);
      if (icon) {
        icon.className = isPlaying ? "ri-pause-fill text-2xl sm:text-3xl" : "ri-play-fill text-2xl sm:text-3xl ml-0.5";
      }
      if (id === currentTrackId) {
        bottomPlayIcon.className = isPlaying ? "ri-pause-fill text-lg sm:text-2xl" : "ri-play-fill text-lg sm:text-2xl ml-0.5";
      }
    }

    function resetWaveformUI(id) {
      const wfContainer = document.getElementById(`waveform-${id}`);
      if (!wfContainer) return;
      const bars = wfContainer.querySelectorAll('.wf-bar');
      bars.forEach(bar => {
        bar.classList.remove('bg-orange-500');
        bar.classList.add('bg-slate-400/40', 'dark:bg-slate-600/50');
      });
      const timeEl = document.getElementById(`time-display-${id}`);
      if (timeEl) timeEl.textContent = formatTime(audioElement.duration || 0);
    }

    window.seekTrack = function(e, id) {
      if (currentTrackId !== id) {
        window.togglePlayTrack(id);
      }
      setTimeout(() => {
        const wfContainer = document.getElementById(`waveform-${id}`);
        if (!wfContainer || !audioElement.duration) return;
        const rect = wfContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        audioElement.currentTime = percentage * audioElement.duration;
      }, 50);
    };

    window.seekFromBottomPlayer = function(e) {
      if (!audioElement.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      audioElement.currentTime = percentage * audioElement.duration;
    };

    window.changeVolume = function(val) {
      audioElement.volume = val;
      if (val == 0) {
        volumeIcon.className = "ri-volume-mute-line";
      } else if (val < 0.5) {
        volumeIcon.className = "ri-volume-down-line";
      } else {
        volumeIcon.className = "ri-volume-up-line";
      }
    };

    window.toggleMute = function() {
      if (audioElement.volume > 0) {
        lastVolume = audioElement.volume;
        window.changeVolume(0);
        volumeSlider.value = 0;
      } else {
        window.changeVolume(lastVolume || 1);
        volumeSlider.value = lastVolume || 1;
      }
    };

    // Global Listeners
    audioElement.addEventListener('play', () => {
      if (currentTrackId !== null) updatePlayIcon(currentTrackId, true);
    });

    audioElement.addEventListener('pause', () => {
      if (currentTrackId !== null) updatePlayIcon(currentTrackId, false);
    });

    audioElement.addEventListener('timeupdate', () => {
      if (currentTrackId === null || !audioElement.duration) return;

      const current = audioElement.currentTime;
      const total = audioElement.duration;
      const progress = current / total;

      const timeEl = document.getElementById(`time-display-${currentTrackId}`);
      if (timeEl) {
        timeEl.textContent = `${formatTime(current)} / ${formatTime(total)}`;
      }

      const wfContainer = document.getElementById(`waveform-${currentTrackId}`);
      if (wfContainer) {
        const bars = wfContainer.querySelectorAll('.wf-bar');
        const activeCount = Math.floor(progress * bars.length);

        bars.forEach((bar, index) => {
          if (index <= activeCount) {
            bar.classList.remove('bg-slate-400/40', 'dark:bg-slate-600/50');
            bar.classList.add('bg-orange-500');
          } else {
            bar.classList.remove('bg-orange-500');
            bar.classList.add('bg-slate-400/40', 'dark:bg-slate-600/50');
          }
        });
      }

      bottomCurrentTime.textContent = formatTime(current);
      bottomTotalDuration.textContent = formatTime(total);
      bottomProgressBar.style.width = `${progress * 100}%`;
    });

    audioElement.addEventListener('ended', () => {
      if (isRepeat) {
        audioElement.currentTime = 0;
        audioElement.play();
      } else {
        window.playNextTrack();
      }
    });

    renderAudioCards();
  })();

