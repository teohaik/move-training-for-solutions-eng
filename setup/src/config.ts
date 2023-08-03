import { config } from "dotenv";

config({});
export const SUI_NETWORK = process.env.SUI_NETWORK!;
export const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS!;
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY!;
export const RIDER_SECRET_KEY = process.env.RIDER_SECRET_KEY!;
export const DRIVER_SECRET_KEY = process.env.DRIVER_SECRET_KEY!;
export const PACKAGE_ADDRESS = process.env.PACKAGE_ADDRESS!;
export const PUBLISHER_ID = process.env.PUBLISHER_ID!;

export const RIDE_STORAGE = process.env.RIDE_STORAGE_ID!;


// console.log everything in the process.env object
const keys = Object.keys(process.env);
console.log("env contains ADMIN_ADDRESS:", keys.includes("ADMIN_ADDRESS"));
console.log("env contains ADMIN_SECRET_KEY:", keys.includes("ADMIN_SECRET_KEY"));
console.log("env contains RIDER_SECRET_KEY:", keys.includes("RIDER_SECRET_KEY"));
console.log("env contains DRIVER_SECRET_KEY:", keys.includes("DRIVER_SECRET_KEY"));