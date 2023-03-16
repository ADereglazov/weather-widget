export function getWindDirection(value = 0) {
  const windDirections = [
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
  ];
  return windDirections[+(value / 22.5).toFixed(0)];
}
