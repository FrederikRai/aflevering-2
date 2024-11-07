// Album constructor function
function Album(artist, album, totalTracks, releaseYear, trackList) {
  this.artist = artist;
  this.album = album;
  this.totalTracks = totalTracks;
  this.releaseYear = releaseYear;
  this.trackList = trackList; // Indeholder alle track objekter
  //Gør så oplysningerne fra Json filen som er blevet hentet ind kan struktureres nemmere
}
// Henter JSON-data
// Async gør funktionen asykron... altså så den kan hente oplysningerne fra json uden at stoppe hele processen. Await gør så man venter med at gå videre derfra indtil man har hentet alle oplysningerne fra json. Skulle der gå noget galt i processen, vil catch fange det og skrive i console log
async function fetchAlbums() {
  try {
    const response = await fetch('./Albums.json');
    const albums = await response.json();
    return albums;
  } catch (error) {
    console.error("Kunne ikke hente albumdata:", error);
  }
}

// displayAlbums er en ny funktion jeg laver til at kunne fremvise albums på hjemmesiden
// og jeg bruger parentid til at lave en cointainer
function displayAlbums(albumObjects, parentId) {
  const container = document.getElementById(parentId);

  albumObjects.forEach(album => {
    // Opret album div
    const albumDiv = document.createElement('div');
    albumDiv.classList.add('album');

    // Opretter album-info div til at holde kolonneinfo om albummet, altså oplysningerne bliver puttet på html siden.
    const albumInfo = document.createElement('div');
    albumInfo.classList.add('album-info');
    albumInfo.innerHTML = `
      <h3>${album.artist}</h3>
      <p>Album: ${album.album}</p>
      <p>Tracks: ${album.totalTracks}</p>
      <p>Year: ${album.releaseYear}</p>
    `;

    // Tilføj album-info til album div
    albumDiv.appendChild(albumInfo);

    // Opret knap til at vise/skjule sangene
    const toggleButton = document.createElement('button');
    toggleButton.textContent = "Vis numre";
    albumDiv.appendChild(toggleButton);

    // Her laver jeg en ny div kaldt trakclist. Den indeholder sangene fra de album fra json. linje 54 er sat til none så man ikke kan se sangene før man trykker på knappen
    const tracksDiv = document.createElement('div');
    tracksDiv.classList.add('trackList');
    tracksDiv.style.display = 'none';

    // Tilføjer hver sang og for hver sang der tilføjes bliver de sat ind som et nyt p element.
    album.trackList.forEach(track => {
      const trackItem = document.createElement('p');
      trackItem.textContent = `${track.trackNumber}. ${track.trackTitle}`;

      // Tilføj varighed som tooltip, som vises når musen holdes over sangen. Hvis man holder musen over en specifik sang kan man se hvor mange sekunder sangen er. hvis den koden ikke kan finde tiden på sangen, vil den i konsolen skrive det. 
      if (track.trackTimeInSeconds !== undefined) {
        trackItem.title = `Varighed: ${track.trackTimeInSeconds} sekunder`;
      } else {
        console.warn(`Ingen varighed fundet for sang: ${track.trackTitle}`);
      }

      tracksDiv.appendChild(trackItem);
    });

    // Tilføj trackList til album div
    albumDiv.appendChild(tracksDiv);

    // Klik-event for at vise/skjule sangene. gør netop så hvis man trykker på knappen vil sangene poppe ud og knappen vil ændre sig til skjul numre
    //else gør så hvis der ikke bliver vist nogle sange, vil der stå vis numre. 
    toggleButton.addEventListener('click', () => {
      if (tracksDiv.style.display === 'none') {
        tracksDiv.style.display = 'block';
        toggleButton.textContent = "Skjul numre";
      } else {
        tracksDiv.style.display = 'none';
        toggleButton.textContent = "Vis numre";
      }
    });

    // Tilføj album div til container, det gør så hele albumdiv nu vises på siden.
    container.appendChild(albumDiv);
  });
}

// Initialiserer programmet
fetchAlbums().then((albums) => {
  const albumObjects = albums.map(data =>
    new Album(
      data.artistName,
      data.albumName,
      data.trackList.length,
      data.releaseYear,
      data.trackList // Gemmer hele trackList-arrayet
    )
  );
  displayAlbums(albumObjects, 'content');
});
