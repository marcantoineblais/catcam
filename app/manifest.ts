import { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: "Catcam",
    short_name: "Catcam",
    description: "Livestream of cats",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f4",
    // Android colors the system bars of the installed app with it
    theme_color: "#f7f6f4",
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
