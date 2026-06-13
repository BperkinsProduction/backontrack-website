export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://www.backontrackmeets.com/sitemap.xml",
    host: "https://www.backontrackmeets.com",
  };
}
