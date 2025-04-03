import React from 'react';

import { useRouter } from 'next/router';
import Head from '../../components/Head';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Categories from '../../components/Categories';

import { fetchData } from 'lib/supabase';


const Article = ({ shop, data, brand, article, categories }) => {
  const router = useRouter();
  const { article: articleId } = router.query;

  if (!article) {
    return <p>Article non trouvé</p>;
  }

  return (
    <div className="container">


      <Head name={shop.name} domain={shop.domain}
          favicon={brand.favicon} graph={brand.graph}
          colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
          title={`Blog & Guides - ${shop.name}`}
      />

      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} />
        
        <section className="article" id='article'>
          <div className='wrapper'>
            <div className="article-content">
              <img src={article.thumbnail} alt={article.title} />
              <h1>{article.title}</h1>
              <h3 className='desc'>{article.excerpt}</h3>
              <div className="content" dangerouslySetInnerHTML={{ __html: article.content }}/>
            </div>
          </div>
        </section>
      </main>
      <Categories categories={categories} title='Découvrez nos équipements' data={data}/>
      <Footer shop={shop} data={data} />
    </div>
  );
};

export async function getStaticPaths() {
  // Récupération des données depuis Supabase
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  // Vérification que le champ blogContent existe et contient des articles
  if (!data || !data[0]?.blogContent?.articles) {
    console.error("Erreur : blogContent ou articles manquants dans les données récupérées.");
    return { paths: [], fallback: false };
  }

  // Génération des chemins à partir des slugs des articles
  const paths = data[0].blogContent.articles.map(article => ({
    params: { article: article.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });

  const article = data[0].blogContent.articles.find(article => article.slug === params.article);

  return {
    props: {
      data: data[0],
      shop: shop[0],
      brand: brand[0],
      article,
      categories,
    },
  };
}

export default Article;