document.addEventListener('DOMContentLoaded', () => {
    fetch('https://apisite-ml87.onrender.com/estacoes')
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

            gerarGrafico(); // Carregar gráfico ao carregar a página
        })
        .catch(error => console.error('Erro ao carregar estações:', error));
});

function mostrarLeituras(estacaoId) {
    const leiturasDiv = document.getElementById(`leituras-${estacaoId}`);
    if (leiturasDiv.style.display === 'none' || leiturasDiv.style.display === '') {
        fetch(`https://apisite-ml87.onrender.com/leituras/${estacaoId}`)
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

// Função para gerar o gráfico com Chart.js
function gerarGrafico() {
    fetch('https://apisite-ml87.onrender.com/leituras/recentes')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(leitura => new Date(leitura.data).toLocaleTimeString());
            const niveisEstacao1 = data.filter(leitura => leitura.estacao_id === 1).map(leitura => leitura.nivel);
            const niveisEstacao2 = data.filter(leitura => leitura.estacao_id === 2).map(leitura => leitura.nivel);

            const ctx = document.getElementById('leiturasChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Estação 1',
                            data: niveisEstacao1,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        },
                        {
                            label: 'Estação 2',
                            data: niveisEstacao2,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Horário'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Nível de Água (m)'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erro ao carregar gráfico:', error));
}
