import numeral from "numeral";
import { dayjsVN } from "./dayjsVN";

export const formatNumber = (value: number) => {
  return numeral(value).format("0,0");
};

export const formatPhoneNumber = (number: string): string =>
  number.replace(/^84/, "0").replace(/ /g, "");

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const formatDateWithShortWeekday = (date, separator = "-") => {
  const weekdayMap = {
    "thứ hai": "thứ 2",
    "thứ ba": "thứ 3",
    "thứ tư": "thứ 4",
    "thứ năm": "thứ 5",
    "thứ sáu": "thứ 6",
    "thứ bảy": "thứ 7",
    "chủ nhật": "chủ nhật",
  };

  const formattedDate = dayjsVN(date).format(`dddd ${separator} DD/MM/YYYY`);

  const weekday = formattedDate.split(` ${separator} `)[0];

  return capitalizeFirstLetter(
    formattedDate.replace(weekday, weekdayMap[weekday])
  );
};

export const formatCompactNumber = (number: number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + " Tỷ";
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + " Tr";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + " K";
  }
  return number.toString();
};
