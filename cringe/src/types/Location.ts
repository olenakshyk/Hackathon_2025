export interface Location {
  id: number;
  name: string;
  lat: number;
  lon: number;
  type: string;
  subtype: string;
  description: string;
  inclusivity: number;
  rating: number;
  hasAdaptiveToilet: boolean;
  hasElevator: boolean;
  hasRamp: boolean;
  hasTactilePaving: boolean;
  onFirstFloor: boolean;
  isClaster: boolean;
}