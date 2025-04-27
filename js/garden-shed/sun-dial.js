// Logic specific to the Sun Dial page

document.addEventListener('DOMContentLoaded', () => {
  const seasonIconElement = document.getElementById('season-icon');
  const seasonTextElement = document.getElementById('season-text');
  const seasonDatesElement = document.getElementById('season-dates');

  // Only run if the specific elements for this page exist
  if (!seasonIconElement || !seasonTextElement || !seasonDatesElement) {
      return;
  }

  console.log("Sun Dial script loaded.");

  // Define seasons (Northern Hemisphere default, adjust months for Southern)
  const seasons = {
      spring: { name: "Spring", icon: "🌸", months: [2, 3, 4], dates: "Mar - May" }, // Mar, Apr, May
      summer: { name: "Summer", icon: "☀️", months: [5, 6, 7], dates: "Jun - Aug" }, // Jun, Jul, Aug
      autumn: { name: "Autumn", icon: "🍂", months: [8, 9, 10], dates: "Sep - Nov" }, // Sep, Oct, Nov
      winter: { name: "Winter", icon: "❄️", months: [11, 0, 1], dates: "Dec - Feb" }  // Dec, Jan, Feb
  };

  // Function to get current season
  function getCurrentSeason() {
      const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
      for (const seasonKey in seasons) {
          if (seasons[seasonKey].months.includes(currentMonth)) {
              return seasons[seasonKey];
          }
      }
      return seasons.winter; // Default fallback
  }

  // Update the display
  function displaySeason() {
      const currentSeason = getCurrentSeason();
      seasonIconElement.textContent = currentSeason.icon;
      seasonTextElement.textContent = currentSeason.name;
      seasonDatesElement.textContent = `(${currentSeason.dates})`;

      // Optional: Add a class to the body for season-specific styling overrides
      // document.body.classList.add(`current-${currentSeason.name.toLowerCase()}`);
  }

  // Initial display
  displaySeason();

  // Optional: Update periodically if needed, though season changes slowly
  // setInterval(displaySeason, 60 * 60 * 1000); // Check every hour

}); // End DOMContentLoaded
