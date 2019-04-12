import React from "react";
import ReactDOM from "react-dom";
import Results from "./components/showResutls";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: null,
      selectedMonth: null,
      countryData: null,
      stateData: null,
      results: null
    };

    this.onYearChange = (event) => {
      let year = event.target.value;
      this.setState((prevState) => {
        return {
          selectedYear: year,
          selectedMonth: prevState.countryData.data[year][0].month,
          stateData: null,
          results: null
        };
      });
    };

    this.onMonthChange = (event) => {
      let month = event.target.value;
      this.setState(() => {
        return {
          selectedMonth: month,
          stateData: null,
          results: null
        };
      });
    };

    this.findSelectedValues = () => {
      if (this.state.countryData && this.state.stateData) {
        let selectedHMRPercentile = this.state.countryData.data[this.state.selectedYear].find((eachMonth) => {
          return eachMonth.month.toLowerCase() === this.state.selectedMonth.toLowerCase();
        });

        return { selectedHMRPercentile, stateData: this.state.stateData };
      }
    };
  }

  async getCountryData() {
    let response = await fetch("/api/countrydata");
    let responseData = await response.json();
    return responseData;
  }

  async getStateData(year, month) {
    let response = await fetch(`/api/statedata/${year}/${month}`);
    let responseData = await response.json();
    return responseData;
  }

  async componentDidMount() {
    this.getCountryData();
    let countryData = await this.getCountryData();
    let givenYears = Object.keys(countryData);
    this.setState(() => {
      return {
        countryData: {
          data: countryData,
          years: givenYears
        },
        selectedYear: givenYears[0],
        selectedMonth: countryData[givenYears[0]][0].month.toLowerCase(),
        stateData: null,
        results: null
      };
    });
  }

  async componentDidUpdate() {
    console.log(this.state);
    if (this.state.selectedMonth && this.state.selectedYear && !this.state.stateData) {
      let states = await this.getStateData(this.state.selectedYear, this.state.selectedMonth);
      this.setState(() => {
        return {
          stateData: states
        }
      });
    } else if (this.state.selectedMonth && this.state.selectedYear && this.state.stateData && !this.state.results) {
      this.setState(() => {
        return {
          results: this.findSelectedValues()
        }
      })
    }

  }

  render() {
    return (
      <div>
        <div className="header">
          <div className="container selections">
            <h1 className="selectionHeader">Analytics</h1>
            <div className="selectYear">
              <select value={this.state.selectedYear || "select"} onChange={this.onYearChange}>
                {this.state.countryData ? (
                  this.state.countryData.years.map((eachYear, index) => {
                    return <option key={index} value={eachYear}>{eachYear}</option>
                  })
                ) : (
                    <option value="select">Select Year</option>
                  )}
              </select>
            </div>

            <div className="selectMonth">
              <select value={this.state.selectedMonth || "select"} onChange={this.onMonthChange}>
                {this.state.countryData ? (
                  this.state.countryData.data[this.state.selectedYear].map((eachMonth, index) => {
                    return <option key={index} value={eachMonth.month.toLowerCase()}>{eachMonth.month}</option>
                  })
                ) : (
                    <option value="select">Select Month</option>
                  )}
              </select>
            </div>
          </div>
        </div>
        <div>
          {this.state.results ? (
            <Results results={this.state.results} />
          ) : (
              <p>No Result to show</p>
            )}
        </div>
      </div>);
      }
    }
    
ReactDOM.render(<App heading="Header" para="Para" />, document.getElementById("app"))
        
        
