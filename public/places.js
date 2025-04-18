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

let map = L.map('map').setView([41, -74], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let markers = [];

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');

    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (response.data.places) {
        for (const place of response.data.places) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td><button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button></td>
            `;
            tbody.appendChild(tr);

            if (place.lat && place.lng) {
                const marker = L.marker([place.lat, place.lng]).addTo(map);
                marker.bindPopup(`<strong>${place.label}</strong><br>${place.address}`);
                markers.push(marker);
            }
        }
    }
};
