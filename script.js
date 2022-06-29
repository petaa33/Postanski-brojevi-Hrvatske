const input = document.getElementById('input-adress');
const inputContainer = document.querySelector('.input-container');
const info = document.querySelector('.info-container');
const mapView = document.getElementById('map');
const placesContainer = document.querySelector('.places-container');
const backButton = document.getElementById('backButton');
const zipcodeContainer = document.querySelector('.zipcode-container');
const state = document.getElementById('state');

const API_URL =  "http://api.zippopotam.us/HR/";

var map = L.map('map').setView([45.815399, 15.966568], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

async function GetAdress(broj){
    const res = await fetch(API_URL + broj);
    const data = await res.json();
    setMarker(data.places[0].longitude, data.places[0].latitude, data.places[0].state);
    setZipCodeInfo(data);
    setStateName(data.places[0].state);
    setPlace(data.places);
}

input.addEventListener('keyup', (e)=>{
    if (e.key === 'Enter') {
        inputContainer.classList.add('hidden');
        mapView.classList.remove('hidden');
        info.classList.remove('hidden')
        backButton.classList.remove('hidden');
        GetAdress(input.value);
    } 
})

function setMarker(long, lat, name){
    L.marker([lat, long]).addTo(map)
        .bindPopup(name);
}

function setZipCodeInfo(zipcode){
    zipcodeContainer.innerHTML = `
    <strong>Zipcode: </strong><div class="zipcode-info">${zipcode['post code']}</div>
    <strong>Country: </strong><div class="zipcode-info">${zipcode.country}</div>
    <strong>Abbreviation: </strong><div class="zipcode-info">${zipcode['country abbreviation']}</div>`
}

function setStateName(stateName){
    state.innerHTML = `${stateName} županija`;
}

function setPlace(places) {
    places.forEach(place=>{
        const li = document.createElement('li');
        li.classList.add('place');
        li.innerHTML =  place['place name'];
        placesContainer.appendChild(li);
    })
}

backButton.addEventListener('click', ()=>{
    info.classList.add('hidden');
    backButton.classList.add('hidden');
    mapView.classList.add('hidden');
    inputContainer.classList.remove('hidden');
    removeInfo();
});

function removeInfo() {
    while(placesContainer.lastChild != state) {
        placesContainer.removeChild(placesContainer.lastChild);
    }
    while(zipcodeContainer.firstChild) {
        zipcodeContainer.removeChild(zipcodeContainer.firstChild);
    }
}

