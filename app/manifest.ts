import { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: "Catcam",
    short_name: "Catcam",
    description: "Livestream of cats",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f4",
    theme_color: "#b8541a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
