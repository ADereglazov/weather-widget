function getGeoLocalization() {
  return new Promise((resolve) => {
    geoFind()
      .then((res) => {
        if (res !== null) {
          resolve({ lat: res.lat, lon: res.lon });
        }
      })
      .catch(() => {
        ipFind()
          .then((res) => {
            resolve({ lat: res.lat, lon: res.lon });
          })
          .catch(() => resolve(null));
      });
  });
}
function geoFind() {
  return new Promise((resolve, reject) => {
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const location = {
        lat: latitude,
        lon: longitude,
      };
      resolve(location);
    }

    function error() {
      reject(
        new Error("Error when trying to determine geolocation coordinates")
      );
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      error();
    }
  });
}
function ipFind() {
  return fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      return {
        lat: data.latitude,
        lon: data.longitude,
      };
    })
    .catch((e) => {
      console.log(e);
    });
}

export { getGeoLocalization };
