import { debounce } from "lodash";
import { error } from "@pnotify/core";
import countryItemTpl from "../templates/country-list-item.handlebars";
import countryInfoTpl from "../templates/country.handlebars";
import '@pnotify/core/dist/Material.css';

const elements = {
    inputEl: document.querySelector(".input"),
    countriesListEl: document.querySelector(".countries-list"),
    countryInfoEl: document.querySelector(".country-info"),
}

elements.inputEl.addEventListener("input", debounce(findingCountries, 500))

function findingCountries(event) {
    if (event.target.value === "") {
        elements.countriesListEl.innerHTML = "";
        return
    }
    fetch(`https://restcountries.com/v3.1/name/${event.target.value}`)
    .then(res=>res.json())
    .then(res=> {
        if (res.length >= 10) {
            showErrorFunction();
            return
        } else if (res.length === 1) {
            createCountryInfo(res[0])
            elements.countriesListEl.innerHTML = "";
            return
        }
        elements.countriesListEl.innerHTML = countryItemTpl(res);
        elements.countriesListEl.addEventListener("click", onCountryItemClick);
    })
}

function showErrorFunction() {
    error({
        text: "Too many matches found. Please enter more specific query!",
        delay: 1000,
        addClass: "a",
    })
}

function createCountryInfo(country) {

    const languages = Object.values(country.languages).reduce((array, language) => {
        return array = [...array, {language: language}]
    }, [])
    country.languages = languages;

    elements.countryInfoEl.innerHTML = countryInfoTpl(country);
}

function onCountryItemClick(event) {
    if (event.target.nodeName !== "LI") {
        return
    }
    fetch(`https://restcountries.com/v3.1/name/${event.target.dataset.name}`)
    .then(res=>res.json())
    .then(res=> {
        createCountryInfo(res[0]);
        elements.countriesListEl.innerHTML = "";
    })
}