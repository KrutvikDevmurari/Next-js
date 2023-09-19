/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
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
module.exports = nextConfig