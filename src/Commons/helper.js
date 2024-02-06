const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// start and end are Date objects
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

module.exports = { randomNumber, randomFromArray, randomDate };
