/**
 * Comprehensive Measurement Units Definition & Conversion Mathematics
 */

export type UnitCategoryId =
  | 'temperature'
  | 'time'
  | 'storage'
  | 'length'
  | 'mass'
  | 'area'
  | 'volume'
  | 'speed'
  | 'pressure'
  | 'energy'
  | 'angle';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategoryId;
  aliases: string[];
  // If linear: toBase and fromBase are multiplication/division or ratios
  // For affine (temperature): custom function
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
  description?: string;
}

export interface UnitCategory {
  id: UnitCategoryId;
  name: string;
  iconName: string;
  baseUnitSymbol: string;
  description: string;
  units: UnitDefinition[];
  presets: {
    label: string;
    value: number;
    unitId: string;
    targetUnitId: string;
    note: string;
  }[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    baseUnitSymbol: 'K',
    description: 'Thermal scales for science, weather, and everyday cooking',
    units: [
      {
        id: 'celsius',
        name: 'Celsius',
        symbol: '°C',
        category: 'temperature',
        aliases: ['c', 'deg c', 'centigrade', 'degrees celsius'],
        toBase: (c) => c + 273.15,
        fromBase: (k) => k - 273.15,
        description: 'Standard metric scale based on freezing and boiling points of water',
      },
      {
        id: 'fahrenheit',
        name: 'Fahrenheit',
        symbol: '°F',
        category: 'temperature',
        aliases: ['f', 'deg f', 'degrees fahrenheit'],
        toBase: (f) => ((f - 32) * 5) / 9 + 273.15,
        fromBase: (k) => ((k - 273.15) * 9) / 5 + 32,
        description: 'Commonly used in the United States for meteorology and consumer settings',
      },
      {
        id: 'kelvin',
        name: 'Kelvin',
        symbol: 'K',
        category: 'temperature',
        aliases: ['kelvin', 'deg k'],
        toBase: (k) => k,
        fromBase: (k) => k,
        description: 'Base SI unit of thermodynamic temperature; zero is absolute zero',
      },
      {
        id: 'rankine',
        name: 'Rankine',
        symbol: '°R',
        category: 'temperature',
        aliases: ['r', 'deg r', 'degrees rankine'],
        toBase: (r) => (r * 5) / 9,
        fromBase: (k) => (k * 9) / 5,
        description: 'Absolute thermodynamic scale using Fahrenheit-sized degree increments',
      },
    ],
    presets: [
      {
        label: 'Water Freezing Point',
        value: 0,
        unitId: 'celsius',
        targetUnitId: 'fahrenheit',
        note: 'Ice formation threshold at standard pressure',
      },
      {
        label: 'Room Temperature',
        value: 20,
        unitId: 'celsius',
        targetUnitId: 'fahrenheit',
        note: 'Comfortable standard ambient living condition',
      },
      {
        label: 'Human Body Temperature',
        value: 98.6,
        unitId: 'fahrenheit',
        targetUnitId: 'celsius',
        note: 'Normal baseline internal human core temperature',
      },
      {
        label: 'Water Boiling Point',
        value: 100,
        unitId: 'celsius',
        targetUnitId: 'fahrenheit',
        note: 'Liquid to vapor state transition at 1 atm',
      },
      {
        label: 'Absolute Zero',
        value: 0,
        unitId: 'kelvin',
        targetUnitId: 'celsius',
        note: 'Lowest theoretically possible thermal state',
      },
    ],
  },

  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    baseUnitSymbol: 's',
    description: 'Intervals spanning microsecond physics to calendar durations',
    units: [
      {
        id: 'nanosecond',
        name: 'Nanosecond',
        symbol: 'ns',
        category: 'time',
        aliases: ['nsec', 'nanoseconds'],
        toBase: (v) => v * 1e-9,
        fromBase: (v) => v / 1e-9,
      },
      {
        id: 'microsecond',
        name: 'Microsecond',
        symbol: 'µs',
        category: 'time',
        aliases: ['us', 'microseconds', 'usec'],
        toBase: (v) => v * 1e-6,
        fromBase: (v) => v / 1e-6,
      },
      {
        id: 'millisecond',
        name: 'Millisecond',
        symbol: 'ms',
        category: 'time',
        aliases: ['msec', 'milliseconds'],
        toBase: (v) => v * 0.001,
        fromBase: (v) => v * 1000,
      },
      {
        id: 'second',
        name: 'Second',
        symbol: 's',
        category: 'time',
        aliases: ['sec', 'seconds'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'Fundamental SI unit of duration',
      },
      {
        id: 'minute',
        name: 'Minute',
        symbol: 'min',
        category: 'time',
        aliases: ['mins', 'minutes'],
        toBase: (v) => v * 60,
        fromBase: (v) => v / 60,
      },
      {
        id: 'hour',
        name: 'Hour',
        symbol: 'h',
        category: 'time',
        aliases: ['hr', 'hrs', 'hours'],
        toBase: (v) => v * 3600,
        fromBase: (v) => v / 3600,
      },
      {
        id: 'day',
        name: 'Day',
        symbol: 'd',
        category: 'time',
        aliases: ['days'],
        toBase: (v) => v * 86400,
        fromBase: (v) => v / 86400,
      },
      {
        id: 'week',
        name: 'Week',
        symbol: 'wk',
        category: 'time',
        aliases: ['wks', 'weeks'],
        toBase: (v) => v * 604800,
        fromBase: (v) => v / 604800,
      },
      {
        id: 'month',
        name: 'Month (average)',
        symbol: 'mo',
        category: 'time',
        aliases: ['months'],
        toBase: (v) => v * (86400 * 30.4375),
        fromBase: (v) => v / (86400 * 30.4375),
        description: 'Standard Gregorian month average (365.25 / 12 days)',
      },
      {
        id: 'year',
        name: 'Year (calendar)',
        symbol: 'yr',
        category: 'time',
        aliases: ['years', 'yrs'],
        toBase: (v) => v * (86400 * 365.25),
        fromBase: (v) => v / (86400 * 365.25),
        description: 'Julian/Gregorian standard year (365.25 days)',
      },
    ],
    presets: [
      {
        label: '1 Standard Day',
        value: 24,
        unitId: 'hour',
        targetUnitId: 'second',
        note: '86,400 seconds in a solar day',
      },
      {
        label: 'Work Day Shift',
        value: 8,
        unitId: 'hour',
        targetUnitId: 'minute',
        note: 'Standard 480-minute working shift',
      },
      {
        label: '1 Year in Hours',
        value: 1,
        unitId: 'year',
        targetUnitId: 'hour',
        note: '8,766 standard hours',
      },
      {
        label: '1 Fortnight',
        value: 14,
        unitId: 'day',
        targetUnitId: 'hour',
        note: 'Traditional 2-week period (336 hours)',
      },
    ],
  },

