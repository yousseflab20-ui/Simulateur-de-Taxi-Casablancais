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

  const distance = R * c;

  return Number(distance.toFixed(2));
}
export function calculateTime(distanceKm:number){
const vitessMouyenne = 30
const timeInHours  = distanceKm / vitessMouyenne
const timeInMinutes  = timeInHours * 60
return Math.round (timeInMinutes)
}
export function calculatePrice(distanceKm:number,lightMode:Boolean):number{
  const PRISE_EN_CHARGE = 7.50
  const PRIX_PAR_KM_JOUR = 1.50
  const PRIX_PAR_KM_NUIT = 2.00
  const pricePerKm = lightMode ? PRIX_PAR_KM_JOUR : PRIX_PAR_KM_NUIT;
  const total = PRISE_EN_CHARGE + distanceKm * pricePerKm
  console.log(total)
  return Number(total.toFixed(2))
  
}