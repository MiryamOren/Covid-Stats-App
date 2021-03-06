// consts
const covidAPI = 'https://corona-api.com/countries/';

//global state
const state = {
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
            options: {
              title: {
                display: true,
                text: ''
            }
            }
          }),
};

// initializing
state.continents = continents;
continentClick({target : document.querySelector('.world')});

// run

function displayAndHide(display, displayNone, hide){
  display.forEach(elClass =>{
    let el = document.querySelector(`.${elClass}`);
    el.style.removeProperty('display'); 
    el.style.display = 'block';
    el.style.display = 'flex';
    el.style.visibility = 'visible';
  });
  displayNone.forEach(elClass =>{
    let el = document.querySelector(`.${elClass}`);
    el.style.removeProperty('display'); 
    el.style['display'] = 'none'; 
  });
  hide.forEach(elClass =>{
    let el = document.querySelector(`.${elClass}`);
    el.style.visibility = 'hidden';
  });
}

// click on continent
function displayCountries(continent){
    Object.keys(state.continents[continent].countries).forEach(country => {
      let newBtn = document.createElement('button');
      newBtn.innerHTML = country;
      newBtn.classList.add(country.split(' ').join('-'));
      newBtn.classList.add('country');
      document.querySelector('.countries').appendChild(newBtn);
    });
    document.querySelector('.covid-measures').style.visibility = 'visible';
    measureClick({target: document.querySelector('.confirmed'),});
}

function continentClick(event){
  let btn = event.target;
  if(btn.classList[0] === 'continent'){
    displayAndHide(['loading'], [], ['chart']);
    state.currentContinent = btn.classList[1];
    document.querySelector('.countries').innerHTML = '';
    let continent = state.currentContinent;
    displayCountries(continent);
  } 
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
  state.chart.data.datasets[0].label = `${currentMeasure}`;
  state.chart.options.title.text = `Covid 19 in ${state.currentContinent}`;
      
  state.chart.update();
  displayAndHide(['chart', 'covid-measures'], ['country-data', 'loading'], []);
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
    delete currentContinent.countries[countriesNames[i]]['measures'].calculated;
    if (coutryData.data.hasOwnProperty('timeline') && coutryData.data.timeline[0]){
      currentContinent.countries[countriesNames[i]]['measures']['new confirmed'] = coutryData.data.timeline[0]["new_confirmed"];
      currentContinent.countries[countriesNames[i]]['measures']['new deaths'] = coutryData.data.timeline[0]["new_deaths"];  
    }
  }
  currentContinent.measuresFetched = true;
  console.log('fetchMeasures - end');
  displaytContinentMeasure();
}
function measureClick(event){
  let btn = event.target;

  if (btn.classList[0] === 'covid-measure'){
    state.chart.data.labels = [];
    state.chart.data.datasets[0].data = [];
    state.chart.data.datasets.label = ``;

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
}
const covidMeasuresContainer = document.querySelector('.covid-measures');
covidMeasuresContainer.addEventListener('click', measureClick);

// click on country

function displayCountry(event){
  if(event.target.classList[1] === 'country'){
    document.querySelector('.cards-container').innerHTML = '';
    const countryName = event.target.classList[0].split('-').join(' ');
    const country = state.continents[state.currentContinent].countries[countryName];
    console.log(country);
    console.log(countryName);
    const measures = country.measures;

    document.querySelector('.country-data__heading').innerHTML = countryName;

    // create measure card for each measure
    Object.keys(measures).forEach(measure => {
      const measureCard = document.createElement('div');
      measureCard.classList.add('measure-card');
      const heading = document.createElement('h1');
      heading.innerHTML = measure;
      const content = document.createElement('p');
      content.innerHTML = measures[measure];
      measureCard.appendChild(heading);
      measureCard.appendChild(content);
      document.querySelector('.cards-container').appendChild(measureCard);

      displayAndHide(['country-data'], ['chart'], ['covid-measures']);
    });
  } 
}

const countriesContainer = document.querySelector('.countries');
countriesContainer.addEventListener('click', displayCountry);