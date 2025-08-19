import { Assignment } from '../types/types';

/**
 * Extract the numeric payload (pax or kg) from a description string.
 *
 *  - ‘A’ and ‘V’ assignments are always passengers → grab the first number.
 *  - ‘T’ assignments can be passengers *or* cargo:
 *      • if the word “Cargo” is present → grab the number that follows it (kg)
 *      • otherwise → treat it as passengers and grab the first number.
 */
export const extractPayload = (payloadString: string, category: 'A' | 'T' | 'V'): number => {
  const str = payloadString.trim();

  // Helpers ────────────────────────────────────────────────────────────
  const firstNumber = /^\s*(\d+)/; // e.g. “122 Pax – …”
  const cargoNumber = /Cargo\s+(\d+)\s*kg/i; // e.g. “Cargo 4584kg”

  // Categories A & V → always Pax
  if (category === 'A' || category === 'V') {
    const m = str.match(firstNumber);
    return m ? Number(m[1]) : NaN;
  }

  // Category T → might be cargo
  if (/Cargo/i.test(str)) {
    const m = str.match(cargoNumber);
    return m ? Number(m[1]) : NaN;
  }

  // Otherwise it’s passengers
  const m = str.match(firstNumber);
  return m ? Number(m[1]) : NaN;
};
