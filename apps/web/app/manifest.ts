import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexus AI — Universal Adaptive Intelligence Platform",
    short_name: "Nexus AI",
    description:
      "Multi-agent workflows, neural memory, cognitive telemetry, and advanced generative AI platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#4f52ea",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
