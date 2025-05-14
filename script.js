document.addEventListener('DOMContentLoaded', () => {
    const sightingsContainer = document.getElementById('sightings-container');
    const fetchButton = document.getElementById('fetchButton');
    const regionCodeInput = document.getElementById('regionCode');

    // --- IMPORTANT: REPLACE 'YOUR_EBIRD_API_KEY' WITH YOUR ACTUAL API KEY ---
    const ebirdApiKey = '4h06pnqorqit';
    // You can get an API key from https://ebird.org/api/keygen (requires an eBird account)

    async function fetchRecentSightings(regionCode) {
        if (ebirdApiKey === 'YOUR_EBIRD_API_KEY' || !ebirdApiKey) {
            sightingsContainer.innerHTML = '<p style="color: red;">Please add your eBird API key to the script.js file.</p>';
            return;
        }

        sightingsContainer.innerHTML = '<p>Loading sightings...</p>'; // Show loading message

        // eBird API endpoint for recent observations in a region
        const apiUrl = `https://api.ebird.org/v2/data/obs/${regionCode}/recent`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'X-eBirdApiToken': ebirdApiKey
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            displaySightings(data);

        } catch (error) {
            console.error('Error fetching eBird data:', error);
            sightingsContainer.innerHTML = `<p>Error loading sightings: ${error.message}. Please check the region code and your API key.</p>`;
        }
    }

    function displaySightings(sightings) {
        if (!sightings || sightings.length === 0) {
            sightingsContainer.innerHTML = '<p>No recent sightings found for this region, or the API returned no data.</p>';
            return;
        }

        sightingsContainer.innerHTML = ''; // Clear loading message or previous results

        sightings.forEach(sighting => {
            const sightingDiv = document.createElement('div');
            sightingDiv.classList.add('sighting');

            const speciesName = sighting.comName || 'Unknown Species';
            const scientificName = sighting.sciName || '';
            const location = sighting.locName || 'Unknown Location';
            const date = sighting.obsDt || 'Unknown Date';
            const count = sighting.howMany !== undefined ? sighting.howMany : 'Not specified';

            sightingDiv.innerHTML = `
                <h3>${speciesName} <em>(${scientificName})</em></h3>
                <p><span>Location:</span> ${location}</p>
                <p><span>Date:</span> ${date}</p>
                <p><span>Count:</span> ${count}</p>
            `;
            sightingsContainer.appendChild(sightingDiv);
        });
    }

    fetchButton.addEventListener('click', () => {
        const region = regionCodeInput.value.trim();
        if (region) {
            fetchRecentSightings(region);
        } else {
            alert('Please enter a region code.');
        }
    });

    // Optionally, fetch initial data on page load for the default region
    // const initialRegion = regionCodeInput.value.trim();
    // if (initialRegion) {
    //     fetchRecentSightings(initialRegion);
    // }
});
