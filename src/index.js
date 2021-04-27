//ubicación actual
window.navigator.geolocation.getCurrentPosition(respon => {
    lat = respon.coords.latitude;
    lon = respon.coords.longitude;

    // url coordenadas decimales
    const urlLanLon = new URL(APIBASE)
    urlLanLon.searchParams.set('lat', lat)
    urlLanLon.searchParams.set('lon', lon)
    urlLanLon.searchParams.set('key', APIKEY)
    dFetch(urlLanLon)
})

//Variables globales
let marker
let lat = 40.41831;
let lon = -3.70275;
let city ;
let country; 

// dom
const im = document.querySelector('#im')
const input = document.querySelector('#input-value');
const button =  document.querySelector('#button-input')
const principal = document.querySelector('#principal')
// const article = document.createElement('article');
// const firstImg = document.querySelector('#firs-img')

// apis
const APIKEY = '34ce349360c34312b3727a2381d54935';
const APIBASE = 'http://api.weatherbit.io/v2.0/current'

// url por ciudad
const urlNameCity = new URL(APIBASE)

button.onclick = (event)=> {
    event.preventDefault()
    let capMax = 6;
    let principalCantidad = document.querySelectorAll('#principal > div');
    if(typeof input.value === typeof "") {
        city =  input.value.split(",")[0];
        country = input.value.split(", ")[1]
        urlNameCity.searchParams.set('city', city)
        urlNameCity.searchParams.set('country', country)
        urlNameCity.searchParams.set('key', APIKEY)
        // console.log(urlNameCity.href)
        dFetch(urlNameCity)
    } 
    if(principalCantidad.length === capMax) {
        principalCantidad.forEach(card => card.remove())
        //remover marcador
        //marker.remove();
        
    }
}





//mapa
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvZWp1cyIsImEiOiJja25zeHU2cHAya2tvMnZwZWtqYzlwd2g0In0.lX7NPQjztgXB0qQlbi4cmw';
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [lon, lat], // starting position [lng, lat]
zoom: 4 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());


async function dFetch(url) {
    //mostrar loading

    let response = await fetch(url);
    let json = await response.json();
    lat = json.data[0].lat;
    lon = json.data[0].lon;
    let data = json.data[0]
    // console.log(data)
    let weatheULIcon =  `https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`
    
    // ubicación en el mapa
    markerTo(lat, lon)


    // Seguimiento a la ubicación
    map.panTo([lon, lat])

     
    render(data, weatheULIcon)    

}
//marker
let markerTo = (lat, lon)=> {
    //remover marcador
    if(marker) {
        marker.remove();
    }
    marker = new mapboxgl.Marker({
        color: "#00D44F",
        draggable: true
    })
    .setLngLat([lon, lat])
    .addTo(map);
}

//render 
let render = (data, weatheULIcon) => {
    
let div1 = document.createElement('div');
div1.className = "card bg-info text-white"
div1.style.margin = "10px"

let img1 = document.createElement('img')
img1.className = "card-img"
img1.src = weatheULIcon

let div2 = document.createElement('div')
div2.className = "card-img-overlay"

let h5 = document.createElement('h5')
h5.className = "card-title"
h5.innerText = data.city_name;

let p1 = document.createElement('p')
p1.className = "card-text"
p1.innerText = data.weather.description;
p1.style.textAlign = "center"

let h1 = document.createElement('h1')
h1.innerText = `${data.temp}º`;

div2.append(h5);
div1.append(img1, div2, h1, p1);
principal.append(div1)

}
 //dFetch(urlNameCity)

// class HelloWorldControl {
//   onAdd(map) {
//     this._map = map;
//     this._container = document.createElement('div');
//     this._container.className = 'mapboxgl-ctrl';
//     this._container.textContent = 'Hello, world';
//     return this._container;
//   }
  
//   onRemove() {
//     this._container.parentNode.removeChild(this._container);
//     this._map = undefined;
//   }
// }
// let hello = new HelloWorldControl;
// console.log(hello.onAdd(map))
