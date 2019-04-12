require("../../mongooseSetup/mongooseSetup");
const express = require("express");
const countryData = require("../data/country_hmr_percentile.json");
const stateData = require("../data/state_wise_median_hmr.json");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const mapMonth = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const filterStateData = () => {
  let finalStateObj = {};
  let years = stateData.aggregations.year.buckets;
  years.forEach((eachYear) => {
    let finalMonths = [];
    eachYear.month.buckets.forEach((eachMonth) => {
      let monthObj = {};
      monthObj.key = eachMonth.key;
      monthObj.month = mapMonth[eachMonth.key - 1];
      monthObj.states = eachMonth.splitBy.buckets;
      finalMonths.push(monthObj);
    });

    finalMonths.sort((a, b) => {
      if(a.key < b.key){
        return -1;
      }else if(a.key > b.key){
        return 1;
      }else{
        return 0;
      }
    });
    finalStateObj[eachYear.key] = finalMonths;
  });
  return finalStateObj;
}


app.get("/api/countrydata", (request, response) => {
  let buckets = countryData.aggregations.year.buckets;
  let finalObj = {};
  buckets.forEach((eachYear) => {
    let months = eachYear.months.buckets;
    let finalMonths = [];
    months.forEach(eachMonth => {
      let filteredMonth = {};
      filteredMonth.month = mapMonth[eachMonth.key - 1];
      filteredMonth.key = eachMonth.key;
      filteredMonth.hmrPercentiles = eachMonth.hmrPercentiles.values;
      finalMonths.push(filteredMonth);
    });

    finalMonths.sort((a, b) => {
      if(a.key < b.key){
        return -1;
      }else if(a.key > b.key){
        return 1;
      }else{
        return 0;
      }
    });
    finalObj[eachYear.key] = finalMonths;
  });
  response.json(finalObj);
});

app.get("/api/statedata", (request, response) => {
  let finalStateObj = filterStateData();
  response.json(finalStateObj);
});

app.get("/api/statedata/:year/:month", (request, response) => {
  let finalStateObj = filterStateData();
  let yearData = finalStateObj[request.params.year];
  if(yearData){
    let states = yearData.find((eachMonth) => {
      return eachMonth.month.toLowerCase() === request.params.month.toLowerCase();
    });
    response.json(states);
  }
});

app.use(express.static(path.resolve(__dirname, "../../client", "public" )));

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../../client", "public/index.html" ));
});

app.listen(port, () => {
  console.log(`Server running on - ${port}`);
});



