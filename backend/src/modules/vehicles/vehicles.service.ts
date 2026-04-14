import { Injectable } from '@nestjs/common';

// Données de référence des marques et modèles présents en Mauritanie
// Année de début par marque (les années sont générées jusqu'à l'année en cours)
const BRAND_YEAR_START: Record<string, number> = {
  // Japonaises — très présentes dès les années 90
  Toyota: 1990, Nissan: 1990, Mitsubishi: 1990, Honda: 1995,
  Isuzu: 1995, Mazda: 1995, Suzuki: 1995, Hino: 1995,
  // Coréennes
  Hyundai: 1995, Kia: 1995, SsangYong: 2000,
  // Françaises
  Peugeot: 1995, Renault: 1995, Dacia: 2005, Citroën: 1995,
  // Allemandes
  'Mercedes-Benz': 1990, BMW: 1990, Volkswagen: 1990,
  // Britanniques
  'Land Rover': 1990,
  // Américaines
  Ford: 1990, Jeep: 1990, Chevrolet: 1990, Dodge: 1990,
  // Italiennes
  Fiat: 1995, Iveco: 1995,
  // Chinoises — arrivées progressivement depuis 2010
  Chery: 2010, JAC: 2010, 'Great Wall': 2010,
  Geely: 2012, Haval: 2012, Changan: 2012, BYD: 2015,
  // Indiennes
  Tata: 2000,
  // Poids lourds européens
  Volvo: 1990, MAN: 1990,
};

