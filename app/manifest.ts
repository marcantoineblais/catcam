import { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: "Catcam",
    short_name: "Catcam",
    description: "Livestream of cats",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#c46b1e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
