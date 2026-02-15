const movie_input = document.querySelector("#movie_input");
const search_button = document.querySelector("#search_button");
const movie_title = document.querySelector("#movie_title");
const movie_poster = document.querySelector("#movie_poster");
const movie_release_year = document.querySelector("#movie_release_year");
const movie_age_rating = document.querySelector("#movie_age_rating");
const movie_runtime = document.querySelector("#movie_runtime");
const movie_rating = document.querySelector("#movie_rating");
const movie_director = document.querySelector("#movie_director");
const movie_writers = document.querySelector("#movie_writers");
const movie_actors = document.querySelector("#movie_actors");

const search_mode = document.querySelector("#search_mode");
const type_filter = document.querySelector("#type_filter");

const results_div = document.querySelector("#results");
const movie_info_div = document.querySelector("#movie_info");

const APIinfo = {
	"link": "https://www.omdbapi.com/?apikey=",
	"key": "5c2ae517"
}

async function getMovieInfo() {

	// Czyszczenie porzednich danych

	results_div.innerHTML = "";

	movie_title.textContent = "";
	movie_release_year.textContent = "";
	movie_age_rating.textContent = "";
	movie_runtime.textContent = "";
	movie_rating.textContent = "";
	movie_director.textContent = "";
	movie_writers.textContent = "";
	movie_actors.textContent = "";
	movie_poster.src = "";


	const title_to_search = movie_input.value.trim();
	const mode = search_mode.value;
	const type = type_filter.value;

	if (!title_to_search) {
		alert("Prosze wpisac tytul filmu");
		return;
	}

	let URL = `${APIinfo.link}${APIinfo.key}&${mode}=${encodeURIComponent(title_to_search)}`;

	if (type) {
		URL += `&type=${type}`;
	}

	try {
		const response = await fetch(URL);
		const data = await response.json();

		if (data.Response === "False") {
			alert("Nie znaleziono filmu");
			return;
		}


		// Wyszukanie pojedynczego filmu
		if (mode === "t") {

			movie_title.textContent = `Tytul: ${data.Title}`;
			movie_release_year.textContent = `Data wydania: ${data.Released}`;
			movie_age_rating.textContent = `Od lat: ${data.Rated}`;
			movie_runtime.textContent = `Czas trwania: ${data.Runtime}`;
			movie_rating.textContent = `Ocena IMDb: ${data.imdbRating}`;
			movie_director.textContent = `Rezyser: ${data.Director}`;
			movie_writers.textContent = `Scenarzysci: ${data.Writer}`;
			movie_actors.textContent = `Aktorzy: ${data.Actors}`;

			movie_poster.src =
				data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300";
		}

		if (mode === "s") {

			movie_info_div.style.display = "none"

			results_div.innerHTML = data.Search.map(item => {
				const poster = item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/80x110";
				return `
      <div class="result_card" data-id="${item.imdbID}">
        <img src="${poster}" alt="">
        <div>
          <div class="result_title">${item.Title}</div>
          <div class="result_meta">${item.Year} • ${item.Type} • ${item.imdbID}</div>
        </div>
      </div>
    `;
			}).join("");

			// klik w kartę → pobierz szczegóły po imdbID
			results_div.querySelectorAll(".result_card").forEach(card => {
				card.addEventListener("click", () => {
					fetchMovieById(card.dataset.id);
				});
			});

			movie_title.textContent = `Znalezione wyniki: ${data.Search.length}`;
		}


	} catch (error) {
		console.error("Blad:", error);
		alert("Blad pobierania danych.");
	}
}


function renderDetails(data) {
	movie_title.textContent = `Tytul: ${data.Title}`;
	movie_release_year.textContent = `Data wydania: ${data.Released}`;
	movie_age_rating.textContent = `Od lat: ${data.Rated}`;
	movie_runtime.textContent = `Czas trwania: ${data.Runtime}`;
	movie_rating.textContent = `Ocena IMDb: ${data.imdbRating}`;
	movie_director.textContent = `Rezyser: ${data.Director}`;
	movie_writers.textContent = `Scenarzysci: ${data.Writer}`;
	movie_actors.textContent = `Aktorzy: ${data.Actors}`;

	movie_poster.src = data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300";

	// pokaż szczegóły, schowaj listę
	movie_info_div.style.display = "grid";
	results_div.innerHTML = "";
}

async function fetchMovieById(imdbID) {
	const url = `${APIinfo.link}${APIinfo.key}&i=${encodeURIComponent(imdbID)}`;
	const response = await fetch(url);
	const data = await response.json();

	if (data.Response === "False") {
		alert("Nie udało sie pobrac szczegolow.");
		return;
	}

	renderDetails(data);
}


search_button.addEventListener("click", getMovieInfo);

movie_input.addEventListener("keydown", (e) => {
	if (e.key === "Enter") getMovieInfo();
});
