const cloneDeepWith = require("lodash/cloneDeepWith");
const isElement = require("lodash/isElement");
const react = require("react");

function clone(value) {
  return cloneDeepWith(value, (val) => {
    if (isElement(val) || react.isValidElement(val)) {
      return true;
    }
  });
}

export function filterTree(_data: any = [], filter: any, depth = 0) {
  const data = depth === 0 ? clone(_data) : _data;

  const result: any = [];
  data.forEach((item) => {
    const verified = filter(item);

    if (!verified) return;

    if (verified && item.routes) {
      item.routes = filterTree(item.routes, filter, depth + 1);
    }

    return result.push(item);
  });

  return result;
}
