// Logic specific to the Root Zone page

document.addEventListener('DOMContentLoaded', () => {
  // Check if we are actually on the Root Zone page
  const resetButton = document.getElementById('reset-seeds-button'); // Check for a unique element
  if (!resetButton) {
      return; // Exit if not on the right page
  }

  console.log("Root Zone script loaded.");

  const resetCountersButton = document.getElementById('reset-counters-button');

  // Function to reset Seed Box notes
  function resetSeeds() {
      if (confirm('Reset your Seed Box notes? This cannot be undone.')) {
          localStorage.removeItem('seedBoxNotes'); // Use the correct key
          alert('🌱 Seed Box notes reset.');
      }
  }

  // Function to handle counter reset (placeholder)
  function resetCounters() {
      // IMPORTANT: Resetting CountAPI requires API keys and server-side logic
      // or using their reset functionality if available publicly (unlikely/unsafe).
      // This is just a placeholder alert.
      alert('📈 Counter reset requires protected access. This is a placeholder.');
      // Example of how you *might* call a protected function if you had one:
      // fetch('/.netlify/functions/reset-counters', { method: 'POST' })
      //   .then(res => res.json())
      //   .then(data => alert(data.message))
      //   .catch(err => alert('Error resetting counters.'));
  }

  // Attach listeners to buttons
  resetButton.addEventListener('click', resetSeeds);

  if (resetCountersButton) {
      resetCountersButton.addEventListener('click', resetCounters);
  }

  // Add listeners or functions for future tools here...

}); // End DOMContentLoaded
