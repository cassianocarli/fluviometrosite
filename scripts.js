const apiKey = '4ae759041f16634f4c85c65114152892'; // Substitua por sua chave da OpenWeather API

// Elementos DOM
const weatherForm = document.getElementById('weatherForm');
const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const themeToggle = document.getElementById('themeToggle');
const distanceResult = document.getElementById('distanceResult'); // Adicionado para renderizar a distância

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

// Função para renderizar a última distância
function renderLastDistance(data) {
    if (!distanceResult) {
        console.error('Elemento com id "distanceResult" não encontrado!');
        return;
    }
    
    const card = document.createElement('div');
    card.className = 'card shadow-sm mt-4'; // Estilo do card
    card.innerHTML = `
        <div class="card-body text-center text-md-start">
            <h5 class="card-title">Última Distância Registrada</h5>
            <p class="card-text">
                <strong>Distância Local:</strong> ${data.local_distance} m<br>
                <strong>Distância Remota:</strong> ${data.remote_distance} m<br>
                <strong>Data e Hora:</strong> ${new Date(data.timestamp).toLocaleString()}
            </p>
        </div>
    `;
    distanceResult.appendChild(card);  // Adiciona o card ao div de distâncias
}

// Chamar a função para buscar a última distância ao carregar a página
fetchLastDistance();
