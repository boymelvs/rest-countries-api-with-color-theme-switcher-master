"use strict";

/* theme switch */
const getTheme = document.querySelector(".theme_select");

const getAllDarkModes = () => {
   return document.querySelectorAll(".dark_mode");
};

getTheme.addEventListener("click", () => {
   getAllDarkModes().forEach((darkMode) => {
      darkMode.classList.toggle("active");
   });
});

const getThemeCheckbox = () => {
   return document.querySelector(".theme_checkbox");
};

/* show spinner while getting data */
const getLoading = () => {
   const loading = `<div class="loading">
                        <img src="./images/loading.svg" alt="Loading" />
                        <span>Loading...</span>
                     </div>`;
   return loading;
};

/* location where card to be inserted */
const getCardContainer = () => {
   return document.querySelector(".card_container");
};

/* get all cards that inserted */
const getCards = () => {
   return document.querySelectorAll(".card");
};

/* location of all pagination, show/hide purposes */
const getPaginationContainer = (show) => {
   document.querySelector(".pagination").style.display = show;
};

/* location where pagination to be inserted */
const getPageContainer = () => {
   return document.querySelector(".page_container");
};

/* get all pagination that inserted */
const getPages = () => {
   return document.querySelectorAll(".page");
};

/* location where each border country inserted */
const getBordersContainer = () => {
   return document.querySelector(".border_list");
};

/* get all border country that inserted */
const getBorderNames = () => {
   return document.querySelectorAll(".border_name");
};

/* clickable purposes */
const getBackBtn = (show) => {
   document.querySelector(".back_btn_container").style.display = show;
   return document.querySelector(".back_btn_container");
};

/* show/hide purposes */
const getSearchContainer = (show) => {
   document.querySelector(".search_container").style.display = show;
   return document.querySelector(".search_container");
};

const getSearch = () => {
   return document.querySelector(".search");
};

/* show/hide purposes */
const getFilterRegion = (show) => {
   document.querySelector(".filter_region_container").style.display = show;
   return document.querySelector(".filter_region_container");
};

const getDropdowns = () => {
   return document.querySelectorAll(".dropdown_menu");
};

/* function that create per page btn */
const createPagination = (countries, numPages) => {
   /* call getPageContainer to empty */
   getPageContainer().innerHTML = "";
   /*  32 card to display */
   const numCardsperPage = 32; /* initial */
   /* count of clickable btn page */
   const numBtnsPage = Math.ceil(countries.length / numCardsperPage);
   const pages = [];
   let listCountry;

   for (let i = 0; i < numBtnsPage; i++) {
      /* when btnsPage click insert active_page class */
      let active;

      if (numPages === i) {
         active = "active_page";
         /* get small part of data */
         const start = numCardsperPage * numPages;

         listCountry = countries.slice(start);

         /* get number of card to display */
         const insertNumCards = listCountry.length < numCardsperPage ? listCountry.length : numCardsperPage;

         /* display the cards */
         insertMultipleCards(listCountry, insertNumCards);
      }

      pages.push(`<li class="${active} page dark_mode ${getThemeCheckbox().checked && "active"}">${i + 1}</li>`);

      /* display the page btn */
      getPageContainer().innerHTML += pages[i];
   }
   /* call function for clickable purposes */
   imListening(countries, getPages());
};

/* function that make the card clickable */
const imListening = (countries, eachItem) => {
   eachItem.forEach((item, countryKey) => {
      item.addEventListener("click", (e) => {
         if (item.classList.contains("page")) {
            createPagination(countries, countryKey);
         }

         if (item.classList.contains("card")) {
            // insertSingleCard(countries, countryKey);
            insertSingleCard(countries[countryKey]);
         }

         if (item.classList.contains("dropdown_menu")) {
            const searchRegion = e.target.name;

            const findRegion = countries.filter((region, regionKey) => {
               const matchRegion = region.region.toLowerCase();
               return matchRegion.includes(searchRegion);
            });

            createPagination(findRegion, 0);
         }

         if (item.classList.contains("border_name")) {
            const result = findCountry(allCountrydata, item.textContent.toLowerCase());

            insertSingleCard(result[0]);
         }

         if (item.classList.contains("back_btn_container")) {
            createPagination(allCountrydata, 0);
            getBackBtn("none");
            getSearchContainer("flex");
            getFilterRegion("flex");
            getSearch().value = "";
         }
      });
   });
};

/* function that display multiple card */
const insertMultipleCards = (countries, numOfCards) => {
   getCardContainer().innerHTML = getLoading();
   /* call getPageContainer to empty */
   getCardContainer().innerHTML = "";
   const insertCard = [];

   for (let i = 0; i < numOfCards; i++) {
      const flag = Object.values(countries[i].flags);

      insertCard.push(`<div class="card dark_mode ${getThemeCheckbox().checked && "active"}">
      
                           <div class="flag"><img src="${flag[0]}" alt="${countries[i].name.common} flag" class="country_flag_img" /></div>

                           <div class="country_info">
                              <div class="name">${countries[i].name.common}</div>
                              <div class="population">Population: <span class="population_counts">${countries[i].population.toLocaleString()}</span></div>
                              
                              <div class="region">
                                 Region:
                                 <span class="region_name">${countries[i].region}</span>
                              </div>

                              <div class="capital">
                                 Capital:
                                 <span class="capital_name">${!countries[i].capital ? "" : countries[i].capital}</span>
                              </div>
                           </div>
                        </div>`);

      getCardContainer().innerHTML += insertCard[i];
   }

   getPaginationContainer("block");
   /* call function for clickable purposes */
   imListening(countries, getCards());
};

