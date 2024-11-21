document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8000/estacoes')
        .then(response => response.json())
        .then(data => {
            const estacoesContainer = document.getElementById('estacoes-container');
            estacoesContainer.innerHTML = '';
            data.forEach(estacao => {
                const estacaoCard = document.createElement('div');
                estacaoCard.classList.add('card');
                estacaoCard.innerHTML = `
                    <h2>${estacao.nome}</h2>
                    <p><strong>Cidade:</strong> ${estacao.cidade}</p>
                    <p><strong>Estado:</strong> ${estacao.estado}</p>
                    <button onclick="mostrarLeituras(${estacao.id})">Ver Leituras</button>
                    <div id="leituras-${estacao.id}" style="display: none;"></div>
                `;
                estacoesContainer.appendChild(estacaoCard);
            });
        })
        .catch(error => console.error('Erro ao carregar estações:', error));
});

function mostrarLeituras(estacaoId) {
    const leiturasDiv = document.getElementById(`leituras-${estacaoId}`);
    if (leiturasDiv.style.display === 'none' || leiturasDiv.style.display === '') {
        fetch(`http://localhost:8000/leituras/${estacaoId}`)
            .then(response => response.json())
            .then(leituras => {
                leiturasDiv.innerHTML = '';
                leituras.forEach(leitura => {
                    const leituraItem = document.createElement('div');
                    leituraItem.innerHTML = `
                        <p><strong>Data:</strong> ${new Date(leitura.data).toLocaleString()}</p>
                        <p><strong>Nível de Água:</strong> ${leitura.nivel} m</p>
                        <p><strong>Distância:</strong> ${leitura.distancia_ultrassonico} cm</p>
                    `;
                    leiturasDiv.appendChild(leituraItem);
                });
                leiturasDiv.style.display = 'block';
            })
            .catch(error => console.error('Erro ao carregar leituras:', error));
    } else {
        leiturasDiv.style.display = 'none';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}
/*
// Função para buscar dados do clima da cidade inserida
function fetchWeather() {
    const cidade = document.getElementById('cidade-input').value;

    if (!cidade) {
        alert('Por favor, insira uma cidade.');
        return;
    }

    fetch(`http://localhost:4000/clima?cidade=${cidade}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('clima').innerHTML = `
                <p><strong>Temperatura:</strong> ${data.temperatura} °C</p>
                <p><strong>Descrição:</strong> ${data.descricao}</p>
                <p><strong>Umidade:</strong> ${data.umidade}%</p>
                <p><strong>Velocidade do Vento:</strong> ${data.vento} m/s</p>
            `;
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do clima:', error);
            document.getElementById('clima').innerHTML = '<p>Erro ao carregar os dados do clima.</p>';
        });
}*/
