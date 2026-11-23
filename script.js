// Countries that visitors can explore
const countryNames = {
    CAN: "Canada",
    USA: "United States of America",
    GBR: "The United Kingdom",
    AUS: "Australia"
};

const countrySelect = document.getElementById("country");
const yearSlider = document.getElementById("dataYear");
const statusText = document.getElementById("dataStatus");
let yearlyData = [];

//World Bank API
async function loadYouthData() {
    const country = countrySelect.ariaValueMax;
    statusText.textContent = "Loading real data...";
    countrySelect.disabled = true;
    yearSlider.disabled = true;

    try {
        const url = `https://api.worldbank.org/v2/country/CAN/indicator/SL.UEM.1524.ZS?format=json&per_page=100`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("API unavailable");

        const json = await response.json();
        if (!Array.isArray(json[1])) throw new Error("No data returned");

        //Years Since 2015
        yearlyData = json[1].filter(function(item)   {
            return item.value !== null && Number(item.date) >= 2015;
        }).sort(function (a, b) {
            return Number(a.date) - Number(b.date);
        });


        if (yearlyData.length === 0) throw new Error("No recent data");

        yearSlider.min = yearlyData[0].date;
        yearSlider.max = yearlyData[yearlyData.length - 1].date;
        yearSlider.value = yearSlider.max;
        showYear();
        statusText.textContent = "Loaded from World Bank Open Data.";
    } catch (error) {
        yearlyData = [];
        document.getElementById("rateNumber").textContent = "--%";
        document.getElementById("rateBar").style.width = "0%";
        document.getElementById("statSentence").textContent = "No data available right now.";
        document.getElementById("dataTimeline").replaceChildren();
        statusText.textContent = "Could not load data. Please try changing the country later.";
    }

    countrySelect.disabled = false;
    yearSlider.disabled = yearlyData.length === 0;
    
}

//2. Customization of text, bar, and timeline with the API data

function showYear() {
    const year = Number(yearSlider.value);
    document.getElementById("yearValue").textContent = year;

    const record = yearlyData.find(function (item) {
        return Number(item.date) === year;
    });
    if (!record) {
        document.getElementById("rateNumber").textContent = "--%";
        document.getElementById("rateBar").style.width = "0%";
        document.getElementById("statSentence").textContent = "Data not available for this year.";
        return;
    }

    const rate = Number(record.value);
    const countryName = countryNames[countrySelect.value];
    document.getElementById("rateNumber").textContent = rate.toFixed(1) + "%";
    document.getElementById("statSentence").textContent =
    `In ${year}, an estimated ${rate.toFixed(1)}% of 15-24-year-olds in the labour force in ${countryName} were unemployed.`;

    const bar = document.getElementById("rateBar");
    bar.style.width = rate + "%";
    bar.style.backgroundColor = rate < 10 ? "#745C86" : rate < 20 ? "#C77D76" : "#B45A7B";

    document.getElementById("detailHeading").textContent = `${countryName} in ${year}`;
    document.getElementById("detailMessage").textContent =
    "This is a labour-market statistic, not a  score of personal achievement. A friend's success doesn't mean you are behind.";

    //Displaying four years of data
    const timeline = document.getElementById("dataTimeline");
    timeline.replaceChildren();
    yearlyData.filter(function (item) {
        return Number(item.date) <= year;
    }).slice(-4).forEach(function (item) {
        const card = document.createElement("div");
        card.className = "timeline-item";
        const title = document.createElement("h4");
        title.textContent = item.date;
        const detail = document.createElement("p");
        detail.textContent = Number(item.value).toFixed(1) + "% youth unemployment";
        const track = document.createElement("div");
        track.className = "timeline-track";
        const miniBar = document.createElement("div")
        miniBar.className = "timeline-bar";
        miniBar.style.width = item.value + "%";
        track.append(miniBar);
        card.append(title, detail, track);
        timeline.append(card);
    });
}

//Two direct interactions with API display

countrySelect.addEventListener("change", loadYouthData);
yearSlider.addEventListener("input", showYear);
loadYouthData();

// "Your Own Pace" interaction

const timelineSlider = document.getElementById("timeline");
timelineSlider.addEventListener("input", function () {
    document.getElementById("timelineValue").textContent = timelineSlider.value;
});

const goals = {
    study: ["Make a weekly study schedule", "Practise and ask for feedback", "Review your progress and adjust"],
    coding: ["Learn one coding skill", "Build a small practice project", "Improve and share your project"],
    internship: ["Update your resume", "Find opportunities and apply", "Practice interviews and follow up"],
    project: ["Choose one small idea", "Make a first verison", "Test, improve and share it"]
    };

