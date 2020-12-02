import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import './Graph.css';

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value:any, index:any, values:any) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

type GraphProps = { 
    casesType: string, 
    countryId: string 
}

type buildChartDataProps = {
    data: any,
    casesType: string
}

const buildChartData = ({ data, casesType }: buildChartDataProps) => {
    let chartData = [];
    let lastDataPoint;
    console.log(data)
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

const Graph = ({ casesType, countryId } : GraphProps) => {
    const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
        let queryId: string = (countryId === 'worldwide') ? 'all' : countryId;
        await fetch(`https://disease.sh/v3/covid-19/historical/${queryId}?lastdays=120`)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
                let chartData: any
                if (queryId === 'all'){
                    chartData = buildChartData({data, casesType});
                }else{
                    data = data.timeline
                    chartData = buildChartData({data, casesType});
                }
                setData(chartData);
            });
    };

    fetchData();
  }, [countryId, casesType]);

    return (
        <div className="graph__container">
            {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
        </div>
    )
}

export default Graph