const VEHICLE_DATA: Record<string, string[]> = {
  // ── Japonaises ───────────────────────────────────────────────
  Toyota: [
    'Corolla', 'Camry', 'Yaris', 'Auris', 'Avensis',
    'HiLux', 'Land Cruiser', 'Land Cruiser Prado', 'Fortuner',
    'RAV4', 'HiAce', 'Innova', 'Rush', 'Sequoia', 'Tundra',
  ],
  Nissan: [
    'Patrol', 'Navara', 'Frontier', 'Pathfinder', 'Terrano',
    'X-Trail', 'Qashqai', 'Murano', 'Juke',
    'Sunny', 'Sentra', 'Micra', 'Tiida',
  ],
  Mitsubishi: [
    'L200', 'Pajero', 'Montero', 'L300',
    'Outlander', 'ASX', 'Eclipse Cross',
    'Galant', 'Lancer', 'Colt',
  ],
  Honda: [
    'Civic', 'Accord', 'City', 'Jazz',
    'CR-V', 'HR-V', 'BR-V', 'Pilot',
  ],
  Isuzu: ['D-Max', 'MU-X', 'NPR', 'NKR', 'NQR', 'FTR'],
  Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-5', 'CX-9', 'BT-50'],
  Suzuki: ['Jimny', 'Grand Vitara', 'Vitara', 'Swift', 'Baleno', 'Alto', 'Ertiga', 'SX4'],
  Hino: ['Dutro (300)', '500 Series', '700 Series'],

  // ── Coréennes ────────────────────────────────────────────────
  Hyundai: [
    'Accent', 'Elantra', 'Sonata',
    'i10', 'Grand i10', 'i20', 'i30',
    'Tucson', 'Santa Fe', 'Creta', 'Kona', 'Venue',
    'H-1 / H100', 'HD65', 'HD78',
  ],
  Kia: [
    'Picanto', 'Rio', 'Cerato', 'K5',
    'Sportage', 'Sorento', 'Seltos', 'Stonic', 'Telluride',
    'Carnival', 'Bongo',
  ],
  SsangYong: ['Rexton', 'Korando', 'Actyon', 'Tivoli', 'Musso'],

  // ── Françaises ───────────────────────────────────────────────
  Peugeot: [
    '106', '206', '207', '208', '301', '308', '408', '508',
    '2008', '3008', '5008',
    'Partner', 'Expert', 'Boxer', 'Rifter',
  ],
  Renault: [
    'Clio', 'Megane', 'Laguna', 'Scenic', 'Talisman',
    'Duster', 'Captur', 'Kadjar', 'Koleos',
    'Logan', 'Sandero', 'Kangoo', 'Trafic', 'Master',
  ],
  Dacia: ['Duster', 'Logan', 'Sandero', 'Lodgy', 'Dokker', 'Spring'],
  Citroën: [
    'C2', 'C3', 'C4', 'C-Elysée', 'C5 Aircross',
    'Berlingo', 'Jumpy', 'Jumper', 'SpaceTourer',
  ],

  // ── Allemandes ───────────────────────────────────────────────
  'Mercedes-Benz': [
    'A-Class', 'C-Class', 'E-Class', 'S-Class',
    'GLA', 'GLC', 'GLE', 'GLS', 'G-Class',
    'Sprinter', 'Vito', 'Viano', 'Actros', 'Axor',
  ],
  BMW: ['Série 1', 'Série 3', 'Série 5', 'Série 7', 'X1', 'X3', 'X5', 'X6', 'X7'],
  Volkswagen: [
    'Polo', 'Golf', 'Passat', 'Jetta',
    'T-Cross', 'T-Roc', 'Tiguan', 'Touareg',
    'Caddy', 'Transporter', 'Crafter',
  ],

  // ── Britanniques ─────────────────────────────────────────────
  'Land Rover': [
    'Freelander', 'Discovery', 'Discovery Sport',
    'Defender', 'Range Rover', 'Range Rover Sport', 'Evoque',
  ],

  // ── Américaines ──────────────────────────────────────────────
  Ford: [
    'Focus', 'Fiesta', 'Fusion',
    'Ranger', 'F-150', 'F-250',
    'Explorer', 'Escape', 'Edge', 'Everest',
    'Transit', 'Transit Connect', 'Mustang',
  ],
  Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
  Chevrolet: ['Cruze', 'Captiva', 'Trailblazer', 'Blazer', 'Colorado', 'Silverado', 'Tahoe', 'Suburban'],
  Dodge: ['Ram 1500', 'Ram 2500', 'Ram 3500', 'Durango', 'Charger', 'Challenger'],

  // ── Italiennes ───────────────────────────────────────────────
  Fiat: ['Punto', '500', 'Tipo', 'Doblo', 'Fiorino', 'Ducato', 'Talento'],
  Iveco: ['Daily', 'Eurocargo', 'Stralis', 'Trakker', 'S-Way'],

  // ── Chinoises ────────────────────────────────────────────────
  Chery: ['Tiggo 4', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6'],
  JAC: ['S3', 'S7', 'T6', 'T8', 'Refine A60', 'HFC1061'],
  'Great Wall': ['Wingle 5', 'Wingle 7', 'Hover H6', 'Poer', 'Tank 300'],
  Geely: ['Emgrand EC7', 'Atlas', 'Coolray', 'Tugella'],
  Haval: ['H6', 'H9', 'Jolion', 'Dargo', 'Big Dog'],
  Changan: ['CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'Hunter', 'Alsvin'],
  BYD: ['F3', 'S5', 'Atto 3', 'Han', 'Seagull'],

  // ── Indiennes ────────────────────────────────────────────────
  Tata: ['Xenon', 'Safari', '407', '709', 'LPT 1615'],

  // ── Poids lourds européens ───────────────────────────────────
  Volvo: ['FH', 'FM', 'FMX', 'FE', 'FL'],
  MAN: ['TGX', 'TGS', 'TGM', 'TGL', 'TGE'],
};

const FUEL_TYPES = ['Essence', 'Diesel', 'GPL', 'Hybride', 'Électrique'];
const TRANSMISSIONS = ['Manuelle', 'Automatique', 'CVT', 'Semi-automatique'];

@Injectable()
export class VehiclesService {
  getBrands(): string[] {
    return Object.keys(VEHICLE_DATA).sort();
  }

  getModelsByBrand(brand: string): string[] {
    const key = Object.keys(VEHICLE_DATA).find(
      (k) => k.toLowerCase() === brand.toLowerCase(),
    );
    return key ? VEHICLE_DATA[key] : [];
  }

  getYears(brand?: string): number[] {
    const currentYear = new Date().getFullYear();
    const key = brand
      ? Object.keys(BRAND_YEAR_START).find((k) => k.toLowerCase() === brand.toLowerCase())
      : null;
    const startYear = key ? BRAND_YEAR_START[key] : 1990;
    const years: number[] = [];
    for (let y = currentYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  }

  getFuelTypes(): string[] {
    return FUEL_TYPES;
  }

  getTransmissions(): string[] {
    return TRANSMISSIONS;
  }

  searchVehicles(brand?: string, model?: string, year?: number) {
    if (!brand) {
      return { brands: this.getBrands() };
    }
    const models = this.getModelsByBrand(brand);
    if (!model) {
      return { brand, models };
    }
    return { brand, model, years: this.getYears(brand) };
  }
}
