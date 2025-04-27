// Logic specific to the Bloom Board (Journal Generator) page

document.addEventListener('DOMContentLoaded', () => {
  // Ensure this script only runs fully on the bloom board page
  // We can check for the existence of a specific element unique to this page
  const generateButton = document.getElementById('generate-button');
  if (!generateButton) {
      // Not on the bloom board page, do nothing further specific to it
      return;
  }

  console.log("Bloom Board script loaded."); // For debugging

  const COUNT_API_NAMESPACE = 'retroverse-gardens'; // Ensure this matches garden.js if needed, or define locally

  const outputElement = document.getElementById('journal-output');
  const copyButton = outputElement ? outputElement.querySelector('.copy-button') : null;

  // Templates for journal entries by season
  const entryTemplates = {
    spring: [
      (f, e, v) => `🌸 In the soft rains of Spring, ${f.toLocaleString()} new blooms opened.\n🌿 ${e.toLocaleString()} wanderers crossed the meadows.\n🚀 The winds whispered across ${v.toLocaleString()} pathways.`,
      (f, e, v) => `🌱 New life stirred — ${f.toLocaleString()} flowers, ${e.toLocaleString()} souls, ${v.toLocaleString()} journeys begun.`
    ],
    summer: [
      (f, e, v) => `☀️ Summer bathed the gardens in warmth.\n🌸 ${f.toLocaleString()} blossoms thrived under endless skies.\n🌿 ${e.toLocaleString()} explorers danced among ${v.toLocaleString()} sunlit trails.`,
      (f, e, v) => `🌻 Under the sun's gaze, ${f.toLocaleString()} blooms unfurled.\n🚀 ${v.toLocaleString()} journeys crisscrossed the living fields.`
    ],
    autumn: [
      (f, e, v) => `🍂 Leaves fell like memories.\n🌸 ${f.toLocaleString()} blooms faded into golden hues.\n🌿 ${e.toLocaleString()} travelers paused upon ${v.toLocaleString()} drifting paths.`,
      (f, e, v) => `🌾 Harvest winds carried ${f.toLocaleString()} whispers of growth.\n🌿 ${e.toLocaleString()} souls lingered in the fading light.`
    ],
    winter: [
      (f, e, v) => `❄️ The Gardens slept beneath frost.\n🌸 ${f.toLocaleString()} dreams rested quietly.\n🌿 ${e.toLocaleString()} wanderers crossed ${v.toLocaleString()} snowy trails.`,
      (f, e, v) => `🌬️ Snow blanketed old blooms.\n🌸 ${f.toLocaleString()} hopes waited for Spring.\n🌿 ${e.toLocaleString()} brave souls journeyed forth.`
    ]
  };

  // Reflection quotes
  const reflectionQuotes = [
    '"Seeds become worlds." 🌱', '"Every bloom begins with curiosity." 🌸',
    '"Patience grows ideas." 🌿', '"Dreams take root where wonder lingers." 🚀',
    '"In quiet gardens, futures grow." 🌱', '"Tended in silence, beauty awakens." 🌸'
  ];

  // Function to generate the entry
  async function generateEntry() {
    if (!outputElement) return;
    outputElement.innerHTML = '<em>Generating entry... please wait...</em>';
    if (copyButton) copyButton.style.display = 'none';

    try {
      // Fetch all stats concurrently
      const [visitsData, uniqueData, plantsData] = await Promise.all([
        fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/visits`).then(res => res.ok ? res.json() : { value: 0 }), // Add fallback
        fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/visitors`).then(res => res.ok ? res.json() : { value: 0 }),
        fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/flowers`).then(res => res.ok ? res.json() : { value: 0 })
      ]);

      const visits = visitsData.value || 0;
      const flowers = plantsData.value || 0;
      const explorers = uniqueData.value || 0;

      // Determine season
      const month = new Date().getMonth();
      let season = 'winter'; // Default
      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';

      // Select random template and quote
      const templateFn = entryTemplates[season][Math.floor(Math.random() * entryTemplates[season].length)];
      const entryText = templateFn(flowers, explorers, visits);
      const quote = reflectionQuotes[Math.floor(Math.random() * reflectionQuotes.length)];

      // Format the full entry for display and copying
      const fullEntryHTML = `
<article class="journal-entry">
<div class="journal-date">${season.charAt(0).toUpperCase() + season.slice(1)} ${new Date().getFullYear()}</div>
<p>
  ${entryText.replace(/\n/g, '<br>')}
</p>
<div class="journal-quote">
  ${quote}
</div>
</article>
      `;

      // Display the generated HTML structure as text for easy copy/paste
      outputElement.textContent = fullEntryHTML.trim();
      if (copyButton) copyButton.style.display = 'inline-block';

    } catch (error) {
      console.error("Error generating journal entry:", error);
      outputElement.innerHTML = '<em>Error fetching garden stats. Please try again.</em>';
    }
  }

  // Function to copy the generated entry
  function copyEntry() {
    if (!outputElement) return;
    const entryText = outputElement.textContent; // Copy the raw text/HTML
    navigator.clipboard.writeText(entryText).then(() => {
      alert('Journal entry HTML copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy entry. Please copy manually.');
    });
  }

  // Make functions globally available for inline onclick, or attach listeners here
  window.generateEntry = generateEntry; // Make global for onclick
  window.copyEntry = copyEntry; // Make global for onclick

  // Alternative: Attach listener directly
  // if (generateButton) {
  //   generateButton.addEventListener('click', generateEntry);
  // }
  // if (copyButton) {
  //   copyButton.addEventListener('click', copyEntry);
  // }

}); // End DOMContentLoaded
