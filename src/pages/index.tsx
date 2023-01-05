import { type NextPage } from "next";
import { api } from "../utils/api";
import React, { useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";

const geoUrl = "/features.json";

// load in map
const iso3ToRegionObjs = require("../data/iso3_to_region.json");
const iso3ToRegion = new Map(
  iso3ToRegionObjs.map((x: any) => [x["code"], x["region"]])
);

const colorScale = scaleLinear([0, 1], ["white", "red"]);

export type CountrySentimentScore = {
  score: number;
  region: string;
};

const start = new Date();
const end = new Date();

const Home: NextPage = () => {
  const mockData: CountrySentimentScore = {
    score: 0.1,
    region: "South America",
  };
  const [data, setData] = useState<CountrySentimentScore[]>([]);

  const x = api.news.all.useQuery({
    to_date: start,
    from_date: end,
  });
  console.log("HOELELEO", x.data);

  useEffect(() => {
    // const data = api.news.getAll.useQuery()
    // console.log(data)
    setData([mockData]);
  }, []);

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
    >
      <Sphere id="1" fill="white" stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {data.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data.find(
                (s: any) => s.region === iso3ToRegion.get(geo.id)
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? colorScale(d.score) : "#F5F4F6"}
                />
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default Home;
