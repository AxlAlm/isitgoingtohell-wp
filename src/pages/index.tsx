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
import { Region } from "../server/api/routers/regions";

const geoUrl = "/features.json";

// load in map
const iso3ToRegionObjs = require("../data/iso3_to_region.json");
const iso3ToRegion: Map<string, string> = new Map(
  iso3ToRegionObjs.map((x: any) => [x["code"], x["region"]])
);

const colorScale = scaleLinear([0, 1], ["white", "red"]);

const start = new Date("2010-01-01");
const end = new Date("2024-01-01");

const Home: NextPage = () => {
  const [data, setData] = useState<Region[]>([]);

  // const regions = api.regions.all.useQuery({
  //   to_date: end,
  //   from_date: start,
  // });
  // console.log("HOELELEO", regions.data);

  useEffect(() => {
    setData(() => {
      const regions = api.regions.all.useQuery({
        to_date: end,
        from_date: start,
      });
      setData(regions.data as Region[]);
    });
    // fetchData();
  }, []);

  console.log("DATA", data);

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
    >
      <Sphere id="1" fill="white" stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {(data || []).length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data.find(
                (x) =>
                  x.region === (iso3ToRegion.get(geo.id) || "").toLowerCase()
              );
              console.log(iso3ToRegion);
              console.log("FOKEOFKEOFKOEF", data);
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
