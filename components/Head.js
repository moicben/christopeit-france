import React from 'react';
import Head from 'next/head';

const MyHead = ({ title, description, favicon }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={favicon} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
  

      {/* Google tag 1 (Initial)*/}
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