import { TransportMode, Position, Eta } from "@/interfaces";


const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getEta(
  transportMode: TransportMode,
  position: Position,
  placeId: string
): Promise<Eta> {
  // WARNING: This map is put inside a function because it depends on Google to be loaded
  const TRANSPORT_MODE_TO_TRAVEL_MODE = {
    [TransportMode.Walk]: window.google.maps.TravelMode.WALKING,
    [TransportMode.Car]: window.google.maps.TravelMode.DRIVING,
    [TransportMode.Transit]: window.google.maps.TravelMode.TRANSIT,
    // [TransportMode.Lyft]: window.google.maps.TravelMode.DRIVING,
  };
  const { latitude, longitude } = position;

  return new Promise((resolve, reject) => {
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [new window.google.maps.LatLng(latitude, longitude)],
        destinations: [{ placeId }],
        travelMode: TRANSPORT_MODE_TO_TRAVEL_MODE[transportMode],
      },
      (response, status) => {
        if (status !== "OK" || response === null) {
          return reject();
        }
        const element = response.rows[0].elements[0];
        if (element.status !== "OK") {
          return reject();
        }
        return resolve({
          recordedAtMs: Date.now(),
          durationMs: element.duration.value * 1000,
          distanceMeters: element.distance.value,
          transportMode
        });
      }
    );
  });
}

export function getFormattedDate(timeMs: number): string {
  const date = new Date(timeMs);
  const day = DAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];
  const monthDate = date.getDate();
  return `${day}, ${month} ${monthDate}`;
}

export function getFormattedTime(timeMs: number): string {
  const date = new Date(timeMs);
  const meridian = date.getHours() >= 12 ? "pm" : "am";
  let hour = date.getHours() % 12;
  if (hour === 0) {
    hour = 12;
  }
  let minutes = date.getMinutes().toString();
  if (date.getMinutes() < 10) {
    // append a 0 so there are 2 digits
    minutes = `0${minutes}`;
  }
  return `${hour}:${minutes} ${meridian}`;
}

export function distance(pos1: Position, pos2: Position) {
  /**
   * This routine calculates the distance between two points (given the latitude/longitude of those points). 
   * It is being used to calculate the distance between two locations using GeoDataSource (TM) 
   */
  const { latitude: lat1, longitude: lon1 } = pos1;
  const { latitude: lat2, longitude: lon2 } = pos2;
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	} else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	}
}
