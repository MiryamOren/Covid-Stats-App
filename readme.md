**Covid Stats App**
-
- state - stores the global vars
  -
- initializing
  -
  - for each continent, fetch its countries,
    and store it in state.continents
  - display continents btns
- runing - eventes
  -
  - click on continent
    - check if the continent data has been  fetched alredy:
      - if not, fetch the data of each country in this continent, store it in state, and call *displayCountries()*
      - if so, call *displayCountries()*
    - *displayCountries()* : create btn for country in this continent
  - click on measure
  - click on country