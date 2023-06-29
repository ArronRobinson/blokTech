// Een HTTP GET-verzoek naar de themoviedb.org API sturen om filmgegevens op te halen
fetch("https://api.themoviedb.org/3/discover/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb")
  .then(response => response.json()) // De JSON-response omzetten naar een JavaScript-object
  .then(data => {
    console.log(data.results[0].title); // Log de titel van de eerste film in de console

    // Itereer over elk filmobject in de array "results" in de ontvangen gegevens
    data.results.forEach(title => {
      // Een img-element maken
      var img = document.createElement("img");

      // De bronattribuut instellen op de URL van de filmposter
      img.src = "http://image.tmdb.org/t/p/w500/" + title.poster_path;

      // De "img-responsive" klasse toevoegen voor stijling (optioneel)
      img.classList.add("img-responsive");

      // Het img-element toevoegen aan de gewenste container op de pagina
      document.getElementById("poster-container").appendChild(img);

      console.log(title.title); // Log de titel van elke film in de console
    });
  })
  .catch(error => {
    console.log(error); // Log eventuele fouten naar de console
  });