export const convertDMS = (lat: any, lng: any) => {
  var latitude = toDegreesMinutesAndSeconds(lat);
  var latitudeCardinal = lat >= 0 ? "N" : "S";

  var longitude = toDegreesMinutesAndSeconds(lng);
  var longitudeCardinal = lng >= 0 ? "E" : "W";

  return latitude + latitudeCardinal + ", " + longitude + longitudeCardinal;
};

export const toDegreesMinutesAndSeconds = (coordinate: any) => {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return degrees + "°" + minutes + "'" + seconds + '"';
};

export const metersToFeet = (meters: any) => Math.ceil(meters * 3.28084);

export const direction = (degree: any) => {
  if (degree >= 22.5 && degree < 67.5) {
    return "NE";
  } else if (degree >= 67.5 && degree < 112.5) {
    return "E";
  } else if (degree >= 112.5 && degree < 157.5) {
    return "SE";
  } else if (degree >= 157.5 && degree < 202.5) {
    return "S";
  } else if (degree >= 202.5 && degree < 247.5) {
    return "SW";
  } else if (degree >= 247.5 && degree < 292.5) {
    return "W";
  } else if (degree >= 292.5 && degree < 337.5) {
    return "NW";
  } else {
    return "N";
  }
};
