document.addEventListener('DOMContentLoaded', () => {

  // --- Configuration ---
  const themesConfig = {
    desktop: ['crt', 'pixel', 'neon', 'zen'], // Add more theme slugs
    mobile: ['pixel', 'neon', 'zen'],
    defaultDesktop: 'crt',
    defaultMobile: 'pixel'
  };
  const bootMessages = [ /* ... Keep as before ... */
    "Initializing RetroVerse BIOS v1.0...", "Loading Memory Banks...", "Checking Disk Drives...",
    "Bootstrapping Modules...", "Activating CRT Terminal...", "Deploying Landing Interface...",
    "Planting Dream Seeds...", "Tending Digital Soil...", "Waking the Hidden Grove..."
  ];
  const gardenQuotes = [ /* ... Keep as before ... */
    "🌱 Seeds become worlds.", "🌸 Patience grows ideas.", "🚀 Dreams take root here.",
    "🌿 Even the smallest bloom matters.", "🌻 Tended creativity becomes beauty.",
    "🍃 Growth whispers to those who listen.", "🌷 From one thought, a whole garden.",
    "✨ Where wonder lingers, magic blooms.", "🌌 Grow beyond the known stars."
  ];
  const menuLinks = { /* ... Keep as before ... */
    '1': "#books", '2': "#games", '3': "#tools", '4': "#apps",
    '5': "index.html", '6': "#resume", '7': "#github"
  };
  const FLOWERS_TO_UNLOCK_GROVE = 20;
  const COUNT_API_NAMESPACE = 'retroverse-gardens';

  // --- DOM Element References ---
  const body = document.body;
  const biosLoadingDiv = document.getElementById('bios-loading');
  const themeStyleLink = document.getElementById('theme-style');
  const plantedFlowersContainer = document.getElementById('planted-flowers');
  const typingTextElement = document.getElementById('typing-text');
  const cursorElement = typingTextElement ? typingTextElement.querySelector('.cursor') : null;
  const gardenQuotesElement = document.getElementById('garden-quotes');
  const visitCountElement = document.getElementById('visit-count');
  const uniqueCountElement = document.getElementById('unique-count');
  const plantCountElement = document.getElementById('plant-count');
  const secretPortalArea = document.getElementById('secret-portal-area');
  const bbsInputElement = document.getElementById('bbs-input');
  const bbsMessageElement = document.getElementById('bbs-message');
  const audioBreeze = document.getElementById('breeze');
  // Grove specific elements (check if they exist)
  const petalRainContainer = document.getElementById('rain');
  const hiddenWhisperTrigger = document.querySelector('.hidden-whisper');
  const hiddenWhisperMessage = document.getElementById('whisper-message');


  // --- State Variables ---
  let currentThemeIndex = 0;
  let flowerCount = parseInt(localStorage.getItem('plantedFlowerCount') || '0', 10); // Load local count for unlock
  let availableThemes = [];
  let isMobile = false;

  // --- Helper Functions ---

  function animateCount(element, finalValue, duration = 2000) { /* ... Keep as before ... */
    if (!element) return;
    let startTimestamp = null;
    const startValue = parseInt(element.textContent.replace(/,/g, '') || '0', 10) || 0;
    const endValue = Number.isFinite(finalValue) ? finalValue : startValue;
    const range = endValue - startValue;
    if (range === 0) { element.textContent = endValue.toLocaleString(); return; }
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(startValue + progress * range).toLocaleString();
      if (progress < 1) { window.requestAnimationFrame(step); }
      else { element.textContent = endValue.toLocaleString(); }
    }
    window.requestAnimationFrame(step);
  }

  function setTheme(themeSlug) { /* ... Keep as before ... */
    if (!themeStyleLink || !themeSlug) return;
    themeStyleLink.setAttribute('href', `css/themes/${themeSlug}.css`);
    body.className = `theme-${themeSlug}`; // Base class name reflects theme
    if (themeSlug === 'crt' && !isMobile) {
      body.classList.add('crt'); // Add crt effect class if needed
    }
     // Add page specific class if needed (e.g. for hidden grove)
     if (document.title.includes("Hidden Grove")) { // Simple check based on title
         body.classList.add('page-hidden-grove');
     } else if (document.title.includes("Garden Journal")) {
         body.classList.add('page-garden-journal');
     } // etc.
    localStorage.setItem('gardenTheme', themeSlug);
    console.log(`Theme set to: ${themeSlug}`);
  }


  function toggleTheme() { /* ... Keep as before ... */
    currentThemeIndex = (currentThemeIndex + 1) % availableThemes.length;
    setTheme(availableThemes[currentThemeIndex]);
  }
  window.toggleTheme = toggleTheme; // Make global

  function typeWriter(element, text, speed = 100) { /* ... Keep as before ... */
    if (!element || !cursorElement) return;
    while (element.firstChild && element.firstChild !== cursorElement) {
      element.removeChild(element.firstChild);
    }
    let i = 0;
    function typing() {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(i)), cursorElement);
        i++;
        setTimeout(typing, speed);
      } else {
         if(cursorElement) cursorElement.style.animationPlayState = 'running';
      }
    }
     if(cursorElement) cursorElement.style.animationPlayState = 'paused';
    typing();
  }

  function showRandomQuote() { /* ... Keep as before ... */
    if (!gardenQuotesElement || gardenQuotes.length === 0) return;
    const randomQuote = gardenQuotes[Math.floor(Math.random() * gardenQuotes.length)];
    gardenQuotesElement.style.opacity = 0;
    setTimeout(() => {
        gardenQuotesElement.textContent = randomQuote;
        gardenQuotesElement.style.opacity = 1;
        gardenQuotesElement.style.animation = 'none';
        void gardenQuotesElement.offsetWidth;
        gardenQuotesElement.style.animation = '';
    }, 500);
  }

  // Plant Flower Function (now also saves count locally)
  function plantFlower(event) { /* ... Keep mostly as before ... */
     if (event.target.closest('button, a, input, .secret-portal, .garden-footer-nav, .theme-toggle')) {
        return;
     }
     // ... (rest of flower creation and positioning logic as before) ...
     // Example using appending to body with fixed positioning:
     const newFlower = document.createElement('div');
     newFlower.className = 'flower';
     newFlower.style.position = 'fixed';
     newFlower.style.left = `${event.clientX - 5}px`; // Adjust for flower size center
     newFlower.style.top = `${event.clientY - 5}px`;
     newFlower.style.animation = 'grow 0.5s ease-out forwards, sway 6s ease-in-out infinite 0.5s';
     document.body.appendChild(newFlower);

     // Remove oldest flower if too many (optional performance tweak)
     const maxFlowers = 50;
     const currentPlanted = document.querySelectorAll('body > .flower'); // Select only directly planted flowers
     if(currentPlanted.length > maxFlowers) {
         document.body.removeChild(currentPlanted[0]);
     }


     // Increment counters
     flowerCount++;
     localStorage.setItem('plantedFlowerCount', flowerCount); // Save locally for unlock persistence
     fetch(`https://api.countapi.xyz/hit/${COUNT_API_NAMESPACE}/flowers`)
      .then(response => response.json())
      .then(data => animateCount(plantCountElement, data.value))
      .catch(error => console.error("Error incrementing plant count:", error));

     // Check for secret grove unlock
     if (flowerCount >= FLOWERS_TO_UNLOCK_GROVE && !document.querySelector('.secret-portal')) {
      unlockSecretGrove();
     }
  }

  function unlockSecretGrove() { /* ... Keep as before ... */
      if (!secretPortalArea) return;
      secretPortalArea.innerHTML = `
        <div class="secret-portal">
          🌟 A Hidden Grove Awaits... <br>
          <button onclick='window.location.href="hidden-grove.html"'>Enter</button>
        </div>`;
  }
  window.goHiddenGrove = () => { window.location.href="hidden-grove.html"; };


  function fetchCounters() { /* ... Keep as before ... */
    Promise.all([
      fetch(`https://api.countapi.xyz/hit/${COUNT_API_NAMESPACE}/visits`).then(res => res.json()),
      fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/visitors`).then(res => res.json()),
      fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/flowers`).then(res => res.json())
    ])
    .then(([visitsData, uniqueData, plantsData]) => {
      animateCount(visitCountElement, visitsData.value);
      animateCount(uniqueCountElement, uniqueData.value);
      animateCount(plantCountElement, plantsData.value);
    })
    .catch(error => console.error("Error fetching counters:", error));
     fetch(`https://api.countapi.xyz/hit/${COUNT_API_NAMESPACE}/visitors`).catch(e => console.error("Error hitting unique counter", e));
  }

  // --- Hidden Grove Specific Functions ---
  function startPetalRain() {
      if (!petalRainContainer) return;
      const numPetals = 25;
      for (let i = 0; i < numPetals; i++) {
          const petal = document.createElement('div');
          petal.className = 'petal';
          petal.style.left = Math.random() * 100 + 'vw';
          petal.style.animationDuration = (8 + Math.random() * 7) + 's';
          petal.style.animationDelay = Math.random() * 5 + 's';
          petal.style.opacity = 0.4 + Math.random() * 0.4;
          // You might need to adjust the animation keyframes ('fall') in garden.css
          petalRainContainer.appendChild(petal);
      }
      console.log("Petal rain started.");
  }

  function setupWhisperReveal() {
      if (!hiddenWhisperTrigger || !hiddenWhisperMessage) return;
      hiddenWhisperTrigger.addEventListener('click', () => {
          hiddenWhisperMessage.style.display = 'block';
          hiddenWhisperTrigger.style.display = 'none'; // Hide trigger after click
           console.log("Whisper revealed.");
      });
  }


  // --- Initialization on Load ---
  function initGarden() {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
    availableThemes = isMobile ? themesConfig.mobile : themesConfig.desktop;

    // Set initial theme
    const savedTheme = localStorage.getItem('gardenTheme');
    let initialTheme = isMobile ? themesConfig.defaultMobile : themesConfig.defaultDesktop;
    if (savedTheme && availableThemes.includes(savedTheme)) {
      initialTheme = savedTheme;
    }
    currentThemeIndex = availableThemes.indexOf(initialTheme);
    if (currentThemeIndex === -1) currentThemeIndex = 0;
    setTheme(availableThemes[currentThemeIndex]); // Applies theme CSS and body class

    // Check if we are on a specific page (like Hidden Grove)
    const isOnHiddenGrove = body.classList.contains('page-hidden-grove');
    const isOnGardenIndex = !isOnHiddenGrove && !body.classList.contains('page-garden-journal'); // Adjust if more pages added

    // Handle BIOS screen (Only on main Garden page on Desktop)
    if (biosLoadingDiv) {
        if (!isMobile && isOnGardenIndex) { // Show BIOS only on main page desktop
            randomBootMessage();
            setTimeout(() => {
                biosLoadingDiv.style.opacity = '0';
                setTimeout(() => biosLoadingDiv.style.display = 'none', 500);
            }, 1500);
        } else {
            biosLoadingDiv.style.display = 'none'; // Hide immediately otherwise
        }
    }

    // Start typing effect (Only on main Garden page)
    if (typingTextElement && isOnGardenIndex) {
      setTimeout(() => {
        typeWriter(typingTextElement, "More Blooms Coming...");
      }, isMobile ? 500 : 2000);
    }

    // Quotes (Only on main Garden page)
    if(gardenQuotesElement && isOnGardenIndex) {
        showRandomQuote();
        setInterval(showRandomQuote, 10000);
    }

    // Fetch counters (Only on main Garden page)
    if(visitCountElement && uniqueCountElement && plantCountElement && isOnGardenIndex){
        fetchCounters();
    }

    // Add flower planting listener (Only on main Garden page)
    if(isOnGardenIndex){
        document.body.addEventListener('click', plantFlower);
         // Check unlock status on load (in case they planted 20 before)
        if (flowerCount >= FLOWERS_TO_UNLOCK_GROVE && !document.querySelector('.secret-portal')) {
             unlockSecretGrove();
        }
    }

    // Hidden Grove specific setup
    if(isOnHiddenGrove) {
        startPetalRain();
        setupWhisperReveal();
    }

    // Enable sound (listener added once for the whole playground)
    if (audioBreeze) {
      const enableSound = () => {
        audioBreeze.muted = false;
        audioBreeze.play().catch(e => console.error("Audio play failed:", e));
      };
      document.body.addEventListener('click', enableSound, { once: true });
      document.body.addEventListener('keypress', enableSound, { once: true });
    }

    // Add BBS input listener (only if the element exists and CRT theme is active)
    if (bbsInputElement && body.classList.contains('theme-crt')) {
        bbsInputElement.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const val = bbsInputElement.value.trim();
                if (menuLinks[val]) {
                     // Simple hash navigation example for SPA feel within page
                     // Or could trigger JS functions based on number
                     window.location.hash = menuLinks[val].substring(1);
                     console.log(`Navigating to section: ${menuLinks[val]}`);
                } else {
                    if(bbsMessageElement) bbsMessageElement.textContent = "Invalid Option.";
                    setTimeout(() => {
                        if(bbsMessageElement) bbsMessageElement.textContent = "";
                        // bbsInputElement.focus(); // Maybe don't refocus
                    }, 1500);
                }
                bbsInputElement.value = "";
            }
        });
        bbsInputElement.focus(); // Auto-focus on load in CRT mode
    }


    console.log("RetroVerse Gardens Initialized. Current Theme:", availableThemes[currentThemeIndex]);
  }

  // --- Run Initialization ---
  initGarden();

}); // End DOMContentLoaded