/* function that insert each border country to single card */
const getBorderCountries = (countries) => {
   const borderCountry = [];

   if (!countries.borders) {
      return;
   }

   countries.borders.forEach((border, borderKey) => {
      const altNameBorders = altName(border);

      borderCountry.push(`<div class="border_name dark_mode ${getThemeCheckbox().checked && "active"}">${altNameBorders.name.common}</div>`);

      getBordersContainer().innerHTML += borderCountry[borderKey];
   });

   imListening(countries, getBorderNames());
};

/* function that make full country name */
const altName = (border) => {
   const altNameBorders = allCountrydata.find((altNameBorder) => {
      return altNameBorder.cca3 == border;
   });

   return altNameBorders;
};

/* function that display single click card */
const insertSingleCard = (country) => {
   /* getting currency */
   const getCurrency = (currency) => {
      if (!currency.currencies) {
         return;
      }

      return Object.values(country.currencies);
   };

   const flag = Object.values(country.flags);
   const nativeName = Object.values(country.name);
   const currency = getCurrency(country);

   const singleCard = `<div class="single_page_container">
                           <div class="single_page dark_mode">
                              <div class="single_flag">
                                 <img src="${flag[0]}" alt="${country.name.common} Flag" class="country_flag_img" />
                              </div>

                              <div class="info_borders_container">
                                 <div class="name">${country.name.common}</div>
                                 
                                 <div class="general_info">
                                    <div class="single_page_info">
                                       <div class="native">Native Name: <span class="native_name">${nativeName[1]}</span></div>

                                       <div class="population">Population: <span class="population_counts">${country.population.toLocaleString()}</span></div>

                                       <div class="region">
                                          Region:
                                          <span class="region_name">${country.region}</span>
                                       </div>

                                       <div class="sub_region">Sub Region: <span class="sub_region_name"> ${!country.subregion ? "" : country.subregion} </span></div>

                                       <div class="capital">
                                          Capital:
                                          <span class="capital_name">${country.capital ? country.capital : ""}</span>
                                       </div>
                                    </div>

                                    <div class="single_page_info_domain">
                                       <div class="domain">Top Level Domain: <span class="domain_name">${country.tld[0]}</span></div>
                                    
                                       <div class="currency">Currencies: <span class="currency_name">${!currency ? "" : currency[0].name}</span></div>

                                       <div class="languages">Languages: <span class="languages_name">${Object.values(country.languages)}</span></div>
                                    </div>
                                 </div>

                                 <div class="borders">
                                    <div class="border_text">Border Countries:</div>
                                    <div class="border_list"></div>
                                 </div>                        
                              </div>
                           </div>
                     </div>`;

   getCardContainer().innerHTML = singleCard;
   getBorderCountries(country);

   /* show/hide purposes */
   getSearchContainer("none");
   getPaginationContainer("none");
   getFilterRegion("none");

   /* back button listening */
   imListening(country, [getBackBtn("block")]);
};

const getSearchCountry = (countries) => {
   getSearch().addEventListener("keypress", (e) => {
      const searchCountry = e.target.value.toLowerCase();

      if (!searchCountry) {
         createPagination(countries, 0);
         return;
      }

      if (e.key === "Enter") {
         getPageContainer().innerHTML = "";
         const result = findCountry(countries, searchCountry);

         if (result.length > 0) {
            insertMultipleCards(result, result.length);
         } else {
            getCardContainer().innerHTML = `The Country Name "${searchCountry}" cannot be found. try again!`;
            getCardContainer().style.fontSize = "3rem";
         }
      }
   });
};

const getByRegion = (countries) => {
   imListening(countries, getDropdowns());
};

/* find the country from input search */
const findCountry = (countries, name) => {
   return countries.filter((country, key) => {
      const matchCountry = country.name.common.toLowerCase();
      return matchCountry.includes(name);
   });
};

/* function that get all data  */
let allCountrydata;
const getUrl = "https://restcountries.com/v3.1/all";
// const getUrl = "../data/data.json";
const getAllCountryData = async () => {
   getCardContainer().innerHTML = getLoading();

   try {
      const res = await fetch(getUrl);
      const datas = await res.json();

      /* sorted out by bigger population is first */
      const sorted = datas.sort((a, b) => {
         return b.population - a.population;
      });

      createPagination(sorted, 0);
      getSearchCountry(sorted);
      getByRegion(sorted);
      allCountrydata = sorted;
   } catch (error) {
      console.log("Error", error);
   }
};
getAllCountryData();