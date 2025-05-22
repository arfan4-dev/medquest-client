function time(timeStr) {
  const inputTime = new Date(timeStr);
  const now = new Date();

  const diffInMs = now - inputTime;

  const diffInSec = diffInMs / 1000;
  const diffInMin = diffInSec / 60;
  const diffInHour = diffInMin / 60;
  const diffInDay = diffInHour / 24;

  if (diffInSec < 60) {
    return "Just now";
  } else if (diffInMin < 60) {
    return `${Math.floor(diffInMin)} minutes ago`;
  } else if (diffInHour < 24) {
    return `${Math.floor(diffInHour)} hours ago`;
  } else if (diffInDay < 7) {
    return `${Math.floor(diffInDay)} days ago`;
  } else {
    return inputTime.toISOString();
  }
}

export default time;
