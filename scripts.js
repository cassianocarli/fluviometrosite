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

// Função para buscar as últimas distâncias
async function fetchLastDistance() {
    try {
        const response = await fetch('https://apisite-30f6.onrender.com/api/last-distance'); // URL da sua API
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error); // Tratar erro da API se houver
        }

        renderLastDistance(data); // Passando um array de distâncias
    } catch (error) {
        console.error('Erro ao buscar as distâncias:', error);
        distanceResult.innerHTML = '<div class="alert alert-danger">Erro ao buscar dados das distâncias.</div>';
    }
}

// Função para renderizar as últimas distâncias e atualizar os gráficos
function renderLastDistance(data) {
    // Verificando se o elemento distanceResult existe
    if (!distanceResult) {
        console.error('Elemento com id "distanceResult" não encontrado!');
        return;
    }

    // Limpar o conteúdo existente antes de adicionar novos cards
    distanceResult.innerHTML = '';

    // Exibir cada distância (local e remota)
    data.forEach(item => {
        const createdAtDate = new Date(item.created_at);
        if (isNaN(createdAtDate)) {
            console.error('Data inválida:', item.created_at);
            return;
        }

        // Separando as distâncias local e remota (caso elas estejam combinadas)
        const { local_distance, remote_distance } = item;

        // Criando os cards para cada distância
        const localDistanceCard = document.createElement('div');
        localDistanceCard.className = 'card shadow-sm mt-4';
        localDistanceCard.innerHTML = `
            <div class="card-body text-center text-md-start">
                <h5 class="card-title">Distância Local Registrada</h5>
                <p class="card-text">
                    <strong>Distância Local:</strong> ${local_distance} m<br>
                    <strong>Data e Hora:</strong> ${createdAtDate.toLocaleString('pt-BR')}
                </p>
            </div>
        `;

        const remoteDistanceCard = document.createElement('div');
        remoteDistanceCard.className = 'card shadow-sm mt-4';
        remoteDistanceCard.innerHTML = `
            <div class="card-body text-center text-md-start">
                <h5 class="card-title">Distância Remota Registrada</h5>
                <p class="card-text">
                    <strong>Distância Remota:</strong> ${remote_distance} m<br>
                    <strong>Data e Hora:</strong> ${createdAtDate.toLocaleString('pt-BR')}
                </p>
            </div>
        `;

        // Adicionando os cards ao elemento de distâncias
        distanceResult.appendChild(localDistanceCard);
        distanceResult.appendChild(remoteDistanceCard);

        // Atualizando os gráficos com as novas distâncias
        updateDistanceCharts(local_distance, remote_distance);
    });

    // Verificando se os cards foram inseridos corretamente
    console.log('Cards inseridos com sucesso!');
}

// Função para atualizar os gráficos
function updateDistanceCharts(localDistance, remoteDistance) {
    // Se os gráficos ainda não foram inicializados, inicialize-os
    if (!localDistanceChart) {
        localDistanceChart = new Chart(document.getElementById('localDistanceChart'), {
            type: 'line',
            data: {
                labels: ['Agora'],
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
                    y: { beginAtZero: true }
                }
            }
        });
    } else {
        localDistanceChart.data.labels.push('Agora');
        localDistanceChart.data.datasets[0].data.push(localDistance);
        localDistanceChart.update();
    }

    if (!remoteDistanceChart) {
        remoteDistanceChart = new Chart(document.getElementById('remoteDistanceChart'), {
            type: 'line',
            data: {
                labels: ['Agora'],
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
                    y: { beginAtZero: true }
                }
            }
        });
    } else {
        remoteDistanceChart.data.labels.push('Agora');
        remoteDistanceChart.data.datasets[0].data.push(remoteDistance);
        remoteDistanceChart.update();
    }
}

// Chamar a função para buscar as últimas distâncias ao carregar a página
fetchLastDistance();

// Atualizar os dados a cada 10 segundos (10000 milissegundos)
setInterval(fetchLastDistance, 10000);
