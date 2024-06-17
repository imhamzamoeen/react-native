import moment from "moment";
import * as mt from "moment-timezone";
export default function useTime() {
  const DEFAULT_FORMAT = "MMMM Do YYYY, h:mm:ss a";

  const currentTime = (format = DEFAULT_FORMAT) => moment().format(format);

  // Function to format a date using Moment.js
  const formatDate = (date: any, format = DEFAULT_FORMAT) => {
    return moment(date).format(format);
  };

  const diffForHumans = (date: any, format = DEFAULT_FORMAT) => {
    return moment(date).fromNow();
  };

  const convertTimeStampToDate = (unixTime: number) =>
    moment.unix(unixTime).format(DEFAULT_FORMAT);
  // Function to get the current date and time
  const getCurrentDateTime = () => {
    return moment().format(DEFAULT_FORMAT);
  };

  // Function to calculate the difference between two dates
  const calculateDateDiff = (
    startDate: any,
    endDate: any,
    unit = "days" as any
  ) => {
    return moment(endDate).diff(moment(startDate), unit);
  };
  const convertSecondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const getClientTimeZone = () => mt.tz.guess();

  const getDifferenceInSeconds = (start: any, end: string) => {
    const startTime = moment(start);
    const endTime = moment(end);

    return endTime.diff(startTime, "seconds");
  };

  return {
    DEFAULT_FORMAT,

    getDifferenceInSeconds,
    formatDate,
    getCurrentDateTime,
    calculateDateDiff,
    diffForHumans,
    getClientTimeZone,
    currentTime,
    convertSecondsToMinutes,
    convertTimeStampToDate,
  };
}
