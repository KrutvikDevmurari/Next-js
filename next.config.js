/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const nextConfig = {

    images: {
        domains: ['lh3.googleusercontent.com']
    }
}
module.exports = {
    api: {
        bodyParser: false,
        routes: ['/api/socket'],
    },
};
module.exports = withPWA({
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
    },
});
module.exports = nextConfig