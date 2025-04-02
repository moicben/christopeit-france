import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const MyHead = ({ title, description, name, domain, favicon, graph, font, colorPrimary, colorSecondary, colorBlack, colorGrey, bgMain, bgLight, bgDark, radiusBig, radiusMedium }) => {
  const router = useRouter();
  const pageSlug = router.asPath === '/' ? '' : router.asPath.replace(/\/$/, ''); // Supprime le slash final si présent

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="icon" href={favicon} />
      <link rel="canonical" href={`https://www.${domain}${pageSlug}`} />

      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://www.${domain}${pageSlug}`} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={graph} />
      <meta property="og:image:secure_url" content={graph} />

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

      {/* Custom CSS Style From Supabase Shop */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=${font}:wght@200;300;400;500;600;700&display=swap');
          
          * {
            font-family: ${font}, -apple-system, sans-serif;
          }


          .radius-medium,
          button {
            border-radius: ${radiusMedium};
          }

          .radius-big,
          .card {
            border-radius: ${radiusBig};
          }


          .color-primary {
            color: ${colorPrimary} !important;
          }

          .color-black{
            color: ${colorBlack};
          }

          .color-grey {
            color: ${colorGrey};
          }

          .color-secondary{
            color: ${colorSecondary};
          }


          .bg-primary,
          button {
            background-color: ${colorPrimary} ;
          }

          .bg-main {
            background-color: ${bgMain};
          }

          .bg-light {
            background-color: ${bgLight};
          }

          .bg-white{
            background-color: #fff;
          }s

          .bg-dark {
            background-color: ${bgDark};
          }


          .border-primary{
            border-color: ${colorPrimary} !important;
          }

          .border-top-primary{
            border-top-color: ${colorPrimary} !important;
          }
        `}
      </style>

      {/* Google tag 1 (Initial) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16883090550"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-16883090550');
        `}
      </script>

      {/* Google tag 2 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16915371402"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-16915371402');
        `}
      </script>

      <script>
        {`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:5325018,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </script>

      <script src="https://js.mollie.com/v1/mollie.js"></script>
    </Head>
  );
};

export default MyHead;