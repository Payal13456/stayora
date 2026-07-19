/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://myhomivo.com",

  generateRobotsTxt: true,

  sitemapSize: 5000,

  changefreq: "daily",

  priority: 0.7,

  additionalPaths: async (config) => {
    const paths = [];

    // Fetch properties
    const propertyRes = await fetch(
      "https://myhomivo.com/api/properties"
    );

    const properties = await propertyRes.json();

    properties.forEach((property) => {
      paths.push({
        loc: `/property/${property.slug}`,
        lastmod: new Date().toISOString(),
      });
    });

    // Fetch cities
    const cityRes = await fetch(
      "https://myhomivo.com/api/cities"
    );

    const cities = await cityRes.json();

    cities.forEach((city) => {
      paths.push({
        loc: `/city/${city.slug}`,
        lastmod: new Date().toISOString(),
      });
    });

    return paths;
  },
};