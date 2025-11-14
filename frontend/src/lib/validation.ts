/**
 * Validation utilities for IoT device data
 * 
 * Provides validation functions for GPS, Weather, and Air Quality data
 * before publishing to Somnia blockchain
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate GPS data
 */
export function validateGPSData(data: {
  latitude: string;
  longitude: string;
  altitude: string;
  accuracy: string;
  speed: string;
  heading: string;
}): ValidationResult {
  const errors: string[] = [];

  // Latitude: -90 to 90
  const lat = parseFloat(data.latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  // Longitude: -180 to 180
  const lon = parseFloat(data.longitude);
  if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  // Altitude: reasonable range -500 to 10000 meters
  const alt = parseFloat(data.altitude);
  if (data.altitude && !isNaN(alt) && (alt < -500 || alt > 10000)) {
    errors.push('Altitude should be between -500 and 10,000 meters');
  }

  // Accuracy: 0 to 1000 meters
  const acc = parseFloat(data.accuracy);
  if (data.accuracy && !isNaN(acc) && (acc < 0 || acc > 1000)) {
    errors.push('Accuracy should be between 0 and 1000 meters');
  }

  // Speed: 0 to 1000 km/h (reasonable max)
  const spd = parseFloat(data.speed);
  if (data.speed && !isNaN(spd) && (spd < 0 || spd > 1000)) {
    errors.push('Speed should be between 0 and 1000 km/h');
  }

  // Heading: 0 to 360 degrees
  const hdg = parseFloat(data.heading);
  if (data.heading && !isNaN(hdg) && (hdg < 0 || hdg > 360)) {
    errors.push('Heading must be between 0 and 360 degrees');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Weather data
 */
export function validateWeatherData(data: {
  temperature: string;
  humidity: string;
  pressure: string;
  windSpeed: string;
  windDirection: string;
  rainfall: string;
}): ValidationResult {
  const errors: string[] = [];

  // Temperature: reasonable range -100 to 150°F (-73 to 66°C)
  const temp = parseFloat(data.temperature);
  if (isNaN(temp) || temp < -100 || temp > 150) {
    errors.push('Temperature must be between -100 and 150°F');
  }

  // Humidity: 0 to 100%
  const hum = parseFloat(data.humidity);
  if (isNaN(hum) || hum < 0 || hum > 100) {
    errors.push('Humidity must be between 0 and 100%');
  }

  // Pressure: 800 to 1100 hPa
  const press = parseFloat(data.pressure);
  if (isNaN(press) || press < 800 || press > 1100) {
    errors.push('Pressure must be between 800 and 1100 hPa');
  }

  // Wind Speed: 0 to 300 mph (reasonable max for extreme weather)
  const wind = parseFloat(data.windSpeed);
  if (isNaN(wind) || wind < 0 || wind > 300) {
    errors.push('Wind speed must be between 0 and 300 mph');
  }

  // Wind Direction: 0 to 360 degrees
  const windDir = parseFloat(data.windDirection);
  if (isNaN(windDir) || windDir < 0 || windDir > 360) {
    errors.push('Wind direction must be between 0 and 360 degrees');
  }

  // Rainfall: 0 to 100 inches/hour (reasonable max)
  const rain = parseFloat(data.rainfall);
  if (isNaN(rain) || rain < 0 || rain > 100) {
    errors.push('Rainfall must be between 0 and 100 inches/hour');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Air Quality data
 */
export function validateAirQualityData(data: {
  pm25: string;
  pm10: string;
  co2: string;
  no2: string;
  o3: string;
  aqi: string;
}): ValidationResult {
  const errors: string[] = [];

  // PM2.5: 0 to 1000 μg/m³ (unhealthy levels can exceed 500)
  const pm25 = parseInt(data.pm25);
  if (isNaN(pm25) || pm25 < 0 || pm25 > 1000) {
    errors.push('PM2.5 must be between 0 and 1000 μg/m³');
  }

  // PM10: 0 to 1000 μg/m³
  const pm10 = parseInt(data.pm10);
  if (isNaN(pm10) || pm10 < 0 || pm10 > 1000) {
    errors.push('PM10 must be between 0 and 1000 μg/m³');
  }

  // CO2: 300 to 5000 ppm (normal is ~400-1000)
  const co2 = parseInt(data.co2);
  if (isNaN(co2) || co2 < 300 || co2 > 5000) {
    errors.push('CO₂ must be between 300 and 5000 ppm');
  }

  // NO2: 0 to 500 ppb
  const no2 = parseInt(data.no2);
  if (isNaN(no2) || no2 < 0 || no2 > 500) {
    errors.push('NO₂ must be between 0 and 500 ppb');
  }

  // O3: 0 to 500 ppb
  const o3 = parseInt(data.o3);
  if (isNaN(o3) || o3 < 0 || o3 > 500) {
    errors.push('O₃ must be between 0 and 500 ppb');
  }

  // AQI: 0 to 500 (US EPA standard)
  const aqi = parseInt(data.aqi);
  if (isNaN(aqi) || aqi < 0 || aqi > 500) {
    errors.push('AQI must be between 0 and 500');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate wallet connection
 */
export function validateWalletConnection(address: string | undefined): ValidationResult {
  if (!address) {
    return {
      isValid: false,
      errors: ['Wallet not connected. Please connect your wallet to publish data.'],
    };
  }
  return {
    isValid: true,
    errors: [],
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return errors.join('. ');
}

