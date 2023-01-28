import React, { useEffect, useState, useRef } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import iso3ToRegionObjs from "../data/iso3_to_region.json";

const geoUrl = "/features.json";

export interface RegionSentiment {
  region: string;
  score: number;
}

const RegionSentimentMap = (props: { data: RegionSentiment[] }) => {
  // load in map
  const iso3ToRegion: Map<string, string> = new Map(
    iso3ToRegionObjs.map((x: any) => [x["code"], x["region"]])
  );

  const colorScale = scaleLinear([0, 1], ["white", "red"]);

  return (
    <div style={{ pointerEvents: "none" }}>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 140,
        }}
        style={{
          position: "relative",
          transform: "translate(-0px, -120px)",
        }}
      >
        <Sphere id="1" fill="#b967ff" stroke="#05ffa1" strokeWidth={0.7} />
        <Graticule stroke="#05ffa1" strokeWidth={0.7} />
        {props.data.length > 0 && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = props.data.find(
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
    </div>
  );
};

export default RegionSentimentMap;
