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

let map = L.map('map').setView([41.08, -74.17], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let markers = [];

const on_row_click = (e) => {
    let row = e.target;
    if (row.tagName.toUpperCase() === 'TD') {
        row = row.parentNode;
    }

    const lat = row.dataset.lat;
    const lng = row.dataset.lng;

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        map.flyTo(new L.LatLng(lat, lng), 15); // zoom level 15 for closer look
    }
};

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (response.data.places) {
        for (const place of response.data.places) {
            const tr = document.createElement('tr');

            tr.dataset.lat = place.lat;
            tr.dataset.lng = place.lng;
            tr.onclick = on_row_click;

            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td><button class='btn btn-danger' onclick='deletePlace(${place.id}); event.stopPropagation();'>Delete</button></td>
            `;
            tbody.appendChild(tr);

            if (place.lat && place.lng) {
                const marker = L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`<b>${place.label}</b><br/>${place.address}`);
                markers.push(marker);
            }
        }
    }
};
