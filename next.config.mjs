/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [],
        },
    },
    // Make environment variables accessible in the client-side code
    env: {
        APP_USERNAME: process.env.APP_USERNAME,
        APP_PASSWORD: process.env.APP_PASSWORD,
    },
};

export default nextConfig;
