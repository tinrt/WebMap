const addPlace = async () => {
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    await axios.put('/places', { label: label, address: address });
    await loadPlaces();
};

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    await loadPlaces();
};

// Initialize map
let map = L.map('map').setView([41.08, -74.17], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Store markers globally to manage them
let markers = [];

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');

    // Clear table
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Remove old markers from map
    for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];

    if (response.data.places) {
        for (const place of response.data.places) {
            // Update table row
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td><button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button></td>
            `;
            tbody.appendChild(tr);

            // Add marker if lat/lng are valid
            if (place.lat && place.lng) {
                const marker = L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`<b>${place.label}</b><br/>${place.address}`);
                markers.push(marker);
            }
        }
    }
};
