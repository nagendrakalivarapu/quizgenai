/**
 * Best-effort decode of a JWT's payload so the UI can greet the user
 * by name/email if the backend already includes those claims in the
 * token. Never throws — returns null if the token is missing, malformed,
 * or not a JWT at all.
 */
export function decodeJwtPayload(token) {

    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    try {

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const json = decodeURIComponent(
            atob(padded)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );

        return JSON.parse(json);

    } catch {
        return null;
    }
}

/**
 * Pulls the friendliest display name available out of common JWT claim
 * shapes, without assuming any particular backend contract.
 */
export function getDisplayNameFromToken(token) {

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const candidate =
        payload.name ||
        payload.username ||
        payload.given_name ||
        payload.sub ||
        payload.email;

    if (!candidate || typeof candidate !== "string") return null;

    // If it's an email, use the part before the @ for a friendlier greeting.
    const atIndex = candidate.indexOf("@");
    return atIndex > 0 ? candidate.slice(0, atIndex) : candidate;
}
