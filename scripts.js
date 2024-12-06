// Função para buscar as distâncias do servidor Node.js
async function fetchDistances() {
    try {
        // Fazendo a requisição para a API de distâncias
        const response = await fetch('http://localhost:3000/api/distances');
        const data = await response.json();

        // Verificando se há dados para preencher
        if (data.length > 0) {
            // Atualiza o card1 com a distância local
            document.getElementById('card1').innerHTML = `
                <div class="card-body text-center">
                    <h5 class="card-title">Distância Local</h5>
                    <p class="card-text">${data[0].local_distance} km</p>
                </div>
            `;
            // Atualiza o card2 com a distância remota
            document.getElementById('card2').innerHTML = `
                <div class="card-body text-center">
                    <h5 class="card-title">Distância Remota</h5>
                    <p class="card-text">${data[0].remote_distance} km</p>
                </div>
            `;
        } else {
            // Caso não haja dados
            document.getElementById('card1').innerHTML = `
                <div class="card-body text-center">
                    <h5 class="card-title">Distância Local</h5>
                    <p class="card-text">Nenhum dado encontrado.</p>
                </div>
            `;
            document.getElementById('card2').innerHTML = `
                <div class="card-body text-center">
                    <h5 class="card-title">Distância Remota</h5>
                    <p class="card-text">Nenhum dado encontrado.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Função de busca de clima da cidade (já existente)
document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
    fetchDistances();  // Atualiza os cards de distâncias sempre que buscar o clima
});

// Função de busca do clima (exemplo simples)
async function fetchWeather(city) {
    // A API de clima (OpenWeather) já foi configurada antes, vamos apenas chamar ela aqui.
    const apiKey = '4ae759041f16634f4c85c65114152892'; // Substitua pela sua chave da OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            // Exibe os dados de clima (temperatura, etc.) no card de clima
            document.getElementById('weatherResult').innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <p class="card-text">Temperatura: ${data.main.temp}°C</p>
                        <p class="card-text">Clima: ${data.weather[0].description}</p>
                        <p class="card-text">Humidade: ${data.main.humidity}%</p>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('weatherResult').innerHTML = `
                <div class="alert alert-danger">Cidade não encontrada.</div>
            `;
        }
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
    }
}

// Chama a função para carregar as distâncias ao carregar a página
document.addEventListener('DOMContentLoaded', fetchDistances);
