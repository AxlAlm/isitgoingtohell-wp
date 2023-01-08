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
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Region } from "../server/api/routers/regions";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import iso3ToRegionObjs = require("../data/iso3_to_region.json");

import iso3ToRegionObjs from "../data/iso3_to_region.json";

// import foo = require('foo');
// require('foo');
// import foo from 'foo';

const geoUrl = "/features.json";

// load in map
const iso3ToRegion: Map<string, string> = new Map(
  iso3ToRegionObjs.map((x: any) => [x["code"], x["region"]])
);

const colorScale = scaleLinear([0, 1], ["white", "red"]);

// const useStyles = makeStyles({
//   paper: {
//     fontFamily: "VCR_OSD_MONO",
//   },
// });

const Home: NextPage = () => {
  const min = dayjs("2020-01-01");
  const max = dayjs().add(1, "month");

  const [data, setData] = useState<Region[]>([]);
  const [startMonth, setStartMonth] = useState<Dayjs>(min);
  const [endMonth, setEndMonth] = useState<Dayjs>(max);

  const regions = api.regions.all.useQuery({
    to_date: endMonth.toDate(),
    from_date: startMonth.toDate(),
  });

  const handleStartMonthChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }
    setStartMonth(newValue);
  };

  const handleEndMonthChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }

    setEndMonth(newValue);
  };

  useEffect(() => {
    setData(regions.data || []);
  }, [data, startMonth, endMonth]);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      minHeight="120vh"
      bgcolor="#ff71ce"
    >
      <div className="my-div"> Is it Going to hell?</div>
      <Box display="flex" alignItems="center" flexDirection="row">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            InputProps={{
              style: {
                fontFamily: "VCR_OSD_MONO",
                fontWeight: "bold",
                color: "#fffb96",
              },
            }}
            PopperProps={{
              style: {
                fontFamily: "VCR_OSD_MONO",
              },
            }}
            views={["year", "month"]}
            minDate={min}
            maxDate={max}
            value={startMonth}
            onChange={handleStartMonthChange}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
          <DatePicker
            InputProps={{
              style: {
                fontFamily: "VCR_OSD_MONO",
                fontWeight: "bold",
                color: "#fffb96",
              },
            }}
            views={["year", "month"]}
            minDate={min}
            maxDate={max}
            value={endMonth}
            onChange={handleEndMonthChange}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ width: 1000 }}>
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
            {(data || []).length > 0 && (
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = data.find(
                      (x) =>
                        x.region ===
                        (iso3ToRegion.get(geo.id) || "").toLowerCase()
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
          </ComposableMap>{" "}
        </div>
      </Box>
    </Box>
  );
};

export default Home;
