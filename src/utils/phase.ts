import { angle as convertAngle, confineAngle } from "./math";
import {
	SUN_ANGULAR_SIZE,
	MOON_ANGULAR_SIZE,
	EARTH_ORBIT_AXIS,
	MOON_SEMIMAJOR_AXIS,
	LUNATIONS_BASE,
	EARTH_ECCENTRICITY,
	EPOCH,
	SUN_ECLIPTIC_LONGITUDE_EPOCH,
	MOON_ECCENTRICITY,
	SUN_ECLIPTIC_LONGITUDE_PERIGEE,
	MOON_INCLINATION,
	MOON_MEAN_LONGITUDE_PERIGEE,
	MOON_MEAN_LONGITUDE,
	MOON_LONGITUDE_NODE,
	SYNODIC_MONTH,
	MOON_PARALLAX,
} from "../constants/phase";

const { radians, degrees } = convertAngle;

export type MoonPhaseInfo = {
	phaseDegrees: number;
	phaseRadians: number;
	moonAgeInMonth: number;
	distance: number;
	angularDiameter: number;
	sunDistance: number;
	sunAngularDiameter: number;
};

function kepler(angle: number, ecc: number) {
	const epsilon = 1e-6;

	let theta = radians(angle);
	let delta: number;
	while (true) {
		delta = theta - ecc * Math.sin(theta) - angle;
		theta -= delta / (1 - ecc * Math.cos(theta));
		if (Math.abs(delta) <= epsilon) break;
	}

	return theta;
}

export function getPhase(julianDate: number) {
	/**  PHASE  --  Calculate phase of moon as a fraction:

		 The argument is the time for which the phase is requested,
		 expressed as a Julian date and fraction.  Returns the terminator
		 phase angle as a percentage of a full circle (i.e., 0 to 1),
		 and stores into pointer arguments the illuminated fraction of
		 the Moon's disc, the Moon's age in days and fraction, the
		 distance of the Moon from the centre of the Earth, and the
		 angular diameter subtended by the Moon as seen by an observer
		 at the centre of the Earth.
	**/

	// Calculation of the Sun's position

	const day = julianDate - EPOCH; // Date within epoch
	const sunMeanAnomaly = confineAngle((360 / 365.2422) * day); //Mean anomaly of the Sun
	const epoch = confineAngle(
		sunMeanAnomaly +
			SUN_ECLIPTIC_LONGITUDE_EPOCH -
			SUN_ECLIPTIC_LONGITUDE_PERIGEE,
	); // Convert from perigee

	let eccentricity = kepler(epoch, EARTH_ECCENTRICITY); // Solve equation of Kepler
	eccentricity =
		Math.sqrt((1 + EARTH_ECCENTRICITY) / (1 - EARTH_ECCENTRICITY)) *
		Math.tan(eccentricity / 2);
	eccentricity = 2 * degrees(Math.atan(eccentricity)); // True anomaly
	const lambdasun = confineAngle(eccentricity + SUN_ECLIPTIC_LONGITUDE_PERIGEE); // Sun's geocentric ecliptic longitude

	const orbital_dist =
		(1 + EARTH_ECCENTRICITY * Math.cos(radians(eccentricity))) /
		(1 - EARTH_ECCENTRICITY * EARTH_ECCENTRICITY); // Orbital distance factor
	const sunDistance = EARTH_ORBIT_AXIS / orbital_dist; // Distance to Sun in km
	const sunAngularDiameter = orbital_dist * SUN_ANGULAR_SIZE; // Sun's angular size in degrees

	// Calculation of the Moon's position

	const moon_mean_long = confineAngle(13.1763966 * day + MOON_MEAN_LONGITUDE); // Moon's mean longitude

	const moon_mean_anom = confineAngle(
		moon_mean_long - 0.1114041 * day - MOON_MEAN_LONGITUDE_PERIGEE,
	); // Moon's mean anomaly

	const moon_asc_node_mean_long = confineAngle(
		MOON_LONGITUDE_NODE - 0.0529539 * day,
	); // Moon's ascending node mean longitude

	const evection =
		1.2739 *
		Math.sin(radians(2 * (moon_mean_long - lambdasun) - moon_mean_anom)); // Evection

	const ann_eq = 0.1858 * Math.sin(radians(epoch)); // Annual equation

	const correction1 = 0.37 * Math.sin(radians(epoch)); // Correction term

	const moon_anom_correct = moon_mean_anom + evection - ann_eq - correction1; // Corrected anomaly

	const centre_eq_correct = 6.2886 * Math.sin(radians(moon_anom_correct)); // Correction for the equation of the centre

	// Another correction term
	const correction2 = 0.214 * Math.sin(radians(2 * moon_anom_correct));

	const long_correct =
		moon_mean_long + evection + centre_eq_correct - ann_eq + correction2; // Corrected longitude

	const variation = 0.6583 * Math.sin(radians(2 * (long_correct - lambdasun))); // Variation

	const true_long = long_correct + variation; // True longitude

	const node_long_correct =
		moon_asc_node_mean_long - 0.16 * Math.sin(radians(epoch)); // Corrected longitude of the node

	const y_incline =
		Math.sin(radians(true_long - node_long_correct)) *
		Math.cos(radians(MOON_INCLINATION)); // Y inclination coordinate

	const x_incline = Math.cos(radians(true_long - node_long_correct)); // X inclination coordinate

	let lambdamoon = degrees(Math.atan2(y_incline, x_incline)); // Ecliptic longitude
	lambdamoon += node_long_correct;

	// Calculation of the phase of the Moon

	const moon_age = true_long - lambdasun; // Age of the Moon in degrees

	const distance = // Calculate distance of moon from the centre of the Earth
		(MOON_SEMIMAJOR_AXIS * (1 - MOON_ECCENTRICITY * MOON_ECCENTRICITY)) /
		(1 +
			MOON_ECCENTRICITY *
				Math.cos(radians(moon_anom_correct + centre_eq_correct)));

	const angularDiameterFraction = distance / MOON_SEMIMAJOR_AXIS; // Calculate Moon's angular diameter
	// Moon's angular diameter in degrees
	const angularDiameter = MOON_ANGULAR_SIZE / angularDiameterFraction;

	const phaseRadians = (1 - Math.cos(radians(moon_age))) / 2; // Phase of the Moon
	const moonAgeInMonth = SYNODIC_MONTH * (confineAngle(moon_age) / 360.0);

	return {
		phaseDegrees: confineAngle(moon_age) / 360.0,
		phaseRadians,
		moonAgeInMonth,
		distance,
		angularDiameter,
		sunDistance,
		sunAngularDiameter,
	};
}
