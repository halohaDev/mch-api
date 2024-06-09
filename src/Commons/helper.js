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

const snakeToCamel = (str) => {
  return str.replace(/(_\w)/g, (m) => m[1].toUpperCase());
};

const snakeToCamelObject = (obj) => {
  // validat is object
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  // array
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamelObject(v));
    }
    
  // object
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[snakeToCamel(key)] = snakeToCamelObject(obj[key]);
  });

  return newObj;
}
  

module.exports = { randomNumber, randomFromArray, randomDate, snakeToCamelObject };
