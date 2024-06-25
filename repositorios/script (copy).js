document.addEventListener("DOMContentLoaded", function() {
    const reposList = document.getElementById('repos-list');

    fetch('repositories.json') // Carrega o arquivo JSON com os dados dos repositórios
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                const li = document.createElement('li');
                li.classList.add('repo-item');
                li.innerHTML = `
                    <div class="repo-widget">
                        <div class="repo-image">
                            <img src="${repo.coverUrl}" alt="Capa do Projeto">
                        </div>
                        <div class="repo-info">
                            <h3><a href="${repo.githubUrl}" target="_blank">${repo.title}</a></h3>
                            <p>${repo.description}</p>
                            <p><strong>Status:</strong> <span class="${repo.encerrado ? 'status-encerrado' : 'status-andamento'}">${repo.encerrado ? 'Encerrado' : 'Em andamento'}</span></p>
                            <p><strong>Data de Criação:</strong> ${repo.createdAt}</p>
                            <a href="${repo.siteUrl}" target="_blank">Visualize o projeto</a>
                        </div>
                    </div>
                `;
                reposList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados dos repositórios:', error);
        });
});
