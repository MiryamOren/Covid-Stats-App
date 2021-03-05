
const covidAPI = 'https://corona-api.com/countries/';
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
    'asia': {
      countries : {},
      measuresFetched : false,
    },
    'europe': {
      countries : {},
      measuresFetched : false,
    },
    'africa': {
      countries : {},
      measuresFetched : false,
    },
    'americas': {
      countries : {},
      measuresFetched : false,
    },
    'world': {
      countries : {},
      measuresFetched : false,
    },
  },
  currentContinent : null, //
  currentCountry : null,
  currentMeasure : null,
  chart : new Chart(document.querySelector('.chart').getContext('2d'), {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [],
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
      storeCountries(continentsForFetch[i], countriesArr)
    }
    delete state.continents.europe.countries['Kosovo'];
    delete state.continents.world.countries['Kosovo'];
  
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
    state.continents[continent].countries[countryName] = {};
    state.continents[continent].countries[countryName]['code'] = countryCode;
  }
}

fetchContinentCountries();


// run
function displayCountries(continent){
    Object.keys(state.continents[continent].countries).forEach(country => {
      let newBtn = document.createElement('button');
      newBtn.innerHTML = country;
      newBtn.classList.add(country.split(' ').join('-'));
      document.querySelector('.countries').appendChild(newBtn);
    });
    document.querySelector('.covid-measures').style.visibility = 'visible';
    measureClick({target: document.querySelector('.confirmed'),});
}
function continentClick(event){
  let btn = event.target;
  state.currentContinent = btn.classList[1];
  document.querySelector('.countries').innerHTML = '';
  let continent = state.currentContinent;
  displayCountries(continent);
}

const continentsContainer = document.querySelector('.continents');
continentsContainer.addEventListener('click', continentClick);

// click on measures
function displaytContinentMeasure(){
  console.log('displaytContinentMeasure - start');
  const currentContinent = state.continents[state.currentContinent];
  const currentMeasure = state.currentMeasure;
  const countriesNames = Object.keys(currentContinent.countries);
  const countriesMeasure = [];
  const countries = Object.values(currentContinent.countries);
  countries.forEach(country => {
    countriesMeasure.push(country.measures[currentMeasure]);
  });
  state.chart.data.labels = countriesNames;
  state.chart.data.datasets[0].data = countriesMeasure;
  state.chart.data.datasets[0].label = `${currentMeasure} in ${state.currentContinent}`;
  state.chart.update();
  console.log('displaytContinentMeasure - end');

}
async function fetchMeasures(){
  console.log('fetchMeasures - start');
  const currentContinent = state.continents[state.currentContinent];
  const countries = Object.values(currentContinent.countries);
  const countriesNames = Object.keys(currentContinent.countries);
  for (let i = 0; i < countries.length; i++){
    const request = `${covidAPI}${countries[i].code}`;
    const fetchRes = await fetch(request);
    const coutryData = await fetchRes.json();
    currentContinent.countries[countriesNames[i]]['measures'] = coutryData.data.latest_data;
  }
  currentContinent.measuresFetched = true;
  console.log('fetchMeasures - end');
  displaytContinentMeasure();
}
function measureClick(event){
  state.chart.data.labels = [];
  state.chart.data.datasets[0].data = [];
  state.chart.data.datasets.label = ``;
  //
  let btn = event.target;
  let measure = btn.classList[1];
  state.currentMeasure = measure;
  console.log('current continent:');
  console.log(state.continents[state.currentContinent]);
  console.log('currentMeasure: ' + measure);

  if (state.continents[state.currentContinent].measuresFetched){
    displaytContinentMeasure();
  } else {
    fetchMeasures();
  }
}
const covidMeasuresContainer = document.querySelector('.covid-measures');
covidMeasuresContainer.addEventListener('click', measureClick);