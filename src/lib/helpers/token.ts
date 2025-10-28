import jwt, { type JwtPayload } from 'jsonwebtoken';

/**
 * Checks if a JWT token is close to expiring.
 *
 * @param {string} token - The JWT token string.
 * @param {number} [thresholdInSeconds=300] - The threshold (in seconds) to consider "close to expiration". Default: 5 minutes.
 * @returns {boolean} - Returns true if the token will expire soon, false otherwise.
 */
export function isJwtExpiringSoon(token: string, thresholdInSeconds = 300) {
	try {
		const decoded = jwt.decode(token) as JwtPayload;

		if (!decoded || !decoded.exp) {
			throw new Error('Invalid token: missing exp claim.');
		}

		const currentTime = Math.floor(Date.now() / 1000);
		const timeUntilExpiration = decoded.exp - currentTime;

		return timeUntilExpiration <= thresholdInSeconds;
	} catch (err) {
		console.error('Error decoding token:', err.message);
		return true; // treat as expiring if invalid
	}
}