  {
    id: 'storage',
    name: 'Digital Storage',
    iconName: 'HardDrive',
    baseUnitSymbol: 'B',
    description: 'Binary memory and decimal network throughput data units',
    units: [
      {
        id: 'bit',
        name: 'Bit',
        symbol: 'b',
        category: 'storage',
        aliases: ['bits'],
        toBase: (v) => v / 8,
        fromBase: (v) => v * 8,
        description: 'Elementary binary information digit (0 or 1)',
      },
      {
        id: 'byte',
        name: 'Byte',
        symbol: 'B',
        category: 'storage',
        aliases: ['bytes'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'Standard 8-bit octet unit of computer data storage',
      },
      {
        id: 'kilobit',
        name: 'Kilobit',
        symbol: 'kb',
        category: 'storage',
        aliases: ['kbit', 'kilobits'],
        toBase: (v) => (v * 1000) / 8,
        fromBase: (v) => (v * 8) / 1000,
      },
      {
        id: 'kilobyte',
        name: 'Kilobyte (decimal)',
        symbol: 'KB',
        category: 'storage',
        aliases: ['kb', 'kilobytes'],
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
        description: 'SI decimal system (1,000 Bytes)',
      },
      {
        id: 'kibibyte',
        name: 'Kibibyte (binary)',
        symbol: 'KiB',
        category: 'storage',
        aliases: ['kib'],
        toBase: (v) => v * 1024,
        fromBase: (v) => v / 1024,
        description: 'IEC binary standard (1,024 Bytes)',
      },
      {
        id: 'megabit',
        name: 'Megabit',
        symbol: 'Mb',
        category: 'storage',
        aliases: ['mbit', 'megabits', 'mbps'],
        toBase: (v) => (v * 1e6) / 8,
        fromBase: (v) => (v * 8) / 1e6,
      },
      {
        id: 'megabyte',
        name: 'Megabyte (decimal)',
        symbol: 'MB',
        category: 'storage',
        aliases: ['mb', 'megabytes'],
        toBase: (v) => v * 1e6,
        fromBase: (v) => v / 1e6,
        description: 'SI decimal (1,000,000 Bytes)',
      },
      {
        id: 'mebibyte',
        name: 'Mebibyte (binary)',
        symbol: 'MiB',
        category: 'storage',
        aliases: ['mib'],
        toBase: (v) => v * Math.pow(1024, 2),
        fromBase: (v) => v / Math.pow(1024, 2),
        description: 'IEC binary standard (1,048,576 Bytes)',
      },
      {
        id: 'gigabit',
        name: 'Gigabit',
        symbol: 'Gb',
        category: 'storage',
        aliases: ['gbit', 'gigabits', 'gbps'],
        toBase: (v) => (v * 1e9) / 8,
        fromBase: (v) => (v * 8) / 1e9,
      },
      {
        id: 'gigabyte',
        name: 'Gigabyte (decimal)',
        symbol: 'GB',
        category: 'storage',
        aliases: ['gb', 'gigabytes'],
        toBase: (v) => v * 1e9,
        fromBase: (v) => v / 1e9,
        description: 'SI decimal consumer drive standard (1,000,000,000 Bytes)',
      },
      {
        id: 'gibibyte',
        name: 'Gibibyte (binary)',
        symbol: 'GiB',
        category: 'storage',
        aliases: ['gib'],
        toBase: (v) => v * Math.pow(1024, 3),
        fromBase: (v) => v / Math.pow(1024, 3),
        description: 'IEC binary RAM and OS standard (1,073,741,824 Bytes)',
      },
      {
        id: 'terabyte',
        name: 'Terabyte (decimal)',
        symbol: 'TB',
        category: 'storage',
        aliases: ['tb', 'terabytes'],
        toBase: (v) => v * 1e12,
        fromBase: (v) => v / 1e12,
      },
      {
        id: 'tebibyte',
        name: 'Tebibyte (binary)',
        symbol: 'TiB',
        category: 'storage',
        aliases: ['tib'],
        toBase: (v) => v * Math.pow(1024, 4),
        fromBase: (v) => v / Math.pow(1024, 4),
      },
      {
        id: 'petabyte',
        name: 'Petabyte (decimal)',
        symbol: 'PB',
        category: 'storage',
        aliases: ['pb', 'petabytes'],
        toBase: (v) => v * 1e15,
        fromBase: (v) => v / 1e15,
      },
    ],
    presets: [
      {
        label: '1 GB to MB (Decimal)',
        value: 1,
        unitId: 'gigabyte',
        targetUnitId: 'megabyte',
        note: '1,000 MB decimal standard',
      },
      {
        label: '1 GiB to MiB (Binary)',
        value: 1,
        unitId: 'gibibyte',
        targetUnitId: 'mebibyte',
        note: '1,024 MiB OS standard',
      },
      {
        label: '1 TB Hard Drive in GiB',
        value: 1,
        unitId: 'terabyte',
        targetUnitId: 'gibibyte',
        note: 'Why a 1TB drive reads ~931 GiB in Windows',
      },
      {
        label: 'Gigabit Internet in MB/s',
        value: 1,
        unitId: 'gigabit',
        targetUnitId: 'megabyte',
        note: 'Theoretical max 125 MB/s transfer speed',
      },
    ],
  },

  {
    id: 'length',
    name: 'Length',
    iconName: 'Ruler',
    baseUnitSymbol: 'm',
    description: 'Distance metrics from sub-micron precision to geographic spans',
    units: [
      {
        id: 'nanometer',
        name: 'Nanometer',
        symbol: 'nm',
        category: 'length',
        aliases: ['nanometers'],
        toBase: (v) => v * 1e-9,
        fromBase: (v) => v / 1e-9,
      },
      {
        id: 'micrometer',
        name: 'Micrometer / Micron',
        symbol: 'µm',
        category: 'length',
        aliases: ['um', 'micron', 'microns'],
        toBase: (v) => v * 1e-6,
        fromBase: (v) => v / 1e-6,
      },
      {
        id: 'millimeter',
        name: 'Millimeter',
        symbol: 'mm',
        category: 'length',
        aliases: ['millimeters'],
        toBase: (v) => v * 0.001,
        fromBase: (v) => v * 1000,
      },
      {
        id: 'centimeter',
        name: 'Centimeter',
        symbol: 'cm',
        category: 'length',
        aliases: ['centimeters'],
        toBase: (v) => v * 0.01,
        fromBase: (v) => v * 100,
      },
      {
        id: 'meter',
        name: 'Meter',
        symbol: 'm',
        category: 'length',
        aliases: ['meters', 'metre', 'metres'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'SI fundamental base unit of spatial length',
      },
      {
        id: 'kilometer',
        name: 'Kilometer',
        symbol: 'km',
        category: 'length',
        aliases: ['kilometre', 'kilometres', 'kilometers'],
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      {
        id: 'inch',
        name: 'Inch',
        symbol: 'in',
        category: 'length',
        aliases: ['"', 'inches'],
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
        description: 'Exactly defined as 25.4 mm',
      },
      {
        id: 'foot',
        name: 'Foot',
        symbol: 'ft',
        category: 'length',
        aliases: ["'", 'feet'],
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
        description: 'Exactly 12 inches (0.3048 m)',
      },
      {
        id: 'yard',
        name: 'Yard',
        symbol: 'yd',
        category: 'length',
        aliases: ['yards'],
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
        description: '3 feet (0.9144 m)',
      },
      {
        id: 'mile',
        name: 'Statute Mile',
        symbol: 'mi',
        category: 'length',
        aliases: ['miles'],
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
        description: '5,280 feet (1,609.344 m)',
      },
      {
        id: 'nautical_mile',
        name: 'Nautical Mile',
        symbol: 'nmi',
        category: 'length',
        aliases: ['nm', 'nautical miles'],
        toBase: (v) => v * 1852,
        fromBase: (v) => v / 1852,
        description: 'Internationally defined as 1,852 m for marine & aviation navigation',
      },
    ],
    presets: [
      {
        label: 'Marathon Distance',
        value: 42.195,
        unitId: 'kilometer',
        targetUnitId: 'mile',
        note: 'Official international marathon length (~26.22 miles)',
      },
      {
        label: 'Mount Everest Elevation',
        value: 8848.86,
        unitId: 'meter',
        targetUnitId: 'foot',
        note: 'Highest point above sea level (~29,031.7 ft)',
      },
      {
        label: '100 Yards Football Field',
        value: 100,
        unitId: 'yard',
        targetUnitId: 'meter',
        note: 'Standard field gridiron length (91.44 m)',
      },
      {
        label: '1 Foot in Centimeters',
        value: 1,
        unitId: 'foot',
        targetUnitId: 'centimeter',
        note: 'Standard architectural conversion (30.48 cm)',
      },
    ],
  },

  {
    id: 'mass',
    name: 'Mass & Weight',
    iconName: 'Scale',
    baseUnitSymbol: 'kg',
    description: 'Weight and mass units from laboratory milligrams to metric tons',
    units: [
      {
        id: 'microgram',
        name: 'Microgram',
        symbol: 'µg',
        category: 'mass',
        aliases: ['ug', 'micrograms'],
        toBase: (v) => v * 1e-9,
        fromBase: (v) => v / 1e-9,
      },
      {
        id: 'milligram',
        name: 'Milligram',
        symbol: 'mg',
        category: 'mass',
        aliases: ['milligrams'],
        toBase: (v) => v * 1e-6,
        fromBase: (v) => v / 1e-6,
      },
      {
        id: 'gram',
        name: 'Gram',
        symbol: 'g',
        category: 'mass',
        aliases: ['grams'],
        toBase: (v) => v * 0.001,
        fromBase: (v) => v * 1000,
      },
      {
        id: 'kilogram',
        name: 'Kilogram',
        symbol: 'kg',
        category: 'mass',
        aliases: ['kilograms', 'kilos'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'SI fundamental base unit of mass',
      },
      {
        id: 'metric_ton',
        name: 'Metric Tonne',
        symbol: 't',
        category: 'mass',
        aliases: ['ton', 'tonne', 'tons', 'tonnes'],
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      {
        id: 'ounce',
        name: 'Ounce (avoirdupois)',
        symbol: 'oz',
        category: 'mass',
        aliases: ['ounces'],
        toBase: (v) => v * 0.028349523125,
        fromBase: (v) => v / 0.028349523125,
      },
      {
        id: 'pound',
        name: 'Pound (avoirdupois)',
        symbol: 'lb',
        category: 'mass',
        aliases: ['lbs', 'pounds'],
        toBase: (v) => v * 0.45359237,
        fromBase: (v) => v / 0.45359237,
        description: 'Standard international avoirdupois pound',
      },
      {
        id: 'stone',
        name: 'Stone (UK)',
        symbol: 'st',
        category: 'mass',
        aliases: ['stones'],
        toBase: (v) => v * 6.35029318,
        fromBase: (v) => v / 6.35029318,
        description: '14 standard pounds',
      },
      {
        id: 'carat',
        name: 'Carat (metric)',
        symbol: 'ct',
        category: 'mass',
        aliases: ['carats'],
        toBase: (v) => v * 0.0002,
        fromBase: (v) => v / 0.0002,
        description: 'Standard gemstone measurement (200 mg)',
      },
    ],
    presets: [
      {
        label: '1 Kilogram in Pounds',
        value: 1,
        unitId: 'kilogram',
        targetUnitId: 'pound',
        note: 'Standard conversion: ~2.20462 lbs',
      },
      {
        label: '150 Pounds in Kilograms',
        value: 150,
        unitId: 'pound',
        targetUnitId: 'kilogram',
        note: 'Common human body weight conversion (~68.04 kg)',
      },
      {
        label: '1 Ounce in Grams',
        value: 1,
        unitId: 'ounce',
        targetUnitId: 'gram',
        note: 'Standard culinary/postal measurement (28.35 g)',
      },
      {
        label: '1 Carat Diamond in Milligrams',
        value: 1,
        unitId: 'carat',
        targetUnitId: 'milligram',
        note: 'Exactly 200 milligrams',
      },
    ],
  },

  {
    id: 'volume',
    name: 'Volume & Capacity',
    iconName: 'FlaskConical',
    baseUnitSymbol: 'L',
    description: 'Liquid and spatial capacities across culinary and industrial measures',
    units: [
      {
        id: 'milliliter',
        name: 'Milliliter',
        symbol: 'mL',
        category: 'volume',
        aliases: ['ml', 'milliliters'],
        toBase: (v) => v * 0.001,
        fromBase: (v) => v * 1000,
      },
      {
        id: 'liter',
        name: 'Liter',
        symbol: 'L',
        category: 'volume',
        aliases: ['liters', 'litre', 'litres', 'l'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'SI non-metric unit equal to 1 cubic decimeter',
      },
      {
        id: 'cubic_meter',
        name: 'Cubic Meter',
        symbol: 'm³',
        category: 'volume',
        aliases: ['cubic meters', 'm3'],
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      {
        id: 'us_gal',
        name: 'US Gallon (liquid)',
        symbol: 'US gal',
        category: 'volume',
        aliases: ['gallon', 'gallons', 'gal'],
        toBase: (v) => v * 3.785411784,
        fromBase: (v) => v / 3.785411784,
      },
      {
        id: 'us_qt',
        name: 'US Quart',
        symbol: 'US qt',
        category: 'volume',
        aliases: ['quart', 'quarts', 'qt'],
        toBase: (v) => v * 0.946352946,
        fromBase: (v) => v / 0.946352946,
      },
      {
        id: 'us_pt',
        name: 'US Pint',
        symbol: 'US pt',
        category: 'volume',
        aliases: ['pint', 'pints', 'pt'],
        toBase: (v) => v * 0.473176473,
        fromBase: (v) => v / 0.473176473,
      },
      {
        id: 'us_cup',
        name: 'US Cup',
        symbol: 'US cup',
        category: 'volume',
        aliases: ['cup', 'cups'],
        toBase: (v) => v * 0.2365882365,
        fromBase: (v) => v / 0.2365882365,
      },
      {
        id: 'us_floz',
        name: 'US Fluid Ounce',
        symbol: 'US fl oz',
        category: 'volume',
        aliases: ['fl oz', 'floz', 'fluid ounce'],
        toBase: (v) => v * 0.0295735295625,
        fromBase: (v) => v / 0.0295735295625,
      },
      {
        id: 'us_tbsp',
        name: 'US Tablespoon',
        symbol: 'tbsp',
        category: 'volume',
        aliases: ['tablespoon', 'tablespoons'],
        toBase: (v) => v * 0.01478676478125,
        fromBase: (v) => v / 0.01478676478125,
      },
      {
        id: 'us_tsp',
        name: 'US Teaspoon',
        symbol: 'tsp',
        category: 'volume',
        aliases: ['teaspoon', 'teaspoons'],
        toBase: (v) => v * 0.00492892159375,
        fromBase: (v) => v / 0.00492892159375,
      },
      {
        id: 'cubic_foot',
        name: 'Cubic Foot',
        symbol: 'ft³',
        category: 'volume',
        aliases: ['cu ft', 'ft3'],
        toBase: (v) => v * 28.316846592,
        fromBase: (v) => v / 28.316846592,
      },
    ],
    presets: [
      {
        label: '1 US Gallon to Liters',
        value: 1,
        unitId: 'us_gal',
        targetUnitId: 'liter',
        note: 'Standard fuel/liquid conversion (~3.785 L)',
      },
      {
        label: '1 US Cup in Milliliters',
        value: 1,
        unitId: 'us_cup',
        targetUnitId: 'milliliter',
        note: 'Culinary baking standard (~236.6 mL)',
      },
      {
        label: '1 Liter in Fluid Ounces',
        value: 1,
        unitId: 'liter',
        targetUnitId: 'us_floz',
        note: 'Common beverage size conversion (~33.81 fl oz)',
      },
    ],
  },

  {
    id: 'area',
    name: 'Area',
    iconName: 'Square',
    baseUnitSymbol: 'm²',
    description: 'Surface measurements from floorplans to real estate acreage',
    units: [
      {
        id: 'sq_meter',
        name: 'Square Meter',
        symbol: 'm²',
        category: 'area',
        aliases: ['sqm', 'square meters', 'm2'],
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: 'sq_km',
        name: 'Square Kilometer',
        symbol: 'km²',
        category: 'area',
        aliases: ['sqkm', 'square kilometers', 'km2'],
        toBase: (v) => v * 1e6,
        fromBase: (v) => v / 1e6,
      },
      {
        id: 'hectare',
        name: 'Hectare',
        symbol: 'ha',
        category: 'area',
        aliases: ['hectares'],
        toBase: (v) => v * 10000,
        fromBase: (v) => v / 10000,
        description: '10,000 square meters',
      },
      {
        id: 'acre',
        name: 'Acre',
        symbol: 'ac',
        category: 'area',
        aliases: ['acres'],
        toBase: (v) => v * 4046.8564224,
        fromBase: (v) => v / 4046.8564224,
        description: '43,560 square feet (approx 4,047 m²)',
      },
      {
        id: 'sq_foot',
        name: 'Square Foot',
        symbol: 'ft²',
        category: 'area',
        aliases: ['sqft', 'square feet', 'ft2'],
        toBase: (v) => v * 0.09290304,
        fromBase: (v) => v / 0.09290304,
      },
      {
        id: 'sq_yard',
        name: 'Square Yard',
        symbol: 'yd²',
        category: 'area',
        aliases: ['sqyd', 'square yards', 'yd2'],
        toBase: (v) => v * 0.83612736,
        fromBase: (v) => v / 0.83612736,
      },
      {
        id: 'sq_mile',
        name: 'Square Mile',
        symbol: 'mi²',
        category: 'area',
        aliases: ['sqmi', 'square miles', 'mi2'],
        toBase: (v) => v * 2589988.110336,
        fromBase: (v) => v / 2589988.110336,
        description: '640 acres',
      },
    ],
    presets: [
      {
        label: '1 Acre in Square Feet',
        value: 1,
        unitId: 'acre',
        targetUnitId: 'sq_foot',
        note: 'Exactly 43,560 sq ft',
      },
      {
        label: '1000 Sq Ft Apartment in Sq Meters',
        value: 1000,
        unitId: 'sq_foot',
        targetUnitId: 'sq_meter',
        note: 'Real estate sizing (~92.90 m²)',
      },
      {
        label: '1 Hectare in Acres',
        value: 1,
        unitId: 'hectare',
        targetUnitId: 'acre',
        note: 'Agricultural conversion (~2.471 acres)',
      },
    ],
  },

  {
    id: 'speed',
    name: 'Speed & Velocity',
    iconName: 'Gauge',
    baseUnitSymbol: 'm/s',
    description: 'Kinetic velocities from transport speedometers to aerodynamic Mach',
    units: [
      {
        id: 'mps',
        name: 'Meters per second',
        symbol: 'm/s',
        category: 'speed',
        aliases: ['m/sec', 'mps'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'SI base unit of velocity',
      },
      {
        id: 'kph',
        name: 'Kilometers per hour',
        symbol: 'km/h',
        category: 'speed',
        aliases: ['kph', 'kmh', 'km/hr'],
        toBase: (v) => v / 3.6,
        fromBase: (v) => v * 3.6,
      },
      {
        id: 'mph',
        name: 'Miles per hour',
        symbol: 'mph',
        category: 'speed',
        aliases: ['miles per hour', 'mi/h'],
        toBase: (v) => v * 0.44704,
        fromBase: (v) => v / 0.44704,
      },
      {
        id: 'knot',
        name: 'Knot',
        symbol: 'kn',
        category: 'speed',
        aliases: ['knots', 'kt'],
        toBase: (v) => v * (1852 / 3600),
        fromBase: (v) => v / (1852 / 3600),
        description: '1 nautical mile per hour (marine/aviation)',
      },
      {
        id: 'fps',
        name: 'Feet per second',
        symbol: 'ft/s',
        category: 'speed',
        aliases: ['fps', 'ft/sec'],
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
      {
        id: 'mach',
        name: 'Mach (sea level, 20°C)',
        symbol: 'Mach',
        category: 'speed',
        aliases: ['speed of sound'],
        toBase: (v) => v * 343,
        fromBase: (v) => v / 343,
        description: 'Speed of sound in dry air at 20°C (~343 m/s)',
      },
    ],
    presets: [
      {
        label: 'Highway Speed (65 mph to km/h)',
        value: 65,
        unitId: 'mph',
        targetUnitId: 'kph',
        note: 'Standard US highway speed limit (~104.6 km/h)',
      },
      {
        label: 'Speed of Sound (Mach 1 in mph)',
        value: 1,
        unitId: 'mach',
        targetUnitId: 'mph',
        note: 'Approximately 767.27 mph at sea level',
      },
      {
        label: 'Cruise Flight Speed (500 knots in km/h)',
        value: 500,
        unitId: 'knot',
        targetUnitId: 'kph',
        note: 'Typical commercial jet airspeed (~926 km/h)',
      },
    ],
  },

  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Activity',
    baseUnitSymbol: 'Pa',
    description: 'Atmospheric, pneumatic, and barometric load forces',
    units: [
      {
        id: 'pascal',
        name: 'Pascal',
        symbol: 'Pa',
        category: 'pressure',
        aliases: ['pascals'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'SI derived unit (1 N/m²)',
      },
      {
        id: 'kilopascal',
        name: 'Kilopascal',
        symbol: 'kPa',
        category: 'pressure',
        aliases: ['kpa'],
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      {
        id: 'bar',
        name: 'Bar',
        symbol: 'bar',
        category: 'pressure',
        aliases: ['bars'],
        toBase: (v) => v * 100000,
        fromBase: (v) => v / 100000,
      },
      {
        id: 'millibar',
        name: 'Millibar',
        symbol: 'mbar',
        category: 'pressure',
        aliases: ['hpa', 'hectopascal'],
        toBase: (v) => v * 100,
        fromBase: (v) => v / 100,
        description: 'Meteorological unit (equivalent to 1 hPa)',
      },
      {
        id: 'psi',
        name: 'Pounds per sq inch',
        symbol: 'psi',
        category: 'pressure',
        aliases: ['psi', 'lbf/in2'],
        toBase: (v) => v * 6894.757293168,
        fromBase: (v) => v / 6894.757293168,
      },
      {
        id: 'atmosphere',
        name: 'Standard Atmosphere',
        symbol: 'atm',
        category: 'pressure',
        aliases: ['atm', 'atmospheres'],
        toBase: (v) => v * 101325,
        fromBase: (v) => v / 101325,
        description: 'Mean sea level atmospheric pressure (101,325 Pa)',
      },
      {
        id: 'torr',
        name: 'Torr / mmHg',
        symbol: 'Torr',
        category: 'pressure',
        aliases: ['torr', 'mmhg', 'mm hg'],
        toBase: (v) => v * (101325 / 760),
        fromBase: (v) => v / (101325 / 760),
      },
    ],
    presets: [
      {
        label: '1 Standard Atmosphere in PSI',
        value: 1,
        unitId: 'atmosphere',
        targetUnitId: 'psi',
        note: 'Baseline sea level air pressure (~14.696 psi)',
      },
      {
        label: 'Standard Car Tire Pressure (32 PSI to Bar)',
        value: 32,
        unitId: 'psi',
        targetUnitId: 'bar',
        note: 'Common automotive tire inflation (~2.206 bar)',
      },
      {
        label: 'Blood Pressure 120 mmHg in kPa',
        value: 120,
        unitId: 'torr',
        targetUnitId: 'kilopascal',
        note: 'Normal systolic blood pressure (~16.0 kPa)',
      },
    ],
  },

  {
    id: 'energy',
    name: 'Energy & Work',
    iconName: 'Zap',
    baseUnitSymbol: 'J',
    description: 'Thermodynamics, electrical consumption, and nutritional energy',
    units: [
      {
        id: 'joule',
        name: 'Joule',
        symbol: 'J',
        category: 'energy',
        aliases: ['joules'],
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'SI derived unit of work/energy (1 N⋅m = 1 W⋅s)',
      },
      {
        id: 'kilojoule',
        name: 'Kilojoule',
        symbol: 'kJ',
        category: 'energy',
        aliases: ['kilojoules'],
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      {
        id: 'calorie',
        name: 'Calorie (small/thermochemical)',
        symbol: 'cal',
        category: 'energy',
        aliases: ['cal', 'calories'],
        toBase: (v) => v * 4.184,
        fromBase: (v) => v / 4.184,
      },
      {
        id: 'kilocalorie',
        name: 'Kilocalorie / Food Calorie',
        symbol: 'kcal',
        category: 'energy',
        aliases: ['kcal', 'Cal', 'food calorie', 'food calories'],
        toBase: (v) => v * 4184,
        fromBase: (v) => v / 4184,
        description: 'Dietary calorie listed on nutritional labels (1,000 small cal)',
      },
      {
        id: 'watt_hour',
        name: 'Watt-hour',
        symbol: 'Wh',
        category: 'energy',
        aliases: ['wh', 'watt hour'],
        toBase: (v) => v * 3600,
        fromBase: (v) => v / 3600,
      },
      {
        id: 'kilowatt_hour',
        name: 'Kilowatt-hour',
        symbol: 'kWh',
        category: 'energy',
        aliases: ['kwh', 'kilowatt hour'],
        toBase: (v) => v * 3.6e6,
        fromBase: (v) => v / 3.6e6,
        description: 'Standard utility billing measurement (3.6 MJ)',
      },
      {
        id: 'btu',
        name: 'British Thermal Unit',
        symbol: 'BTU',
        category: 'energy',
        aliases: ['btu'],
        toBase: (v) => v * 1055.05585,
        fromBase: (v) => v / 1055.05585,
      },
      {
        id: 'electronvolt',
        name: 'Electronvolt',
        symbol: 'eV',
        category: 'energy',
        aliases: ['ev', 'electron volt'],
        toBase: (v) => v * 1.602176634e-19,
        fromBase: (v) => v / 1.602176634e-19,
      },
    ],
    presets: [
      {
        label: 'Daily 2,000 Food Calories in kJ',
        value: 2000,
        unitId: 'kilocalorie',
        targetUnitId: 'kilojoule',
        note: 'Average adult caloric intake (~8,368 kJ)',
      },
      {
        label: '1 kWh in Megajoules',
        value: 1,
        unitId: 'kilowatt_hour',
        targetUnitId: 'kilojoule',
        note: 'Exact electrical energy equivalent: 3,600 kJ',
      },
      {
        label: '12,000 BTU AC in kW equivalent',
        value: 12000,
        unitId: 'btu',
        targetUnitId: 'kilowatt_hour',
        note: '1 "ton" of residential cooling (~3.517 kWh of thermal capacity)',
      },
    ],
  },

  {
    id: 'angle',
    name: 'Angle',
    iconName: 'Compass',
    baseUnitSymbol: '°',
    description: 'Rotational planar geometry and trigonometric measures',
    units: [
      {
        id: 'degree',
        name: 'Degree',
        symbol: '°',
        category: 'angle',
        aliases: ['deg', 'degrees'],
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: 'radian',
        name: 'Radian',
        symbol: 'rad',
        category: 'angle',
        aliases: ['rad', 'radians'],
        toBase: (v) => (v * 180) / Math.PI,
        fromBase: (v) => (v * Math.PI) / 180,
        description: 'SI derived angle unit (2π rad = 360°)',
      },
      {
        id: 'gradian',
        name: 'Gradian',
        symbol: 'grad',
        category: 'angle',
        aliases: ['gon', 'gradians'],
        toBase: (v) => (v * 360) / 400,
        fromBase: (v) => (v * 400) / 360,
      },
      {
        id: 'arcminute',
        name: 'Arcminute',
        symbol: 'arcmin',
        category: 'angle',
        aliases: ['minute of arc', 'moa'],
        toBase: (v) => v / 60,
        fromBase: (v) => v * 60,
      },
      {
        id: 'arcsecond',
        name: 'Arcsecond',
        symbol: 'arcsec',
        category: 'angle',
        aliases: ['second of arc'],
        toBase: (v) => v / 3600,
        fromBase: (v) => v * 3600,
      },
    ],
    presets: [
      {
        label: 'Right Angle (90° in Radians)',
        value: 90,
        unitId: 'degree',
        targetUnitId: 'radian',
        note: 'π/2 radians (~1.5708 rad)',
      },
      {
        label: '1 Radian in Degrees',
        value: 1,
        unitId: 'radian',
        targetUnitId: 'degree',
        note: 'Standard angular constant (~57.2958°)',
      },
    ],
  },
];

// Lookup maps for fast indexing
export const CATEGORY_MAP = new Map<UnitCategoryId, UnitCategory>(
  UNIT_CATEGORIES.map((cat) => [cat.id, cat])
);

export const ALL_UNITS: UnitDefinition[] = UNIT_CATEGORIES.flatMap((c) => c.units);

export const UNIT_MAP = new Map<string, UnitDefinition>(
  ALL_UNITS.map((u) => [u.id, u])
);

/**
 * High-precision conversion between two units in the same category
 */
export function convertValue(
  value: number,
  fromUnitId: string,
  toUnitId: string
): number {
  if (isNaN(value)) return NaN;
  if (fromUnitId === toUnitId) return value;

  const fromUnit = UNIT_MAP.get(fromUnitId);
  const toUnit = UNIT_MAP.get(toUnitId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid unit conversion: ${fromUnitId} -> ${toUnitId}`);
  }

  if (fromUnit.category !== toUnit.category) {
    throw new Error(
      `Cannot convert between incompatible categories: ${fromUnit.category} and ${toUnit.category}`
    );
  }

  // Convert to intermediate base, then to target
  const baseValue = fromUnit.toBase(value);
  const finalValue = toUnit.fromBase(baseValue);
  return finalValue;
}

/**
 * Format a numeric value nicely according to precision settings
 */
export function formatUnitValue(
  value: number,
  precision: number = 4,
  useScientific: boolean = false
): string {
  if (isNaN(value)) return '';
  if (!isFinite(value)) return '∞';
  if (value === 0) return '0';

  const abs = Math.abs(value);

  // Auto-switch to scientific if extremely large or tiny and not explicitly disabled
  if (useScientific || (abs > 0 && (abs >= 1e9 || abs < 1e-5))) {
    return value.toExponential(Math.min(precision, 6));
  }

  // Avoid unnecessary trailing zeros for whole numbers or clean decimals
  const factor = Math.pow(10, precision);
  const rounded = Math.round(value * factor) / factor;

  // Format with thousand separators while preserving decimal precision
  const parts = rounded.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Generate human-readable mathematical formula explanation for conversion
 */
export function getFormulaExplanation(fromUnitId: string, toUnitId: string): string {
  const from = UNIT_MAP.get(fromUnitId);
  const to = UNIT_MAP.get(toUnitId);
  if (!from || !to) return '';
  if (from.id === to.id) return `1 ${from.symbol} = 1 ${to.symbol}`;

  // Special cases for Temperature
  if (from.category === 'temperature') {
    if (from.id === 'celsius' && to.id === 'fahrenheit') {
      return '(°C × 9/5) + 32 = °F';
    }
    if (from.id === 'fahrenheit' && to.id === 'celsius') {
      return '(°F − 32) × 5/9 = °C';
    }
    if (from.id === 'celsius' && to.id === 'kelvin') {
      return '°C + 273.15 = K';
    }
    if (from.id === 'kelvin' && to.id === 'celsius') {
      return 'K − 273.15 = °C';
    }
    if (from.id === 'fahrenheit' && to.id === 'kelvin') {
      return '((°F − 32) × 5/9) + 273.15 = K';
    }
    if (from.id === 'kelvin' && to.id === 'fahrenheit') {
      return '((K − 273.15) × 9/5) + 32 = °F';
    }
    if (from.id === 'rankine' && to.id === 'kelvin') {
      return '°R × 5/9 = K';
    }
    if (from.id === 'kelvin' && to.id === 'rankine') {
      return 'K × 9/5 = °R';
    }
  }

  // Linear units: compute ratio 1 [from] = X [to]
  const oneFromInTo = convertValue(1, fromUnitId, toUnitId);
  const formatted = formatUnitValue(oneFromInTo, 6);
  return `1 ${from.symbol} = ${formatted} ${to.symbol} (multiply by ${formatted})`;
}

/**
 * Natural language query parsing (e.g. "100 km to miles", "37 c in f", "500 gb to tb")
 */
export interface ParsedQuery {
  value: number;
  fromUnit: UnitDefinition;
  toUnit?: UnitDefinition;
  category: UnitCategory;
}

export function parseNaturalQuery(query: string): ParsedQuery | null {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;

  // Regex pattern matching: "<number> <from> [to|in|into] <to>"
  const match = trimmed.match(
    /^([+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*([a-z°µ"'\s]+?)(?:\s+(?:to|in|into|=)\s+([a-z°µ"'\s]+))?$/i
  );

  if (!match) return null;

  const numVal = parseFloat(match[1]);
  if (isNaN(numVal)) return null;

  const rawFrom = match[2]?.trim().toLowerCase();
  const rawTo = match[3]?.trim().toLowerCase();

  const findUnit = (term: string): UnitDefinition | undefined => {
    return ALL_UNITS.find(
      (u) =>
        u.id.toLowerCase() === term ||
        u.symbol.toLowerCase() === term ||
        u.name.toLowerCase() === term ||
        u.aliases.some((a) => a.toLowerCase() === term)
    );
  };

  const fromUnit = findUnit(rawFrom);
  if (!fromUnit) return null;

  const category = CATEGORY_MAP.get(fromUnit.category);
  if (!category) return null;

  let toUnit: UnitDefinition | undefined = undefined;
  if (rawTo) {
    const matchedTo = findUnit(rawTo);
    if (matchedTo && matchedTo.category === fromUnit.category) {
      toUnit = matchedTo;
    }
  }

  return {
    value: numVal,
    fromUnit,
    toUnit,
    category,
  };
}
