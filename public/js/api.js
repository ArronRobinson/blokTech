fetch("https://api.themoviedb.org/3/discover/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb")
  .then(response => response.json())
  .then(data => {
    console.log(data.results[0].title);
    data.results.forEach(title => {
      // Create an image element
      var img = document.createElement("img");

      // Set the source attribute to the movie poster URL
      img.src = "http://image.tmdb.org/t/p/w500/" + title.poster_path;

      // Add the "img-responsive" class for styling (optional)
      img.classList.add("img-responsive");

      // Append the image element to the desired container on your page
      document.getElementById("poster-container").appendChild(img);

      console.log(title.title);
    });
  })
  .catch(error => {
    console.log(error);
  }); 