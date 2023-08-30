import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Catcam',
    short_name: 'Catcam',
    description: 'Livestream of cats',
    start_url: '/',
    display: 'standalone',
    background_color: '#006699',
    theme_color: '#006699',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}