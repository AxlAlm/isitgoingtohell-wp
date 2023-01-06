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
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

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

function valuetext(value: number) {
  return `${value}°C`;
}

const Home: NextPage = () => {
  const regions = api.regions.all.useQuery({
    to_date: end,
    from_date: start,
  });

  const [data, setData] = useState<Region[]>(regions.data || []);
  const [value, setValue] = useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  useEffect(() => {
    setData(regions.data || []);
  }, [data]);

  console.log("DATA", data);

  return (
    <Box
      sx={{ width: 1200 }}
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Box sx={{ width: 300 }}>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          color="primary"
          // colorPrimary="red"
        />
      </Box>

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
    </Box>
  );
};

export default Home;
