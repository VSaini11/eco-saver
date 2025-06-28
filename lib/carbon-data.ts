export const EMISSION_FACTORS = {
  transport: {
    car: 0.192, // kg CO₂e per km
    bike: 0.05, // kg CO₂e per km
    bus: 0.089, // kg CO₂e per km
    train: 0.041, // kg CO₂e per km
    flight_short: 0.15, // kg CO₂e per km
    flight_long: 0.11, // kg CO₂e per km
    walk: 0, // kg CO₂e per km
  },
  electricity: {
    factor: 0.82, // kg CO₂e per kWh (India average)
    fan_power: 0.075, // kW
    laptop_power: 0.05, // kW
  },
  diet: {
    vegan: 2.5, // kg CO₂e per day
    vegetarian: 3.0, // kg CO₂e per day
    mixed: 5.0, // kg CO₂e per day
    heavy_meat: 7.2, // kg CO₂e per day
  },
  water: {
    shower: 0.6, // kg CO₂e per minute
    laundry: 0.7, // kg CO₂e per load
  },
  consumption: {
    tshirt: 2.1, // kg CO₂e per item
    smartphone: 60, // kg CO₂e per item
    jeans: 33.4, // kg CO₂e per item
  },
}

export const GLOBAL_AVERAGES = {
  daily_footprint: 16, // kg CO₂e per day (global average)
  transport_share: 0.3, // 30% of total footprint
  electricity_share: 0.25, // 25% of total footprint
  diet_share: 0.3, // 30% of total footprint
  other_share: 0.15, // 15% of total footprint
}
