import Head from "next/head";

export default function SEO({
  title,
  description,
  image,
  url,
}) {
  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />

      <meta property="og:description" content={description} />

      <meta property="og:image" content={image} />

      <meta property="og:url" content={url} />

      <meta property="og:type" content="website" />
    </Head>
  );
}