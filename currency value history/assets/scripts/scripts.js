const form = document.getElementById("currencyForm");
const clearBtn = document.getElementById("clearBtn");
const errorBox = document.getElementById("errorBox");
const urlBox = document.getElementById("urlBox");
const canvas = document.getElementById("chartjs-0");

let myChart = null;

const apiKey = "c9G8oPqROFB0Rs8lM8hW5umH4Zl1_g2v";

function setError(msg) {
    errorBox.textContent = msg;
}

function clearAll() {
    form.reset();
    setError("");
    urlBox.textContent = "";
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function formatDateYYYYMMDD(d) {
    return d;
}

function formatDateLabelFromMs(ms) {
    const dt = new Date(ms);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dt.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    setError("");
    urlBox.textContent = "";

    const base = document.getElementById("baseCurrency").value;
    const convert = document.getElementById("convertCurrency").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    if (!apiKey) {
        setError("Missing API key. Paste your Polygon API key into script.js.");
        return;
    }

    if (!base || !convert || !fromDate || !toDate) {
        setError("All fields are required.");
        return;
    }

    if (base === convert) {
        setError("Base Currency and Convert to Currency must be different.");
        return;
    }

    if (fromDate > toDate) {
        setError("From Date must be earlier than To Date.");
        return;
    }

    const ticker = `C:${base}${convert}`;
    const from = formatDateYYYYMMDD(fromDate);
    const to = formatDateYYYYMMDD(toDate);

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?apiKey=${apiKey}`;

    urlBox.textContent = url;

    try {
        const resp = await fetch(url);
        const data = await resp.json();

        if (!resp.ok) {
            setError(data?.error || "Request failed. Check your API key and plan.");
            return;
        }

        if (!data || !data.results || data.results.length === 0) {
            setError("No data returned for that currency pair and date range.");
            if (myChart) {
                myChart.destroy();
                myChart = null;
            }
            return;
        }

        const dates = data.results.map(r => formatDateLabelFromMs(r.t));
        const values = data.results.map(r => r.c);

        if (myChart) {
            myChart.destroy();
            myChart = null;
        }

        const ctx = document.getElementById("chartjs-0");

        myChart = new Chart(ctx, {
            "type": "line",
            "data": {
                "labels": dates,
                "datasets": [{
                    "data": values,
                    fill: false
                }]
            },
            "options": {
                responsive: false,
                maintainAspectRatio: true
            }
        });

    } catch (err) {
        setError("Network or CORS error. Verify the URL and try again.");
    }
});

clearBtn.addEventListener("click", clearAll);
