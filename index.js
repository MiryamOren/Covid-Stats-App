
const covidAPI = 'https://corona-api.com/countries';
const countryAPI = 'https://restcountries.herokuapp.com/api/v1';
const proxy1 = 'https://api.codetabs.com/v1/proxy/?quest='
const proxy2 = 'https://cors.bridged.cc/'
const continentsForFetch = [
  'world',
  'asia',
  'europe',
  'africa',
  'americas',
];

//global state
const state = {
  continents : {
    'asia': {},
    'europe': {},
    'africa': {},
    'americas': {},
    'world': {},
  },
  currentContinents : null, //
  currentCountry : null,
  chart : new Chart(document.querySelector('.chart').getContext('2d'), {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [0, 10, 5, 2, 20, 30, 45]
                }]
            },

            // Configuration options go here
            options: {}
          }),
};

// initializing
async function fetchContinentCountries(){
  try{
    for (let i = 0; i < continentsForFetch.length; i++){
      let request = (continentsForFetch[i] === 'world')?
        `${proxy2}${countryAPI}/` :
        `${proxy2}${countryAPI}/region/${continentsForFetch[i]}`;
      const fetchRes = await fetch(request);
      const countriesArr = await fetchRes.json();
      console.log(countriesArr);
      storeCountries(continentsForFetch[i], countriesArr)
    }
    delete state.continents.europe['Kosovo'];
  
  // display continents
  document.querySelector('.continents').style.visibility = 'visible';
  }  catch (err) {
    console.log(err);
  }
}
function storeCountries(continent, countriesArr){
  for (let i = 0; i < countriesArr.length; i++){
    let countryName = countriesArr[i].name.common;
    let countryCode = countriesArr[i].cca2;
    state.continents[continent][countryName] = {};
    state.continents[continent][countryName]['code'] = countryCode;
  }
}
fetchContinentCountries();



// run
function displayCountries(continent){
    Object.keys(state.continents[continent]).forEach(country => {
      let newBtn = document.createElement('button');
      newBtn.innerHTML = country;
      newBtn.classList.add(country.split(' ').join('-'));
      document.querySelector('.countries').appendChild(newBtn);
    });
    document.querySelector('.covid-measures').style.visibility = 'visible';
}
function continentClick(event){
  let btn = event.target;
  state.currentContinents = btn.classList[1];

  document.querySelector('.countries').innerHTML = '';
  let continent = state.currentContinents;
  displayCountries(continent);
}

const continentsContainer = document.querySelector('.continents');
continentsContainer.addEventListener('click', continentClick);

async function fetchMeasure(){

}
function measureClick(event){
  let btn = event.target;
  let measure = btn.classList[1];
  console.log(btn);
  console.log(measure);
  fetchMeasure()
}
const covidMeasuresContainer = document.querySelector('.covid-measures');
covidMeasuresContainer.addEventListener('click', measureClick);