const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;


export function getTimeUnits(ms: number): {
  milliseconds: number,
  seconds: number,
  minutes: number,
  hours: number,
  days: number,
} {
  let remainingMs = Math.abs(ms);
  const days = Math.floor(remainingMs / MS_PER_DAY);
  remainingMs %= MS_PER_DAY;
  const hours = Math.floor(remainingMs / MS_PER_HOUR);
  remainingMs %= MS_PER_HOUR;
  const minutes = Math.floor(remainingMs / MS_PER_MINUTE);
  remainingMs %= MS_PER_MINUTE;
  const seconds = Math.floor(remainingMs / MS_PER_SECOND);
  remainingMs %= MS_PER_SECOND;

  return {
    milliseconds: remainingMs,
    seconds,
    minutes,
    hours,
    days,
  };
};