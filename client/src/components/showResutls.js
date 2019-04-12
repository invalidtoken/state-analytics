import React from "react";

export default function Results(props){
  let lessThan45 = [];
  let between45And60 = [];
  let greaterThan60 = [];
  let hmrPercentile = props.results.selectedHMRPercentile.hmrPercentiles;
  let states = props.results.stateData.states;
  states.forEach((eachState) => {
    let state = eachState.key;
    let value = eachState.hmrPercentiles.values["50.0"];

    if(value < hmrPercentile["45.0"]){
      lessThan45.push({ state, value });
    }else if(value >= hmrPercentile["45.0"] && value <= hmrPercentile["60.0"]){
      between45And60.push({ state, value });
    }else{
      greaterThan60.push({ state, value });
    }
  });
  console.log(lessThan45);
  console.log(between45And60);
  console.log(greaterThan60);
  console.log(lessThan45.length + between45And60.length + greaterThan60.length);
  return (
    <div className="container">
      <div className="analyticsDiv">
        <div className="analytics">
          <h2 className="analyticsHeader">{"State <45%le"}</h2>
          <ul className="analyticsList">
            {lessThan45.map((eachState, index) => {
              return <li className="badValue" key={index}>{`${eachState.state} - ${eachState.value}`}</li>
            })}
          </ul>
        </div>
        <div className="analytics">
          <h2 className="analyticsHeader">{"State <=60%le && State >= 45%le"}</h2>
          <ul className="analyticsList">
            {between45And60.map((eachState, index) => {
              return <li className="decentValue" key={index}>{`${eachState.state} - ${eachState.value}`}</li>
            })}
          </ul>
        </div>
        <div className="analytics">
          <h2 className="analyticsHeader">{"State >60%le"}</h2>
          <ul className="analyticsList">
            {greaterThan60.map((eachState, index) => {
              return <li className="goodValue" key={index}>{`${eachState.state} - ${eachState.value}`}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}