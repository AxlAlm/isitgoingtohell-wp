import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
}

const DateRangePicker = (props: {
  minDate: Dayjs;
  maxDate: Dayjs;
  onChange: (dateRange: DateRange) => void;
}) => {
  const [startDate, setStartDate] = useState<Dayjs>(props.minDate);
  const [endDate, setEndDate] = useState<Dayjs>(props.maxDate);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }
    setStartDate(newValue);
    props.onChange({ startDate: newValue, endDate: endDate });
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }

    setEndDate(newValue);
    props.onChange({ startDate: startDate, endDate: newValue });
  };

  return (
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
        minDate={props.minDate}
        maxDate={props.maxDate}
        value={startDate}
        onChange={handleStartDateChange}
        renderInput={(params) => <TextField {...params} helperText={null} />}
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
        minDate={props.minDate}
        maxDate={props.maxDate}
        value={endDate}
        onChange={handleEndDateChange}
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;
