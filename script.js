// Countries that visitors can explore
const countryNames = {
    CAN: "Canada",
    USA: "United States of America"
    GBR: "The United Kingdom"
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
    
}