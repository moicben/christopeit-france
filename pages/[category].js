import { useRouter } from "next/router";

import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Head from '../components/Head';
import Categories from '../components/Categories';
import ScrollingBanner from "components/ScrollingBanner";

import { fetchData } from "../lib/supabase";

const CategoryPage = ({data, shop, brand, categories, category, filteredProducts, otherCategories, reviews }) => {
  if (!category) {
    return <h1>404 error</h1>;
  }

  const getRandomIcon = () => {
    const icons = [
      "fas fa-check",
      "fas fa-star",
      "fas fa-heart",
      "fas fa-cog",
      "fas fa-bolt",
      "fas fa-leaf",
      "fas fa-gem",
      "fas fa-lightbulb",
      "fas fa-trophy",
      "fas fa-rocket",
      "fas fa-cloud",
      "fas fa-compass",
      "fas fa-anchor",
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  console.log('Faviconn:', brand.favicon);

  return (
    <div className="container">


      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${category.title} - ${category.desc}`}
      />

      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        <section className="category-banner">
          <div className="wrapper" style={{ backgroundImage: `url(${category.image})` }}>
            <div className="content">
              <h1>{category.title}</h1>
              <p>{category.desc}</p>
            </div>
          </div>
        </section>
        <ScrollingBanner items={data.saleBanner} />
       
        <Products
          products={filteredProducts}
          description={category.seoDescription}
          showCategoryFilter={false}
          disablePagination={true}
          categories={categories}
          data={data}
          shop={shop}
        />

        <section className="guide">
          <div className="wrapper">
            <h2>{category.guideTitle}</h2>
            <div className="content">
              <ul>
                {category.guideContent.map((point, index) => (
                  <li className='' key={index}>{point}</li>
                ))}
              </ul>
              <img src={category.guideImg} alt={category.guideTitle} />
            </div>
          </div>
        </section>

        <section className="why">
          <div className="wrapper">
            <h2>{category.whyTitle}</h2>
            <div className="content">
              <ul>
                {category.whyContent.map((point, index) => (
                  <li key={index}><i className={`${getRandomIcon()} color-primary`}></i>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="maintenance">
          <div className="wrapper">
            <h2>{category.maintenanceTitle}</h2>
            <div className="content">
              <ul className="custom-marker">
                {category.maintenanceContent.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <img src={category.maintenanceImg} alt={category.maintenanceTitle} />
            </div>
          </div>
        </section>
        
        <Testimonials data={data} shop={shop} reviews={reviews} />
        <Categories categories={categories} title={data.categorySimilar} data={data}/>
      </main>
      <Footer shop={shop} data={data} />
    </div>
  );
};

// 🔹 Génération des pages dynamiques
export async function getStaticPaths() {
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  
  const paths = categories.map((category) => ({
    params: { category: category.slug },
  }));

  return { paths, fallback: false };
}

// 🔹 Préchargement des données côté serveur
export async function getStaticProps({ params }) {
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });

  console.log('Shop data:', shop);

  const category = categories.find((cat) => cat.slug === params.category);

  // Si la catégorie est "all" ou "bestsellers", on filtre
  const filteredProducts = params.category === "all"
    ? products
    : params.category === "bestsellers"
    ? products.filter(
        (product) => product.bestseller === true
      )
    : products.filter((product) => {
        const productCategory = categories.find((cat) => cat.id === product.category_id);
        return productCategory && productCategory.slug === params.category;
      });

  if (!category) {
    return { notFound: true };
  }

  const otherCategories = categories.filter((cat) => cat.slug !== params.category); // Exclure la catégorie actuelle
  const site = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  console.log('Shop data:', shop);
  console.log('Brand data:', brand);

  return {
    props: {
      category,
      filteredProducts,
      site: site[0],
      data: data[0],
      brand: brand[0],
      shop: shop[0],
      products: products[0],
      otherCategories,
      categories,
      reviews,
    },
  };
}

export default CategoryPage;