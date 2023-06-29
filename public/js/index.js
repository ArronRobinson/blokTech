const addToWatchlistButtons = document.querySelectorAll('.add-to-watchlist');

// Itereer over elk "Add to Watchlist" -knop-element en voeg een klikgebeurtenisluisteraar toe
addToWatchlistButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    const movieId = button.getAttribute('data-movie-id');

    try {
      // Stuur een POST-verzoek naar de "/list" -route om de film aan de watchlist toe te voegen
      const response = await fetch('/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (response.ok) {
        // Film succesvol toegevoegd aan de watchlist
        alert('Movie added to watchlist!');
        window.location.reload(); // Vernieuw de pagina
      } else {
        // Behandel de fout
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      alert('An error occurred while adding the movie to the watchlist.');
    }
  });
});

//progressive enhancement

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("javascript-disabled").style.display = "none";
});