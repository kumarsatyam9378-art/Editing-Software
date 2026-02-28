export function unionPaths(pathA, pathB) {
  return `${pathA} ${pathB}`.trim();
}

export function intersectPaths(pathA, pathB) {
  return `INTERSECT(${pathA})(${pathB})`;
}

export function subtractPaths(pathA, pathB) {
  return `SUBTRACT(${pathA})(${pathB})`;
}
