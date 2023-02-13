export async function getWeatherFromGeo({ lat, lon }, apiUrl, apiKey) {
  const response = await fetch(
    `${apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
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
export async function getWeatherCity(value, apiUrl, apiKey) {
  const response = await fetch(
    `${apiUrl}?q=${value}&units=metric&appid=${apiKey}`
  );

  if (response.ok) {
    return await response.json();
  } else {
    const err = await response.json();
    throw new Error(err.message);
  }
}
