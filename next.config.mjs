/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                pathname: '/random/**',
            },
            {
                protocol: 'https',
                hostname: 'res.freestockphotos.biz',
                pathname: '/pictures/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.publicdomainpictures.net',
                pathname: '/pictures/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'loremflickr.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
