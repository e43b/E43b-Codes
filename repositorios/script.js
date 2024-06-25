document.addEventListener("DOMContentLoaded", function() {
    const reposList = document.getElementById('repos-list');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchButton = document.getElementById('search-button');
    const toggleGenresButton = document.getElementById('toggle-genres');
    const genreFiltersContainer = document.getElementById('genre-filters');

    let repositories = [];
    let genres = [];

    fetch('repositories.json') // Carrega o arquivo JSON com os dados dos repositórios
        .then(response => response.json())
        .then(data => {
            repositories = data;
            genres = [...new Set(data.flatMap(repo => repo.genres))];
            populateGenreFilters();
            displayRepositories(repositories);
        })
        .catch(error => {
            console.error('Erro ao carregar dados dos repositórios:', error);
        });

    toggleGenresButton.addEventListener('click', () => {
        genreFiltersContainer.classList.toggle('hidden');
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const sortOrder = sortFilter.value;
        const selectedGenres = Array.from(document.querySelectorAll('.genre-filter:checked')).map(input => input.value);

        let filteredRepos = repositories.filter(repo => {
            const matchesSearch = repo.title.toLowerCase().includes(searchTerm) || repo.description.toLowerCase().includes(searchTerm);
            const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'andamento' && !repo.encerrado) || (selectedStatus === 'encerrado' && repo.encerrado);
            const matchesGenres = selectedGenres.length === 0 || selectedGenres.some(genre => repo.genres.includes(genre));
            return matchesSearch && matchesStatus && matchesGenres;
        });

        if (sortOrder === 'newest') {
            filteredRepos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            filteredRepos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        displayRepositories(filteredRepos);
    });

    function populateGenreFilters() {
        genres.forEach(genre => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" class="genre-filter" value="${genre}">
                ${genre}
            `;
            genreFiltersContainer.appendChild(label);
        });
    }

    function displayRepositories(repos) {
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const li = document.createElement('li');
            li.classList.add('repo-item');

            const genresHTML = repo.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join(' ');

            let endDateHTML = '';
            if (repo.enddAt) {
                endDateHTML = `<p><strong>Data de Finalização:</strong> ${repo.enddAt}</p>`;
            }

            li.innerHTML = `
                <div class="repo-widget">
                    <div class="repo-image">
                        <img src="${repo.coverUrl || 'noimg.png'}" alt="Capa do Projeto">
                    </div>
                    <div class="repo-info">
                        <h3><a href="${repo.githubUrl}" target="_blank">${repo.title}</a></h3>
                        <p>${repo.description}</p>
                        <p><strong>Status:</strong> <span class="${repo.encerrado ? 'status-encerrado' : 'status-andamento'}">${repo.encerrado ? 'Encerrado' : 'Em andamento'}</span></p>
                        <p><strong>Data de Criação:</strong> ${repo.createdAt}</p>
                        ${endDateHTML}
                        <p><strong>Gêneros:</strong> ${genresHTML}</p>
                        <a href="${repo.siteUrl}" target="_blank">Visualize o projeto</a>
                    </div>
                </div>
            `;
            reposList.appendChild(li);
        });
    }
});
