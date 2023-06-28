import {
	SECONDS_IN_DAY,
	SECONDS_IN_HOUR,
	SECONDS_IN_MINUTE,
} from "@/constants/settings";

export function unixToJulian(timestamp: number) {
	return timestamp / 86400 + (2440587 + 1499999 / 3000000);
}

export function julianToISO(epoch: number) {
	/** JYEAR  --  Convert Julian date to year, month, day, which are
		 returned via integer pointers to integers.
		Return (yy, mm, dd)
	*/
	const { floor } = Math;
	epoch += 0.5; // Astronomical to civil
	let julian = floor(epoch);
	julian -= 1721119.0;
	let year = floor((4 * julian - 1) / 146097.0);
	julian = julian * 4.0 - (1.0 + 146097.0 * year);
	let day = floor(julian / 4.0);
	julian = floor((4.0 * day + 3.0) / 1461.0);
	day = 4.0 * day + 3.0 - 1461.0 * julian;
	day = floor((day + 4.0) / 4.0);
	let month = floor((5.0 * day - 3) / 153.0);
	day = 5.0 * day - (3.0 + 153.0 * month);
	day = floor((day + 5.0) / 5.0);
	year = 100.0 * year + julian;
	if (month < 10.0) month += 3;
	else {
		month -= 9;
		year += 1;
	}
	return [year, month, day];
}

/**
 * Create a datestring for format 'dd HH:MM:SS'
 * may be a better way to do this with new Date()
 */
export function createDateString(secs: number) {
	const days = Math.trunc(secs / SECONDS_IN_DAY);
	secs = Math.trunc(secs - days * SECONDS_IN_DAY);
	const hours = Math.trunc(secs / SECONDS_IN_HOUR);
	secs = Math.trunc(secs - hours * SECONDS_IN_HOUR);
	const minutes = Math.trunc(secs / SECONDS_IN_MINUTE);
	secs = Math.trunc(secs - minutes * SECONDS_IN_MINUTE);

	const padNumber = (x: number) => x.toString().padStart(2, "0");
	return `${days} ${hours}:${padNumber(minutes)}:${padNumber(secs)}`;
}
