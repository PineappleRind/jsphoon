import { SYNODIC_MONTH } from "@/constants/phase";
import { julianToISO } from "@/utils/date";
import { meanPhase } from "@/calculations/meanPhase";
import { Phase, correctPhase } from "@/calculations/correctPhase";

export function find2SurroundingPhases(julianDate: number) {
	/**PHASEHUNT2  --  Find time of phases of the moon which surround
	the current date.  Two phases are found.
   Return phases[2], which[2]
   */
	let phases = [0, 0];
	let which = [0, 0];

	let phases5 = find5SurroundingPhases(julianDate);
	phases[0] = phases5[0];
	which[0] = 0.0;
	phases[1] = phases5[1];
	which[1] = 0.25;
	if (phases[1] <= julianDate) phases[0] = phases[1];
	which[0] = which[1];
	phases[1] = phases5[2];
	which[1] = 0.5;
	if (phases[1] <= julianDate) phases[0] = phases[1];
	which[0] = which[1];
	phases[1] = phases5[3];
	which[1] = 0.75;
	if (phases[1] <= julianDate) phases[0] = phases[1];
	which[0] = which[1];
	phases[1] = phases5[4];
	which[1] = 0.0;

	return { phases, which };
}

/**  PHASEHUNT5  --  Find time of phases of the moon which surround
	 the current date.  Five phases are found, starting
	 and ending with the new moons which bound the
	 current lunation.
	Return phases (double[5])
*/
export function find5SurroundingPhases(julianDate: number) {
	let adate = julianDate - 45;

	const [year, month, _] = julianToISO(adate);
	// this was called var1???
	let unnamedVariable = Math.floor(
			(year + (month - 1) * (1.0 / 12.0) - 1900) * 12.3685,
		),
		anotherUnnamedVariable: number;
	let new_time = meanPhase(adate, unnamedVariable);
	adate = new_time;
	while (true) {
		adate += SYNODIC_MONTH;
		anotherUnnamedVariable = unnamedVariable + 1;
		const newerTime = meanPhase(adate, anotherUnnamedVariable);
		if (newerTime > julianDate && julianDate >= new_time) break;
		new_time = newerTime;
		unnamedVariable = anotherUnnamedVariable;
	}
	return ([0.0, 0.25, 0.5, 0.75] as Phase[])
		.map((x) => correctPhase(unnamedVariable, x))
		.concat(correctPhase(anotherUnnamedVariable, 0.0));
}
