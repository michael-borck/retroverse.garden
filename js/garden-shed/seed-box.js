// Logic specific to the Seed Box page

document.addEventListener('DOMContentLoaded', () => {
  const notesTextArea = document.getElementById('seed-notes');

  // Only run Seed Box logic if the textarea exists on the page
  if (!notesTextArea) {
      return;
  }

  console.log("Seed Box script loaded."); // For debugging

  const STORAGE_KEY = 'seedBoxNotes'; // Use a constant for the key

  // Load saved seeds on page load
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  if (savedNotes) {
      notesTextArea.value = savedNotes;
  }

  // Save seeds function
  function saveNotes() {
      localStorage.setItem(STORAGE_KEY, notesTextArea.value);
      alert('🌱 Seeds saved locally.'); // Simple confirmation
  }

  // Clear seeds function
  function clearNotes() {
      // Confirmation dialog
      if (confirm('Are you sure you want to clear all saved seeds? This cannot be undone.')) {
          notesTextArea.value = ''; // Clear the textarea
          localStorage.removeItem(STORAGE_KEY); // Remove from storage
          alert('🗑️ Seeds cleared.');
      }
  }

  // Make functions globally available for inline onclick attributes
  // Alternatively, attach listeners directly
  window.saveNotes = saveNotes;
  window.clearNotes = clearNotes;

  // Example of attaching listeners directly (remove onclick from HTML if using this)
  /*
  const saveButton = document.querySelector('button[onclick="saveNotes()"]'); // Find button more robustly if needed
  const clearButton = document.querySelector('button.clear-button');

  if (saveButton) {
      saveButton.addEventListener('click', saveNotes);
  }
  if (clearButton) {
      clearButton.addEventListener('click', clearNotes);
  }
  */

}); // End DOMContentLoaded
