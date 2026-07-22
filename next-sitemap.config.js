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
      "https://api.myhomivo.com/properties"
    );

    const properties = await propertyRes.json();

    properties.data.forEach((property) => {
      paths.push({
        loc: `/property/${property._id}`,
        lastmod: new Date().toISOString(),
      });
    });

    // Fetch cities
    const cityRes = await fetch(
      "https://api.myhomivo.com/cities"
    );

    const cities = await cityRes.json();

    cities.data.forEach((city) => {
      const slug = city.slug || city._id;
      paths.push({
        loc: `/city/${slug}`,
        lastmod: new Date().toISOString(),
      });
    });

    return paths;
  },
};