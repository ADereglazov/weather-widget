export async function getWeatherFromGeo({
  lat,
  lon,
  lang = "en",
  units = "metric",
  apiUrl = "",
  apiKey = "",
}) {
  const response = await fetch(
    `${apiUrl}?lat=${lat}&lon=${lon}&lang=${lang}&units=${units}&appid=${apiKey}`
  );

  if (response.ok) {
    const location = await response.json();
    location.lastUpdated = Date.now();
    return location;
  } else {
    const err = await response.json();
    throw new Error(err.message);
  }
}

export async function getWeatherCity({
  city = "",
  lang = "en",
  units = "metric",
  apiUrl = "",
  apiKey = "",
}) {
  const response = await fetch(
    `${apiUrl}?q=${city}&lang=${lang}&units=${units}&appid=${apiKey}`
  );

  if (response.ok) {
    return await response.json();
  } else {
    const err = await response.json();
    throw new Error(err.message);
  }
}
