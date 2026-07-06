export const CITY_COORDS = {
  lucknow: [26.8467, 80.9462],
  delhi: [28.6139, 77.2090],
  noida: [28.5355, 77.3910],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  mumbai: [19.0760, 72.8777],
  bombay: [19.0760, 72.8777],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  kolkata: [22.5726, 88.3639],
  calcutta: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  madras: [13.0827, 80.2707],
  hyderabad: [17.3850, 78.4867],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  kanpur: [26.4499, 80.3319],
  patna: [25.5941, 85.1376],
  bhopal: [23.2599, 77.4126],
  indore: [22.7196, 75.8577],
  nagpur: [21.1458, 79.0882],
  visakhapatnam: [17.6868, 83.2185],
  vadodara: [22.3072, 73.1812],
  ghaziabad: [28.6692, 77.4538],
  ludhiana: [30.9010, 75.8573],
  agra: [27.1767, 78.0081],
  nashik: [19.9975, 73.7898],
  faridabad: [28.4089, 77.3178],
  meerut: [28.9845, 77.7064],
  rajkot: [22.3039, 70.8022],
  varanasi: [25.3176, 82.9739],
  srinagar: [34.0837, 74.7973],
  amritsar: [31.6340, 74.8723],
  allahabad: [25.4358, 81.8463],
  prayagraj: [25.4358, 81.8463],
  coimbatore: [11.0168, 76.9558],
  jabalpur: [22.1760, 79.9300],
  gwalior: [26.2183, 78.1828],
  vijayawada: [16.5062, 80.6480],
  madurai: [9.9252, 78.1198],
  guwahati: [26.1445, 91.7362],
  chandigarh: [30.7333, 76.7794]
};

export const getBaseCoords = (address) => {
  if (!address || typeof address !== 'string') return [28.6139, 77.2090]; // Default New Delhi
  const lower = address.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (lower.includes(city)) {
      return coords;
    }
  }
  return [28.6139, 77.2090]; // Default New Delhi
};
