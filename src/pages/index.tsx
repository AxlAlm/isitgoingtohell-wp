import { type NextPage } from "next";
import { api } from "../utils/api";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { RegionSentiment } from "../server/api/routers/news";
import dayjs from "dayjs";
import MusicPlayer from "../components/MusicPlayer";
import DateRangePicker, { DateRange } from "../components/DateRangePicker";
import RegionSentimentMap from "../components/RegionSentimentMap";

const Home: NextPage = () => {
  const song =
    "https://static1.squarespace.com/static/57e83f709de4bbd550a2fdba/58e6e631579fb3bb25ed2822/6323fd85ebe8f81bc36cd975/1663303114116/Eternal+Light.mp3";
  const minDate = dayjs("2020-01-01");
  const maxDate = dayjs().add(1, "month");

  const [data, setData] = useState<RegionSentiment[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: minDate,
    endDate: maxDate,
  });

  const regions = api.news.sentimentPerRegion.useQuery({
    to_date: dateRange.endDate.toDate(),
    from_date: dateRange.startDate.toDate(),
  });

  const handleDateRangeChange = (dateRange: DateRange) => {
    if (dateRange === null) {
      return;
    }
    setDateRange(dateRange);
  };

  useEffect(() => {
    setData(regions.data || []);
  }, [data, dateRange]);

  return (
    <Box bgcolor="#ff71ce">
      <Box alignItems="left">
        <MusicPlayer url={song} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        minHeight="120vh"
      >
        <div className="cool-title"> Is it Going to Hell?</div>
        <Box display="flex" alignItems="center" flexDirection="row">
          <DateRangePicker
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleDateRangeChange}
          />
        </Box>
        <Box sx={{ width: 1000 }}>
          <RegionSentimentMap data={data} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
