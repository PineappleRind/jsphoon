import { SYNODIC_MONTH } from "../constants/phase";
import { angle } from "../utils/math";

/**
 * Calculates the time of the mean new moon for a given base date.
 * @param julianDate A julian date
 * @param k Synodic month index
 */

export function meanPhase(julianDate: number, k: number) {
	// Sine from radians instead of degrees
	const dsin = (x: number) => Math.sin(angle.radians(x));
	// Time in Julian centuries from 1900 January 0.5
	const julianTime = (julianDate - 2415020) / 36525;
	return (
		2415020.75933 +
		SYNODIC_MONTH * k +
		0.0001178 * julianTime ** 2 -
		0.000000155 * julianTime ** 3 +
		0.00033 * dsin(166.56 + 132.87 * julianTime - 0.009173 * julianTime ** 2)
	);
}
