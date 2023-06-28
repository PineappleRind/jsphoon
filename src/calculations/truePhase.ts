import { meanPhase } from "./meanPhase";
import { degreeTrigonometry } from "../utils/math";
const { sin: dsin, cos: dcos } = degreeTrigonometry;

export type Phase = 0.0 | 0.25 | 0.5 | 0.75;
/**
 * TRUEPHASE  --  Given a K value used to determine the
 * mean phase of the new moon, and a phase
 * selector (0.0, 0.25, 0.5, 0.75), obtain
 * the true, corrected phase time.
 */
export function truePhase(k: number, moonPhase: Phase) {
	let apcor = false;
	k += moonPhase;
	// Time in Julian centuries from 1900 January 0.5
	const julianTime = k / 1236.85;
	// Mean time of phase
	let phaseTime = meanPhase(julianTime * 36525 + 2415020, k);
	// Sun's mean anomaly
	const sunMeanAnomaly =
		359.2242 +
		29.10535608 * k -
		0.0000333 * julianTime ** 2 +
		0.00000347 * julianTime ** 3;
	// Moon's mean anomaly
	const moonMeanAnomaly =
		306.0253 +
		385.81691806 * k +
		0.0107306 * julianTime ** 2 +
		0.00001236 * julianTime ** 3;
	// Moon's argument of latitude
	const moonArgumentOfLatitude =
		21.2964 +
		385.81691806 * k +
		0.0016528 * julianTime ** 2 +
		0.00000239 * julianTime ** 3;
	// Corrections for New and Full moon
	if (moonPhase < 0.01 || Math.abs(moonPhase - 0.5) < 0.01) {
		phaseTime +=
			(0.1734 - 0.000393 * julianTime) * dsin(sunMeanAnomaly) +
			0.0021 * dsin(2 * sunMeanAnomaly) -
			0.4068 * dsin(moonMeanAnomaly) +
			0.0161 * dsin(2 * moonMeanAnomaly) -
			0.0004 * dsin(3 * moonMeanAnomaly) +
			0.0104 * dsin(2 * moonArgumentOfLatitude) -
			0.0051 * dsin(sunMeanAnomaly + moonMeanAnomaly) -
			0.0074 * dsin(sunMeanAnomaly - moonMeanAnomaly) +
			0.0004 * dsin(2 * moonArgumentOfLatitude + sunMeanAnomaly) -
			0.0004 * dsin(2 * moonArgumentOfLatitude - sunMeanAnomaly) -
			0.0006 * dsin(2 * moonArgumentOfLatitude + moonMeanAnomaly) +
			0.001 * dsin(2 * moonArgumentOfLatitude - moonMeanAnomaly) +
			0.0005 * dsin(sunMeanAnomaly + 2 * moonMeanAnomaly);
		apcor = true;
	} else if (
		Math.abs(moonPhase - 0.25) < 0.01 ||
		Math.abs(moonPhase - 0.75) < 0.01
	) {
		phaseTime +=
			(0.1721 - 0.0004 * julianTime) * dsin(sunMeanAnomaly) +
			0.0021 * dsin(2 * sunMeanAnomaly) -
			0.628 * dsin(moonMeanAnomaly) +
			0.0089 * dsin(2 * moonMeanAnomaly) -
			0.0004 * dsin(3 * moonMeanAnomaly) +
			0.0079 * dsin(2 * moonArgumentOfLatitude) -
			0.0119 * dsin(sunMeanAnomaly + moonMeanAnomaly) -
			0.0047 * dsin(sunMeanAnomaly - moonMeanAnomaly) +
			0.0003 * dsin(2 * moonArgumentOfLatitude + sunMeanAnomaly) -
			0.0004 * dsin(2 * moonArgumentOfLatitude - sunMeanAnomaly) -
			0.0006 * dsin(2 * moonArgumentOfLatitude + moonMeanAnomaly) +
			0.0021 * dsin(2 * moonArgumentOfLatitude - moonMeanAnomaly) +
			0.0003 * dsin(sunMeanAnomaly + 2 * moonMeanAnomaly) +
			0.0004 * dsin(sunMeanAnomaly - 2 * moonMeanAnomaly) -
			0.0003 * dsin(2 * sunMeanAnomaly + moonMeanAnomaly);
		// First quarter correction
		if (moonPhase < 0.5) {
			phaseTime +=
				0.0028 - 0.0004 * dcos(sunMeanAnomaly) + 0.0003 * dcos(moonMeanAnomaly);
		}
		// Last quarter correction
		else {
			phaseTime +=
				-0.0028 +
				0.0004 * dcos(sunMeanAnomaly) -
				0.0003 * dcos(moonMeanAnomaly);
		}
		apcor = true;
	}
	if (!apcor)
		throw new Error(
			"TRUEPHASE (moon/truePhase.ts) called with invalid phase selector",
		);
	return phaseTime;
}
