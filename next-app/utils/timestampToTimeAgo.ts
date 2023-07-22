export function timeStampToTimeAgo(unixTimestamp: number): string {
  const currentTime: number = Date.now();
  const timeDifference: number = currentTime - unixTimestamp * 1000; // Time difference in milliseconds

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  let difference = "";

  if (timeDifference < minute) {
    difference = Math.round(timeDifference / second) + " seconds ago";
  } else if (timeDifference < hour) {
    difference = Math.round(timeDifference / minute) + " minutes ago";
  } else if (timeDifference < day) {
    difference = Math.round(timeDifference / hour) + " hours ago";
  } else if (timeDifference < month) {
    difference = Math.round(timeDifference / day) + " days ago";
  } else if (timeDifference < year) {
    difference = Math.round(timeDifference / month) + " months ago";
  } else {
    difference = Math.round(timeDifference / year) + " years ago";
  }

  return difference;
}
