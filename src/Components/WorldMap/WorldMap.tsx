import React, { useState, useEffect } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface WorldMapProps {
    data: any,
    casesType: string,
    country: string,
    perMillion?: boolean
  }

function WorldMap(props: WorldMapProps) {
    const { data, casesType, country, perMillion} = props
    let type = 1
    console.log(country)

    if (perMillion){
        type = 0
    }
    
    const [countryCenter, setCountryCenter] = useState<any>([35,0]);
    const [countryZoom, setCountryZoom] = useState<any>(2.3);


    useEffect(() => {
        console.log("useEffect Called")
        if(country === 'worldwide'){
            let newCenter=[35, 0]
            let newZoom = 2.3
            setCountryCenter(newCenter)
            setCountryZoom(newZoom)
        } else{
            data.forEach((item: any) => {
                if (item.name === country){
                    let newCenter=[item.latitude, item.longitude]
                    let newZoom = 4
                    setCountryCenter(newCenter)
                    setCountryZoom(newZoom)
                }
            })
        }
    },[country, data])

    return (
        <div>
            <Map
                style={{ height: "480px", width: "100%" }}
                zoom={countryZoom}
                center={[countryCenter[0], countryCenter[1]]}>
                <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {data.map((country: any) => {
                    return(
                        <CircleMarker
                            key={country.name + type}
                            center={[country.latitude,country.longitude]}
                            radius={Math.cbrt(country[casesType][type]/(type*50+1))}
                            color='red'
                            fillColor="red">
                            <Tooltip direction="right" offset={[3, 0]} opacity={1}>
                                <h4>{country.name}</h4>
                                <p>{"cases: " + country.cases[type]}</p>
                                <p>{"recovered: " + country.recovered[type]}</p>
                                <p>{"deaths: " + country.deaths[type]}</p>
                            </Tooltip>
                            </CircleMarker>
                    )
                })}
            </Map>
        </div>
    )
}

export default WorldMap
