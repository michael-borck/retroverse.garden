document.addEventListener('DOMContentLoaded', () => {

  // --- Configuration ---
  const themes = {
    desktop: ['crt', 'pixel', 'neon', 'zen', 'code', 'space'], // Add theme slugs here
    mobile: ['pixel', 'neon', 'zen', 'code', 'space'] // Exclude CRT/BBS for mobile
    // Add more theme slugs as you create their CSS files in css/themes/
  };
  const defaultThemeDesktop = 'crt';
  const defaultThemeMobile = 'pixel'; // Example: start mobile with Pixel theme

  const bootMessages = [
    "Initializing RetroVerse BIOS v1.0...", "Loading Memory Banks...", "Checking Disk Drives...",
    "Bootstrapping Modules...", "Activating CRT Terminal...", "Deploying Landing Interface...",
    "Planting Dream Seeds...", "Tending Digital Soil...", "Waking the Hidden Grove..."
  ];

  const gardenQuotes = [
    "🌱 Seeds become worlds.", "🌸 Patience grows ideas.", "🚀 Dreams take root here.",
    "🌿 Even the smallest bloom matters.", "🌻 Tended creativity becomes beauty.",
    "🍃 Growth whispers to those who listen.", "🌷 From one thought, a whole garden.",
    "✨ Where wonder lingers, magic blooms.", "🌌 Grow beyond the known stars."
  ];

  const menuLinks = { // For BBS theme interaction (if re-added later) or future use
    '1': "#books", '2': "#games", '3': "#tools", '4': "#apps",
    '5': "index.html", '6': "#resume", '7': "#github"
  };

  const FLOWERS_TO_UNLOCK_GROVE = 20;

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
  const bbsInputElement = document.getElementById('bbs-input'); // Keep reference if BBS interaction added later
  const bbsMessageElement = document.getElementById('bbs-message'); // Keep reference
  const audioBreeze = document.getElementById('breeze'); // Optional sound

  // --- State Variables ---
  let currentThemeIndex = 0;
  let flowerCount = 0; // Local count for unlocking grove
  let availableThemes = [];
  let isMobile = window.matchMedia("(max-width: 768px)").matches; // Broader breakpoint

  // --- Helper Functions ---

  // Animate Counters Gently
  function animateCount(element, finalValue, duration = 2000) {
    if (!element) return;
    let startTimestamp = null;
    const startValue = 0;
    // Ensure finalValue is a number, default to 0 if not
    const endValue = Number.isFinite(finalValue) ? finalValue : 0;
    const range = endValue - startValue;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(startValue + progress * range).toLocaleString(); // Format number

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = endValue.toLocaleString(); // Ensure exact final number
      }
    }
    window.requestAnimationFrame(step);
  }

  // Set Theme Function (updates CSS link)
  function setTheme(themeSlug) {
    if (!themeStyleLink) return;
    themeStyleLink.setAttribute('href', `css/themes/${themeSlug}.css`);
    // Also update body class if needed for specific JS/CSS overrides not in theme files
    body.className = `theme-${themeSlug}`; // Remove old theme classes first
    if (themeSlug === 'crt' && !isMobile) { // Keep crt effect class if needed
        body.classList.add('crt');
    } else {
        body.classList.remove('crt');
    }
    console.log(`Theme set to: ${themeSlug}`);
  }

  // Toggle Theme Function
  function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % availableThemes.length;
    setTheme(availableThemes[currentThemeIndex]);
  }
  // Make toggleTheme globally accessible for the button
  window.toggleTheme = toggleTheme;

  // Typing Effect
  function typeWriter(element, text, speed = 100) {
    if (!element || !cursorElement) return;
    // Clear existing text except cursor
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
        cursorElement.style.animationPlayState = 'running'; // Resume blinking
      }
    }
    cursorElement.style.animationPlayState = 'paused'; // Pause blinking while typing
    typing();
  }

  // Show Random Garden Quote
  function showRandomQuote() {
    if (!gardenQuotesElement) return;
    const randomQuote = gardenQuotes[Math.floor(Math.random() * gardenQuotes.length)];
    gardenQuotesElement.textContent = randomQuote;
    // Trigger reflow to restart animation - optional
    gardenQuotesElement.style.animation = 'none';
    void gardenQuotesElement.offsetWidth; // Reflow trick
    gardenQuotesElement.style.animation = '';
  }

  // Plant Flower Function
  function plantFlower(event) {
     // Check if the click is on the main container or background, not on interactive elements
     if (event.target.closest('button, a, input, .secret-portal')) {
        return; // Don't plant on interactive elements
     }

     if (!plantedFlowersContainer) return;

     const newFlower = document.createElement('div');
     newFlower.className = 'flower';
     // Position relative to the click within the container if desired, or just add to field
     // Example: planting within the flower field div
     const rect = plantedFlowersContainer.getBoundingClientRect();
     newFlower.style.position = 'absolute'; // Position dynamically
     // Adjust click position relative to the container/body if needed
     newFlower.style.left = `${event.clientX - rect.left}px`; // Example positioning
     newFlower.style.top = `${event.clientY - rect.top}px`; // Example positioning

     // Fallback if positioning is complex: just append to the container
     // plantedFlowersContainer.appendChild(newFlower);

     // **Correction:** Append to the designated container, use relative positioning within it.
     const flowerField = document.querySelector('.flower-field');
     if (flowerField) {
         const fieldRect = flowerField.getBoundingClientRect();
         const xPos = event.clientX - fieldRect.left;
         const yPos = event.clientY - fieldRect.top;

         // Constrain positions within the field if needed
         if (xPos >= 0 && xPos <= fieldRect.width && yPos >= 0 && yPos <= fieldRect.height) {
            newFlower.style.position = 'absolute';
            newFlower.style.left = `${xPos}px`;
            newFlower.style.top = `${yPos}px`;
            // Override animation temporarily to make it 'appear'
            newFlower.style.animation = 'grow 0.5s ease-out forwards, sway 6s ease-in-out infinite 0.5s';
            plantedFlowersContainer.appendChild(newFlower); // Append to the dedicated div
            flowerCount++;
            // Increment API counter
            fetch('https://api.countapi.xyz/hit/retroverse-gardens/flowers')
              .then(response => response.json())
              .then(data => animateCount(plantCountElement, data.value));

            // Check for secret grove unlock
            if (flowerCount === FLOWERS_TO_UNLOCK_GROVE && !document.querySelector('.secret-portal')) {
              unlockSecretGrove();
            }
         }
     }
  }

  // Unlock Secret Grove
  function unlockSecretGrove() {
      if (!secretPortalArea) return;
      const secretPortal = document.createElement('div');
      secretPortal.className = 'secret-portal'; // Use class for styling
      secretPortal.innerHTML = `🌟 A Hidden Grove Awaits... <br><button onclick='window.location.href="hidden-grove.html"'>Enter</button>`;
      secretPortalArea.appendChild(secretPortal);
  }
   // Make globally accessible if button is added dynamically
   window.goHiddenGrove = () => { window.location.href="hidden-grove.html"; };


  // Fetch Counters Function
  function fetchCounters() {
    // Total Visits
    fetch('https://api.countapi.xyz/hit/retroverse-gardens/visits')
      .then(response => response.json())
      .then(data => animateCount(visitCountElement, data.value))
      .catch(error => console.error("Error fetching visit count:", error));

    // Unique Visitors (Species)
    fetch('https://api.countapi.xyz/get/retroverse-gardens/visitors') // Use 'get' to not increment unique count on every load
      .then(response => response.json())
      .then(data => animateCount(uniqueCountElement, data.value))
      .catch(error => console.error("Error fetching unique count:", error));

    // Flowers Planted
    fetch('https://api.countapi.xyz/get/retroverse-gardens/flowers') // Use 'get' for initial load
      .then(response => response.json())
      .then(data => animateCount(plantCountElement, data.value))
      .catch(error => console.error("Error fetching plant count:", error));
  }

  // --- Initialization on Load ---
  function initGarden() {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
    availableThemes = isMobile ? themes.mobile : themes.desktop;
    const defaultTheme = isMobile ? defaultThemeMobile : defaultThemeDesktop;

    // Set initial theme
    const savedTheme = localStorage.getItem('gardenTheme');
    if (savedTheme && availableThemes.includes(savedTheme)) {
      const savedIndex = availableThemes.indexOf(savedTheme);
      currentThemeIndex = savedIndex !== -1 ? savedIndex : 0;
      setTheme(savedTheme);
    } else {
      currentThemeIndex = availableThemes.indexOf(defaultTheme);
      if (currentThemeIndex === -1) currentThemeIndex = 0; // Fallback
      setTheme(availableThemes[currentThemeIndex]);
    }


    // Handle BIOS screen
    if (biosLoadingDiv) {
        if (!isMobile) {
            randomBootMessage();
            setTimeout(() => {
                biosLoadingDiv.style.display = 'none'; // Hide instead of remove to avoid layout shifts
            }, 1500); // BIOS delay
        } else {
            biosLoadingDiv.style.display = 'none'; // Hide immediately on mobile
        }
    }


    // Start typing effect after a delay
    if (typingTextElement) {
      setTimeout(() => {
        typeWriter(typingTextElement, "More Blooms Coming...");
      }, isMobile ? 1000 : 2500); // Faster start on mobile
    }

    // Show first quote and set interval
    showRandomQuote();
    setInterval(showRandomQuote, 8000);

    // Fetch initial counter values
    fetchCounters();

    // Add flower planting listener
    document.body.addEventListener('click', plantFlower);

    // Add sound enablement listener
    if (audioBreeze) {
        const enableSound = () => {
            audioBreeze.muted = false;
            audioBreeze.play().catch(e => console.error("Audio play failed:", e));
            // Remove listener after first interaction
            document.body.removeEventListener('click', enableSound);
            document.body.removeEventListener('keypress', enableSound);
        };
        document.body.addEventListener('click', enableSound, { once: true });
        document.body.addEventListener('keypress', enableSound, { once: true });
    }

    // Add BBS input listener (if element exists)
    if (bbsInputElement) {
        bbsInputElement.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const val = bbsInputElement.value.trim();
                if (menuLinks[val]) {
                    // Navigate or trigger action
                     window.location.hash = menuLinks[val].substring(1); // Simple hash navigation
                     // Or: document.querySelector(menuLinks[val]).scrollIntoView();
                } else {
                    if(bbsMessageElement) bbsMessageElement.textContent = "Invalid Option.";
                    setTimeout(() => {
                        if(bbsMessageElement) bbsMessageElement.textContent = "";
                        bbsInputElement.value = "";
                        // bbsInputElement.focus(); // Re-focus might be annoying
                    }, 1500);
                }
                bbsInputElement.value = ""; // Clear input after Enter
            }
        });
    }

  }

  initGarden(); // Run initialization

}); // End DOMContentLoaded
