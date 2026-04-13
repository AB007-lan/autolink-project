import { Injectable } from '@nestjs/common';

// Données de référence des marques et modèles courants en Mauritanie
const VEHICLE_DATA: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'HiLux', 'Land Cruiser', 'RAV4', 'Yaris', 'Prado', 'HiAce', 'Fortuner', 'Rush'],
  Nissan: ['Navara', 'Patrol', 'X-Trail', 'Sunny', 'Sentra', 'Micra', 'Pathfinder', 'Frontier'],
  Hyundai: ['Sonata', 'Elantra', 'Tucson', 'Santa Fe', 'H1', 'Accent', 'i10', 'i20', 'i30'],
  Kia: ['Sportage', 'Sorento', 'Picanto', 'Rio', 'Carnival', 'Cerato', 'K5'],
  Mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'Sprinter', 'Vito', 'Actros'],
  BMW: ['Série 3', 'Série 5', 'Série 7', 'X3', 'X5', 'X6'],
  Peugeot: ['208', '308', '3008', '5008', 'Partner', 'Expert', 'Boxer'],
  Renault: ['Clio', 'Megane', 'Scenic', 'Duster', 'Kangoo', 'Master', 'Trafic'],
  Ford: ['F-150', 'Ranger', 'Explorer', 'Focus', 'Transit', 'Mustang'],
  Mitsubishi: ['L200', 'Pajero', 'Outlander', 'Eclipse Cross', 'Galant'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz', 'Pilot'],
  Isuzu: ['D-Max', 'MU-X', 'NPR', 'NKR'],
  Volkswagen: ['Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'Caddy'],
  Land_Rover: ['Discovery', 'Defender', 'Range Rover', 'Freelander'],
  Jeep: ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass'],
  Chevrolet: ['Captiva', 'Cruze', 'Silverado', 'Tahoe', 'Suburban'],
  Mazda: ['CX-5', 'CX-9', 'Mazda 3', 'Mazda 6', 'BT-50'],
  Suzuki: ['Jimny', 'Vitara', 'Swift', 'Alto', 'Ertiga'],
  Fiat: ['Doblo', 'Ducato', 'Punto', 'Tipo'],
  Citroën: ['C3', 'C4', 'Berlingo', 'Jumper', 'Jumpy'],
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

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentYear; y >= 1990; y--) {
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
    return { brand, model, years: this.getYears() };
  }
}
