const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const locationResults = document.getElementById("locationResults");
const selectedLocation = document.getElementById("selectedLocation");
const highestUV = document.getElementById("highestUV");
const riskLevel = document.getElementById("riskLevel");

let uvChart = null;

searchBtn.addEventListener("click", searchLocation);

locationInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchLocation();
  }
});

async function searchLocation() {
  const query = locationInput.value.trim();

  locationResults.innerHTML = "";
  message.textContent = "";

  if (!query) {
    message.textContent = "Please enter a city or zip code.";
    return;
  }

  message.textContent = "Searching for location...";

  try {
    let cleanedQuery = query
      .replace(/,/g, " ")
      .replace(/\barkansas\b/gi, "")
      .replace(/\bar\b/gi, "")
      .trim();

    if (!cleanedQuery) {
      cleanedQuery = query;
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanedQuery)}&count=10&language=en&format=json&countryCode=US`;
    const response = await fetch(geoUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      message.textContent = "No locations found. Try only the city name, like Benton.";
      return;
    }

    const arkansasResults = data.results.filter(function (location) {
      return location.admin1 && location.admin1.toLowerCase().includes("arkansas");
    });

    const resultsToShow = arkansasResults.length > 0 ? arkansasResults : data.results;

    message.textContent = "Select the correct location.";

    resultsToShow.forEach(function (location) {
      const card = document.createElement("div");
      card.className = "location-card";

      const details = document.createElement("div");
      details.innerHTML = `
        <strong>${location.name}, ${location.admin1 || ""}</strong>
        <p>${location.country} | Latitude: ${location.latitude}, Longitude: ${location.longitude}</p>
      `;

      const button = document.createElement("button");
      button.textContent = "Use Location";
      button.addEventListener("click", function () {
        getUVData(location);
      });

      card.appendChild(details);
      card.appendChild(button);
      locationResults.appendChild(card);
    });
  } catch (error) {
    message.textContent = "There was an error searching for that location.";
  }
}

async function getUVData(location) {
  message.textContent = "Loading UV data...";
  locationResults.innerHTML = "";

  selectedLocation.textContent = `${location.name}, ${location.admin1 || location.country}`;

  try {
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
      `&hourly=uv_index&past_days=5&forecast_days=5&timezone=auto`;

    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (!data.hourly || !data.hourly.uv_index) {
      message.textContent = "UV data could not be loaded for this location.";
      return;
    }

    const dailyData = summarizeDailyUV(data.hourly.time, data.hourly.uv_index);

    updateSummary(dailyData);
    drawChart(dailyData);

    message.textContent = "UV chart loaded successfully.";
  } catch (error) {
    message.textContent = "There was an error loading UV index data.";
  }
}

function summarizeDailyUV(times, uvValues) {
  const days = {};

  for (let i = 0; i < times.length; i++) {
    const date = times[i].split("T")[0];
    const uv = uvValues[i];

    if (uv === null || uv === undefined) {
      continue;
    }

    if (!days[date]) {
      days[date] = [];
    }

    days[date].push(uv);
  }

  return Object.keys(days).map(function (date) {
    const maxUV = Math.max(...days[date]);

    return {
      date: formatDate(date),
      rawDate: date,
      maxUV: Number(maxUV.toFixed(1)),
      type: isPastDate(date) ? "Past" : "Forecast"
    };
  });
}

function isPastDate(dateString) {
  const today = new Date();
  const date = new Date(dateString + "T00:00:00");

  today.setHours(0, 0, 0, 0);

  return date < today;
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function updateSummary(dailyData) {
  const values = dailyData.map(function (day) {
    return day.maxUV;
  });

  const max = Math.max(...values);

  highestUV.textContent = max.toFixed(1);
  riskLevel.textContent = getRiskLevel(max);
}

function getRiskLevel(uv) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

function drawChart(dailyData) {
  const ctx = document.getElementById("uvChart");

  const labels = dailyData.map(function (day) {
    return `${day.date} (${day.type})`;
  });

  const values = dailyData.map(function (day) {
    return day.maxUV;
  });

  if (uvChart) {
    uvChart.destroy();
  }

  uvChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily Maximum UV Index",
          data: values,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#061627",
            font: {
              size: 14,
              weight: "bold"
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `UV Index: ${context.raw} | Risk: ${getRiskLevel(context.raw)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#061627"
          },
          grid: {
            color: "rgba(6, 22, 39, 0.12)"
          }
        },
        y: {
          beginAtZero: true,
          suggestedMax: 12,
          ticks: {
            color: "#061627"
          },
          grid: {
            color: "rgba(6, 22, 39, 0.12)"
          },
          title: {
            display: true,
            text: "UV Index",
            color: "#061627",
            font: {
              size: 14,
              weight: "bold"
            }
          }
        }
      }
    }
  });
}