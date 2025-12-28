import dayjs from "dayjs";

/**
 * Converts seconds to dayjs time object
 * @param {number} seconds - Time in seconds
 * @returns {dayjs.Dayjs} - dayjs time object
 */
export const secToTime = (seconds) => {
  return dayjs()
    .set("hour", Math.floor(seconds / 3600))
    .set("minute", Math.floor((seconds % 3600) / 60))
    .set("second", (seconds % 3600) % 60);
};

/**
 * Converts dayjs time object to seconds
 * @param {dayjs.Dayjs} time - dayjs time object
 * @returns {number} - Time in seconds
 */
export const timeToSec = (time) => {
  return time.hour() * 3600 + time.minute() * 60 + time.second();
};

/**
 * Device timer modes
 */
export const TIMER_MODES = ["Off", "Manual", "Auto", "Map"];
