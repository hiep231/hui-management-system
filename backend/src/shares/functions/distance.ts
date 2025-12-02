const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

export const calculateDistanceKM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  try {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Example usage:
// const distanceInKm = distance(40.7128, -74.0060, 51.5074, -0.1278);
// console.log(distanceInKm);