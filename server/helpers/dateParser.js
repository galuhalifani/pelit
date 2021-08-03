function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function sqlDateFormat(date) {
  return date.toISOString().split("T")[0];
}

function localeDateString(date) {
  // return date.toLocaleDateString()
}

function thirtyDaysFromNow(date, noOfDays) {
  return new Date(new Date().setDate(new Date(date).getDate() + noOfDays));
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// console.log(randomIntFromInterval(1000000, 6000000)

module.exports = {
  randomDate,
  sqlDateFormat,
  localeDateString,
  thirtyDaysFromNow,
  randomIntFromInterval,
};
