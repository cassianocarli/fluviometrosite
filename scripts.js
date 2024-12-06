const apiKey = '4ae759041f16634f4c85c65114152892'; // Substitua por sua chave da OpenWeather API

// Elementos DOM
const weatherForm = document.getElementById('weatherForm');
const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const themeToggle = document.getElementById('themeToggle');
const distanceResult = document.getElementById('distanceResult'); // Adicionado para renderizar a distância

// Gráficos
let localDistanceChart;
let remoteDistanceChart;

// Alternar tema claro/escuro
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Modo Claro' : 'Modo Escuro';
});

// Buscar clima por cidade
weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    }
});

// Função para buscar clima
async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`);
        const data = await response.json();
        renderWeather(data);
    } catch (error) {
        weatherResult.innerHTML = `<div class="alert alert-danger">Cidade não encontrada!</div>`;
    }
}

// Função para buscar previsão
async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`);
        const data = await response.json();
        renderForecast(data);
    } catch (error) {
        forecastResult.innerHTML = `<div class="alert alert-danger">Erro ao carregar previsão!</div>`;
    }
}

// Renderizar clima
function renderWeather(data) {
    weatherResult.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body text-center text-md-start">
                <h5 class="card-title">${data.name}, ${data.sys.country}</h5>
                <p class="card-text">
                    <strong>Temperatura:</strong> ${data.main.temp}°C<br>
                    <strong>Clima:</strong> ${data.weather[0].description}<br>
                    <strong>Umidade:</strong> ${data.main.humidity}%<br>
                    <strong>Vento:</strong> ${data.wind.speed} m/s
                </p>
            </div>
        </div>
    `;
}

// Renderizar previsão
function renderForecast(data) {
    forecastResult.innerHTML = `
        <h5 class="w-100 mb-3">Previsão para os próximos 5 dias:</h5>
    `;
    forecastResult.innerHTML += data.list
        .filter((_, index) => index % 8 === 0)
        .map(item => `
            <div class="card text-center">
                <div class="card-body">
                    <h6>${new Date(item.dt_txt).toLocaleDateString()}</h6>
                    <p>${item.main.temp}°C</p>
                    <p>${item.weather[0].description}</p>
                </div>
            </div>
        `).join('');
}

// Função para buscar a última distância
async function fetchLastDistance() {
    try {
        const response = await fetch('https://apisite-30f6.onrender.com/api/last-distance'); // URL da sua API
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error); // Tratar erro da API se houver
        }

        renderLastDistance(data);
    } catch (error) {
        console.error('Erro ao buscar a última distância:', error);
        distanceResult.innerHTML = '<div class="alert alert-danger">Erro ao buscar dados da distância.</div>';
    }
}

// Função para renderizar as últimas distâncias e atualizar os gráficos
function renderLastDistance(data) {
    // Verificando se o elemento distanceResult existe
    if (!distanceResult) {
        console.error('Elemento com id "distanceResult" não encontrado!');
        return;
    }

    // Criando o objeto Date a partir do created_at (ISO string)
    const createdAtDate = new Date(data.created_at);
    if (isNaN(createdAtDate)) {
        console.error('Data criada inválida:', data.created_at);
        return;  // Não renderiza nada se a data for inválida
    }

    // Adicionar 3 horas à data
    createdAtDate.setHours(createdAtDate.getHours() + 3);

    // Limpar o conteúdo existente antes de adicionar novos cards
    distanceResult.innerHTML = '';

    // Criando os dois cards (um para cada distância)
    const localDistanceCard = document.createElement('div');
    localDistanceCard.className = 'card shadow-sm mt-4'; // Estilo do card para a distância local
    localDistanceCard.innerHTML = `
        <div class="card-body text-center text-md-start">
            <h5 class="card-title">Última Distância Local Registrada</h5>
            <p class="card-text">
                <strong>Distância Local:</strong> ${data.local_distance} m<br>
                <strong>Data e Hora:</strong> ${createdAtDate.toLocaleString('pt-BR')}
            </p>
        </div>
    `;

    const remoteDistanceCard = document.createElement('div');
    remoteDistanceCard.className = 'card shadow-sm mt-4'; // Estilo do card para a distância remota
    remoteDistanceCard.innerHTML = `
        <div class="card-body text-center text-md-start">
            <h5 class="card-title">Última Distância Remota Registrada</h5>
            <p class="card-text">
                <strong>Distância Remota:</strong> ${data.remote_distance} m<br>
                <strong>Data e Hora:</strong> ${createdAtDate.toLocaleString('pt-BR')}
            </p>
        </div>
    `;

    // Adicionando os dois cards ao elemento de distâncias
    distanceResult.appendChild(localDistanceCard);
    distanceResult.appendChild(remoteDistanceCard);

    // Atualizando os gráficos com as novas distâncias
    updateDistanceCharts(data.local_distance, data.remote_distance, createdAtDate);
}

// Função para atualizar os gráficos
function updateDistanceCharts(localDistance, remoteDistance, createdAtDate) {
    const formattedDate = createdAtDate.toLocaleString('pt-BR'); // Formatar data e hora

    // Se os gráficos ainda não foram inicializados, inicialize-os
    if (!localDistanceChart) {
        localDistanceChart = new Chart(document.getElementById('localDistanceChart'), {
            type: 'line', // Gráfico de linha
            data: {
                labels: [formattedDate], // Usar data e hora como label
                datasets: [{
                    label: 'Distância Local',
                    data: [localDistance],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category', // Usar categorias para as datas
                        title: {
                            display: true,
                            text: 'Data e Hora'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Distância (m)'
                        }
                    }
                }
            }
        });
    } else {
        localDistanceChart.data.labels.push(formattedDate); // Adicionar nova data
        localDistanceChart.data.datasets[0].data.push(localDistance); // Adicionar nova distância
        localDistanceChart.update();
    }

    if (!remoteDistanceChart) {
        remoteDistanceChart = new Chart(document.getElementById('remoteDistanceChart'), {
            type: 'line',
            data: {
                labels: [formattedDate],
                datasets: [{
                    label: 'Distância Remota',
                    data: [remoteDistance],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Data e Hora'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Distância (m)'
                        }
                    }
                }
            }
        });
    } else {
        remoteDistanceChart.data.labels.push(formattedDate); // Adicionar nova data
        remoteDistanceChart.data.datasets[0].data.push(remoteDistance); // Adicionar nova distância
        remoteDistanceChart.update();
    }
}

// Chamar a função para buscar a última distância ao carregar a página
fetchLastDistance();

// Atualizar os dados a cada 10 segundos (10000 milissegundos)
setInterval(fetchLastDistance, 10000);
