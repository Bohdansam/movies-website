const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const popularLine = document.getElementById('popular-line');
const comedyLine = document.getElementById('comedy-line');
const romanceLine = document.getElementById('romance-line');
const searchInput = document.getElementById('search');  

let currentPage = 1; 
const moviesPerPage = 10; 

// Fetch movies by category
async function getMoviesByCategory(categoryId, element) {
    try {
        const url = `${BASE_URL}/discover/movie?with_genres=${categoryId}&sort_by=popularity.desc&page=${currentPage}&${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length !== 0) {
            showMovies(data.results, element);
            updatePagination(data.page, data.total_pages);
        } else {
            element.innerHTML = `<p>No movies found in this category.</p>`;
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        element.innerHTML = `<p>Error loading movies. Please try again later.</p>`;
    }
}

// Fetch movies by search query
async function searchMovies(query, element) {
    try {
        const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}&${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length !== 0) {
            showMovies(data.results, element);
            updatePagination(data.page, data.total_pages);
        } else {
            element.innerHTML = `<p>No movies found for "${query}".</p>`;
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        element.innerHTML = `<p>Error loading movies. Please try again later.</p>`;
    }
}

// Show Movies
function showMovies(data, element) {
    element.innerHTML = ''; 
    const limitedMovies = data.slice(0, moviesPerPage); // Limit 10 movies
    limitedMovies.forEach(movie => {
        const { title, poster_path, vote_average } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'http://via.placeholder.com/1080x1580'}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
        `;
        element.appendChild(movieEl);
    });
}

// Get color for rating
function getColor(vote) {
    return vote >= 8 ? 'green' : vote >= 5 ? 'orange' : 'red';
}

// Update Pagination
function updatePagination(current, total) {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const currentPageElem = document.getElementById('current');
    
    // Update num of currently page
    currentPageElem.textContent = current;

    // Activate Buttons
    prevButton.classList.toggle('disabled', current === 1);
    nextButton.classList.toggle('disabled', current === total);
}

// Change Movies Page
document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadMovies(); // Load Movies for previous page
    }
});

document.getElementById('next').addEventListener('click', () => {
    currentPage++;
    loadMovies(); // Load Movies for next page
});

// Handle Search Input
searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    if (query) {
        searchMovies(query, popularLine); // Load Popular Movies
    } else {
        loadMovies(); // Load Movies by category
    }
});

// Load Movies
async function loadMovies() {
    await getMoviesByCategory('', popularLine); 
    await getMoviesByCategory(35, comedyLine); 
    await getMoviesByCategory(10749, romanceLine); 
}

loadMovies();
