// Function to initialize the OpenStreetMap using Leaflet.js
function initMap() {
    let defaultCoordinates = [20.5937, 78.9629]; // Center of India

    // Initialize the map
    let map = L.map('map').setView(defaultCoordinates, 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add draggable marker at the center
    let marker = L.marker(defaultCoordinates, { draggable: true }).addTo(map);

    // Function to update location field
    function updateLocation(lat, lng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                let locationInput = document.getElementById("userLocation") || document.getElementById("driverLocation");
                if (locationInput) {
                    locationInput.value = data.display_name || `${lat}, ${lng}`;
                }
            })
            .catch(() => {
                let locationInput = document.getElementById("userLocation") || document.getElementById("driverLocation");
                if (locationInput) {
                    locationInput.value = `${lat}, ${lng}`;
                }
            });
    }

    // Update location when marker is moved
    marker.on('dragend', function () {
        let position = marker.getLatLng();
        updateLocation(position.lat, position.lng);
    });

    // Update location on map click
    map.on('click', function (e) {
        let lat = e.latlng.lat;
        let lng = e.latlng.lng;
        marker.setLatLng([lat, lng]);
        updateLocation(lat, lng);
    });
}

// Function to store user request in local storage
function storeUserRequest(event) {
    event.preventDefault();
    let name = document.getElementById('userName').value;
    let phone = document.getElementById('userPhone').value;
    let location = document.getElementById('userLocation').value;
    
    let request = { name, phone, location };
    let requests = JSON.parse(localStorage.getItem('userRequests')) || [];
    requests.push(request);
    localStorage.setItem('userRequests', JSON.stringify(requests));

    // Show notification for success
    document.getElementById('notification').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('notification').classList.add('hidden');
    }, 3000);

    document.querySelector('form').reset();
}

// Function to redirect to requests table
function showRequests() {
    window.location.href = 'requests_table.html';
}

// Load stored requests into the table
window.onload = function () {
    let tableBody = document.getElementById('requestsTableBody');
    if (tableBody) {
        let requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        requests.forEach(req => {
            let row = `<tr><td>${req.name}</td><td>${req.phone}</td><td>${req.location}</td></tr>`;
            tableBody.innerHTML += row;
        });
    }

    if (document.getElementById('map')) {
        initMap(); // Initialize the map when the page loads
    }
};
