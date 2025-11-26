declare global {
  type EpochTimeStamp = number;
  interface Package {
    name: string;
    version: [number, number, number];
    size: number;
  }
}

export {};
