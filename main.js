
const elSearchForm = document.querySelector(".js-search-movie");
const elSearchInput = elSearchForm.querySelector(".js-search-movie-title");
const elMovieList = document.querySelector(".js-movie-list");
const elMovieAlert = document.querySelector(".js-not-found-movie");
const elMovieItemTemplate = document.querySelector(".js-movie-item-template").content;
const elSelectedCatagories = document.querySelector("#catagories-option")
const elSelectGenres = document.querySelector(".js-movie-genres")
function hourMin(runtime) {
  const hour = Math.floor(runtime / 60);
  const minuts = Math.floor(runtime % 60);
  return `${hour} hrs ${minuts} min`;
}




let genres = [];


function renderGenserOptions(arr, node){
  const genresFragment = document.createDocumentFragment();
  for (const genre of arr) {
    const newOption = document.createElement("option");
    newOption.value = genre;
    newOption.textContent = genre;

    genresFragment.appendChild(newOption);
  }
  node.appendChild(genresFragment);
}

function uniqueGender(arr) {
  for (const movie of arr) {
    let categoriess = movie.categories;
    for (const category of categoriess) {
      if (!genres.includes(category)) {
        genres.push(category);
      }
    }
  }
  genres.sort();
  renderGenserOptions(genres, elSelectGenres)
}
uniqueGender(movies);
console.log(genres);


function myRenderMovies(moviesList, node) {
  const moviesFragment = document.createDocumentFragment();
  node.innerHTML = "";
  moviesList.forEach(function(kino) {
    const moviesItemClone =  elMovieItemTemplate.cloneNode(true);
    moviesItemClone.querySelector(".movie-list__poster").src = kino.image_url;
    moviesItemClone.querySelector(".movie-list__poster").alt = kino.title;
    moviesItemClone.querySelector(".movie-list__heading").textContent = kino.title;
    moviesItemClone.querySelector(".movie-list__rating").textContent = kino.imdb_rating;
    moviesItemClone.querySelector(".movie-list__year").textContent = kino.movie_year;
    moviesItemClone.querySelector(".movie-list__year").setAttribute("datetime", `${kino.movie_year}-02-13`);
    moviesItemClone.querySelector(".movie-list__runtime").textContent = hourMin(kino.runtime);
    moviesItemClone.querySelector(".movie-list__categories").textContent = kino.categories;
    moviesItemClone.querySelector(".movie-list__more-btn").dataset.imdbId = kino.imdb_id;
    moviesFragment.appendChild(moviesItemClone);
  });
  node.appendChild(moviesFragment);
}

const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".movie-modal__title");
const elModalIframe = elModal.querySelector(".movie-modal__iframe");
const elModalImDbRating = elModal.querySelector(".movie-modal__list-rating");
const elModalMovieYear = elModal.querySelector(".movie-modal__list-year");
const elModalRuntime = elModal.querySelector(".movie-modal__list-runtime");
const elModalCategories = elModal.querySelector(".movie-modal__categories");
const elModalSummary = elModal.querySelector(".movie-modal__summary");
const elModalImDbLink = elModal.querySelector(".movie-modal__imdb-link");

function renderModal(findMovie) {
  elModalTitle.textContent = findMovie.title;
  elModalIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.ytid}`;
  elModalImDbRating.textContent = findMovie.imdb_rating;
  elModalMovieYear.textContent = findMovie.movie_year;
  elModalMovieYear.setAttribute("datetime", `${findMovie.movie_year}-02-13`);
  elModalRuntime.textContent = hourMin(findMovie.runtime);
  elModalCategories.textContent = findMovie.categories.replaceAll("|", ", ");
  elModalSummary.textContent = findMovie.summary;
  elModalImDbLink.href =  `https://www.imdb.com/title/${findMovie.imdb_id}`;
}

elMovieList.addEventListener("click", function(evt){

  if(evt.target.matches(".movie-list__more-btn")){

    const btnImDbId = evt.target.dataset.imdbId;

    movies.find(function(item) {
      if(item.imdb_id === btnImDbId){
        renderModal(item);
      }
    });

  }

});


elModal.addEventListener("hide.bs.modal" , function(){

  elModalIframe.src = "";

});

elSearchForm.addEventListener("submit", function(evt){
  evt.preventDefault();

  const searchInputValue = elSearchInput.value.trim();

  const regexSearchTitle = new RegExp(searchInputValue, "gi");

  const searchMovies = movies.filter(function(searchMovie) {
    return String(searchMovie.title).match(regexSearchTitle) && (elSelectGenres.value == "all" || searchMovie.categories.includes(elSelectGenres.value));
  });

  if(searchMovies.length > 0) {
    myRenderMovies(searchMovies, elMovieList);
    elMovieAlert.classList.add("d-none");
  }else {
    elMovieAlert.classList.remove("d-none");
    elMovieAlert.textContent = "This movie not found, try again!";
  }



})

myRenderMovies(movies.slice(5, 41), elMovieList);



