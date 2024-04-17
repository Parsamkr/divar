const utf8 = require("utf8");

const isTrue = (value) => ["true", 1, true].includes(value);
const isFalse = (value) => ["false", 0, false].includes(value);

const removePropertyInObject = (target = {}, properties = []) => {
  for (const item of properties) {
    delete target[item];
  }
  return target;
};

const decodeInObject = (obj) => {
  for (let key in obj) {
    let value = obj[key];
    delete obj[key];
    key = utf8.decode(key);
    obj[key] = value;
  }
};

module.exports = { isFalse, isTrue, removePropertyInObject, decodeInObject };
