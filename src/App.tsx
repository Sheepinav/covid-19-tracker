import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Card,
  CardContent,
  FormControl, 
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@material-ui/core';
import { TabPanel, a11yProps } from './Components/TabPanel/TabPanel';
import InfoBox from "./Components/InfoBox/InfoBox";
import { sortData } from "./utils/sortData";
import { printStats } from "./utils/printStats";
import numeral from 'numeral';
import Table from './Components/Table/Table';
import Graph from './Components/Graph/Graph';
import WorldMap from './Components/WorldMap/WorldMap';

function App() {
  const [countries, setCountries] = useState<Array<any>>([]);
  const [countryCode, setInputCountryCode] = useState<any>("worldwide");
  const [countryName, setInputCountryName] = useState<any>("Worldwide");
  const [countryInfo, setCountryInfo] = useState<any>({});
  const [casesType, setCasesType] = useState<any>("cases");
  const [tableData, setTableData] = useState<any>([]);
  const [tabValue, setTabValue] = useState<any>(0);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country: any) => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
            latitude: country.countryInfo.lat,
            longitude: country.countryInfo.long,
            cases: [country.casesPerOneMillion, country.cases],
            recovered: [country.recoveredPerOneMillion, country.recovered],
            deaths: [country.deathsPerOneMillion, country.deaths]
          }
        ))
        let sortedData = sortData(data);
        setCountries(countries);
        setTableData(sortedData);
      })
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (e: any) => {
    const countryCode = e.target.value;
    console.log(e)
    // const countryName = e.nativeEvent.originalTarget.innerText;
    const countryName = e.nativeEvent.target.innerText;

    const url =
      (countryCode === "worldwide")
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountryCode(countryCode);
        setInputCountryName(countryName);
        setCountryInfo(data);
      });
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19</h1>
          <FormControl className = "app__dropdown">
            <Select
              variant ="outlined"
              value={countryCode}
              onChange={onCountryChange}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem 
                    value={country.value} 
                    key={country.name}
                    >{country.name}</MenuItem>
                ))}
              </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
              onClick = {(e: React.MouseEvent<HTMLElement>) => setCasesType("cases")}
              title="Coronavirus Cases"
              active={casesType === "cases"}
              cases={printStats(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
            />
          <InfoBox
              onClick={(e: React.MouseEvent<HTMLElement>) => setCasesType("recovered")}
              title="Recovered"
              active={casesType === "recovered"}
              cases={printStats(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
            />
          <InfoBox
              onClick={(e: React.MouseEvent<HTMLElement>) => setCasesType("deaths")}
              title="Deaths"
              active={casesType === "deaths"}
              cases={printStats(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
            />
          </div>
          <Card>
            <CardContent>
              <h2 className="card__header">{countryName} new {casesType}</h2>
              {/* TODO: casestype recovered has no per capita */}
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                <Tab label="Graph" {...a11yProps(0)}/>
                <Tab label="Map" {...a11yProps(1)}/>
                <Tab label="Map (per Million)" {...a11yProps(2)}/>
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <Graph casesType={casesType} countryId={countryCode}/>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <WorldMap 
                  data = {countries} 
                  casesType = {casesType} 
                  country={countryName}/>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <WorldMap 
                  data = {countries} 
                  casesType = {casesType} 
                  country={countryName}
                  perMillion/>
              </TabPanel>
            </CardContent>
          </Card>
          {/* Map */}

      </div>
        {/* Table */}
        <Card className="app__right">
          <CardContent>
            <div className="app__information">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </div>
          </CardContent>
        </Card>
        {/* Graph */}
      </div>
  );
}

export default App;
