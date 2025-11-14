interface Coord {
  latitude: number;
  longitude: number;
}

export function calculation2 (coord1:Coord,coord2:Coord):number{
    const R = 6371

    const lat1 = (coord1.latitude * Math.PI) / 180;
  const lon1 = (coord1.longitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const lon2 = (coord2.longitude * Math.PI) / 180;
    const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // المسافة النهائية
  const distance = R * c;

  // نرجع المسافة مقربة إلى جوج أرقام
  return Number(distance.toFixed(2));
}
export function calculateTime(distanceKm:number){
const vitessMouyenne = 30
const timeInHours  = distanceKm / vitessMouyenne
const timeInMinutes  = timeInHours * 60
return Math.round (timeInMinutes)
}
