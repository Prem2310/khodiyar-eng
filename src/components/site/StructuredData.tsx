import { COMPANY, PRODUCTS } from "@/data/site";

export function StructuredData() {
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    alternateName: "Khodiyar Engineering Ahmedabad",
    description:
      "Precision engineered industrial valve manufacturer and supplier in Vastral, Ahmedabad, Gujarat, India. Manufacturing ball, butterfly, gate, globe, check, plug, sanitary dairy and pneumatic valves.",
    url: "https://khodiyarengineering.in",
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vastral",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      postalCode: "382418",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "23.0033",
      longitude: "72.6568",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "AdministrativeArea", name: "Gujarat" },
      { "@type": "AdministrativeArea", name: "Maharashtra" },
      { "@type": "AdministrativeArea", name: "Rajasthan" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Industrial Valves & Flow Control Solutions",
      itemListElement: PRODUCTS.map((p, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: p.name,
          description: p.short,
          category: "Industrial Valves",
          material: "Stainless Steel SS304, SS316, Carbon Steel, Cast Iron",
          url: `https://khodiyarengineering.in/products/${p.slug}`,
        },
        position: idx + 1,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
    />
  );
}
