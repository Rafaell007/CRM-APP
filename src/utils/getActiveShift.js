
// Local clock as "HH:MM" 
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const isInsideWindow = (currentTime, startTime, endTime) =>
  startTime <= endTime
    ? // Same-day window ("08:00"–"16:00"): must be after start AND before end.
      currentTime >= startTime && currentTime < endTime
    : // Overnight window ("22:00"–"06:00") wraps past midnight
      currentTime >= startTime || currentTime < endTime;


export const getActiveShift = (shifts, currentTime = getCurrentTime()) =>
  shifts.find((shift) =>
    isInsideWindow(currentTime, shift.startTime, shift.endTime),
  ) ?? null;
