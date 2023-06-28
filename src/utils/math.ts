/** Takes in any number and calculates the overflow. */
export function confineAngle(angle: number) {
	return angle - 360 * Math.floor(angle / 360);
}

export const angle = {
	degrees: (radians: number) => (radians * 180) / Math.PI,
	radians: (degrees: number) => (degrees * Math.PI) / 180,
};

export const degreeTrigonometry = {
	sin: (degrees: number) => Math.sin(angle.radians(degrees)),
	cos: (degrees: number) => Math.cos(angle.radians(degrees)),
};
