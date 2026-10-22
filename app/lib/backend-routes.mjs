// Shared by the relay and publishing checks; keep private backend paths closed.
const readableRoutes = [
 /^v1\/screener$/,
 /^v1\/activity$/,
 /^v1\/subnets\/\d+\/candles$/,
 /^v1\/wallets\/jobs\/[a-f0-9]{32}$/,
];
/** @param {string} method @param {string} pathname */
export function routeIsAllowed(method, pathname) {
 if (method === "POST") return pathname === "v1/wallets/jobs";
 return method === "GET" && readableRoutes.some(pattern => pattern.test(pathname));
}
