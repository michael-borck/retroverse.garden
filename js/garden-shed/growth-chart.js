// Logic specific to the Growth Chart page

document.addEventListener('DOMContentLoaded', () => {
  const visitCountElement = document.getElementById('visit-count');
  const uniqueCountElement = document.getElementById('unique-count');
  const plantCountElement = document.getElementById('plant-count');

  // Only run if the specific counter elements exist
  if (!visitCountElement || !uniqueCountElement || !plantCountElement) {
      return;
  }

  console.log("Growth Chart script loaded.");

  const COUNT_API_NAMESPACE = 'retroverse-gardens'; // Ensure consistency

  // Animate Counters Gently Function (Copied from garden.js for self-containment, or could be imported if using modules)
  function animateCount(element, finalValue, duration = 2000) {
      if (!element) return;
      let startTimestamp = null;
      // Start from 0 or current displayed value if already populated
      const startValue = parseInt(element.textContent.replace(/,/g, '') || '0', 10) || 0;
      const endValue = Number.isFinite(finalValue) ? finalValue : startValue;
      const range = endValue - startValue;

      if (range === 0) {
          element.textContent = endValue.toLocaleString();
          return;
      }

      function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentCount = Math.floor(startValue + progress * range);
          element.textContent = currentCount.toLocaleString();

          if (progress < 1) {
              window.requestAnimationFrame(step);
          } else {
              element.textContent = endValue.toLocaleString(); // Ensure exact final number
          }
      }
      window.requestAnimationFrame(step);
  }

  // Fetch Stats Function
  function fetchGrowthStats() {
      Promise.all([
          // Use 'get' for all stats on this page as it's just displaying, not incrementing
          fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/visits`).then(res => res.ok ? res.json() : { value: 0 }),
          fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/visitors`).then(res => res.ok ? res.json() : { value: 0 }),
          fetch(`https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/flowers`).then(res => res.ok ? res.json() : { value: 0 })
      ])
      .then(([visitsData, uniqueData, plantsData]) => {
          animateCount(visitCountElement, visitsData.value);
          animateCount(uniqueCountElement, uniqueData.value);
          animateCount(plantCountElement, plantsData.value);
      })
      .catch(error => {
          console.error("Error fetching growth stats:", error);
          // Optionally display an error message to the user
          if(visitCountElement) visitCountElement.textContent = 'Error';
          if(uniqueCountElement) uniqueCountElement.textContent = 'Error';
          if(plantCountElement) plantCountElement.textContent = 'Error';
      });
  }

  // Initial fetch
  fetchGrowthStats();

}); // End DOMContentLoaded
