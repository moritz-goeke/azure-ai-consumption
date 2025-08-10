export function beautifyCostCentValue(value) {
  let ret = value;
  if (value >= 100) {
    ret = value / 100;
    return roundToXDigits(ret, 3) + "€";
  }
  return roundToXDigits(ret, 3) + "ct";
}

export function roundToXDigits(number, digits) {
  const scale = 10 ** digits;
  return Math.round((number + Number.EPSILON) * scale) / scale;
}
