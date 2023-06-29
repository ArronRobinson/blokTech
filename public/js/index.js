const addToWatchlistButtons = document.querySelectorAll('.add-to-watchlist');
addToWatchlistButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    const movieId = button.getAttribute('data-movie-id');

    try {
      const response = await fetch('/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (response.ok) {
        // Movie added to watchlist successfully
        alert('Movie added to watchlist!');
        window.location.reload(); // Refresh the page
      } else {
        // Handle error
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      alert('An error occurred while adding the movie to the watchlist.');
    }
  });
});