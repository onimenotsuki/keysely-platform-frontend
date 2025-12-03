export function generateGoogleMapsLink(latitude: number, longitude: number) {
  return `https://maps.google.com?q=${latitude},${longitude}`;
}

export default generateGoogleMapsLink;
