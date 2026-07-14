const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');
const currentTemp = document.querySelector('#current-temp');
const weatherDesc = document.querySelector('#weather-desc');
const weatherIcon = document.querySelector('#weather-icon');
const forecastList = document.querySelector('#forecast-list');
const spotlightList = document.querySelector('#spotlight-list');

const apiKey = '8f3b5dd4a4fe6b5ebe68687215fd671f';
const weatherLat = 15.5042;
const weatherLon = -88.0250;
const weatherUnits = 'imperial';

function toggleMenu() {
    if (!menuToggle || !mainNav) return;
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open');
}

function initFooter() {
    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = document.lastModified;
}

function toTitleCase(value) {
    return value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function showWeatherError() {
    if (currentTemp) currentTemp.textContent = 'Weather information is currently unavailable.';
    if (weatherDesc) weatherDesc.textContent = 'Please check back later.';
    if (forecastList) forecastList.innerHTML = '';
    if (weatherIcon) {
        weatherIcon.hidden = true;
        weatherIcon.removeAttribute('src');
    }
}

function getForecastDays(forecastItems) {
    const today = new Date().toDateString();
    const dailyForecasts = [];
    const usedDates = new Set();

    forecastItems.forEach(item => {
        const itemDate = new Date(item.dt * 1000);
        const dateKey = itemDate.toISOString().slice(0, 10);

        if (itemDate.toDateString() === today || usedDates.has(dateKey)) return;

        const hour = itemDate.getHours();
        if (hour >= 11 && hour <= 15) {
            usedDates.add(dateKey);
            dailyForecasts.push(item);
        }
    });

    if (dailyForecasts.length < 3) {
        forecastItems.forEach(item => {
            const itemDate = new Date(item.dt * 1000);
            const dateKey = itemDate.toISOString().slice(0, 10);

            if (itemDate.toDateString() !== today && !usedDates.has(dateKey)) {
                usedDates.add(dateKey);
                dailyForecasts.push(item);
            }
        });
    }

    return dailyForecasts.slice(0, 3);
}

function renderForecast(forecastItems) {
    if (!forecastList) return;
    forecastList.innerHTML = '';

    getForecastDays(forecastItems).forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        const forecastItem = document.createElement('p');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `<strong>${dayName}:</strong> ${Math.round(item.main.temp)}&deg;F`;
        forecastList.appendChild(forecastItem);
    });
}

async function getWeather() {
    if (apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
        showWeatherError();
        return;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${weatherLat}&lon=${weatherLon}&units=${weatherUnits}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherLat}&lon=${weatherLon}&units=${weatherUnits}&appid=${apiKey}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Unable to load weather data');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        const weather = currentData.weather?.[0];

        if (currentTemp) currentTemp.innerHTML = `${Math.round(currentData.main.temp)}&deg;F`;
        if (weatherDesc && weather) weatherDesc.textContent = toTitleCase(weather.description);

        if (weatherIcon && weather?.icon) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
            weatherIcon.alt = weather.description;
            weatherIcon.hidden = false;
        }

        renderForecast(forecastData.list);
    } catch (error) {
        console.error(error);
        showWeatherError();
    }
}

function getMembershipLabel(level) {
    if (level === 3) return 'Gold';
    if (level === 2) return 'Silver';
    return 'Member';
}

function shuffleMembers(members) {
    const shuffled = [...members];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function renderSpotlights(members) {
    if (!spotlightList) return;
    spotlightList.innerHTML = '';

    const eligibleMembers = members.filter(member => member.membership === 2 || member.membership === 3);
    const spotlightCount = Math.min(eligibleMembers.length, Math.random() < 0.5 ? 2 : 3);
    const selectedMembers = shuffleMembers(eligibleMembers).slice(0, spotlightCount);

    selectedMembers.forEach(member => {
        const card = document.createElement('article');
        card.className = 'spotlight-card';

        const image = document.createElement('img');
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.width = 96;
        image.height = 96;
        image.loading = 'lazy';

        const name = document.createElement('h3');
        name.textContent = member.name;

        const phone = document.createElement('p');
        phone.textContent = member.phone;

        const address = document.createElement('p');
        address.textContent = member.address;

        const website = document.createElement('a');
        website.href = member.website;
        website.target = '_blank';
        website.rel = 'noopener';
        website.textContent = 'Visit Website';

        const membership = document.createElement('p');
        membership.className = `member-level level-${member.membership}`;
        membership.textContent = `${getMembershipLabel(member.membership)} Member`;

        card.append(image, name, phone, address, website, membership);
        spotlightList.appendChild(card);
    });
}

function showSpotlightError() {
    if (!spotlightList) return;
    spotlightList.innerHTML = '<p class="error-copy">Member spotlights are currently unavailable. Please try again later.</p>';
}

async function getSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Unable to load member data');
        const data = await response.json();
        renderSpotlights(data.members);
    } catch (error) {
        console.error(error);
        showSpotlightError();
    }
}

menuToggle?.addEventListener('click', toggleMenu);

initFooter();
getWeather();
getSpotlights();
