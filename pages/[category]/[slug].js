import { useState, useEffect, useRef } from 'react';

import Head from '../../components/Head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from '../../components/Products';
import Reviews from '../../components/Reviews';
import Categories from '../../components/Categories'; 
import Testimonials from 'components/Testimonials';

import ProductInfos from '../../components/ProductInfos';

import {fetchData} from '../../lib/supabase'; // Assurez-vous que le chemin est correct


// Event snippet for Clic "Ajouter au panier" conversion page
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };

  // Compte 1 (Initial)
  gtag('event', 'conversion', {
      'send_to': 'AW-16883090550/jdTDCK687qEaEPaIvvI-',
      'event_callback': callback
  });


  // Compte 2
  gtag('event', 'conversion', {
      'send_to': 'AW-16916919273/AaB9CMz3jK0aEOnnzoI_',
      'event_callback': callback
  });
  return false;
}

export default function ProductDetail({ product, category, shop, brand, data, products, categories, relatedProducts, otherCategories }) {
  const [cartCount, setCartCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [visibleImageIndex, setVisibleImageIndex] = useState(0);
  const [buttonText, setButtonText] = useState('Ajouter au panier');
  const sliderRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(() => {
    return 7 * 3600 + 37 * 60 + 20;
  });
  const [showBanner, setShowBanner] = useState(false);



  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        sessionStorage.setItem('timeLeft', JSON.stringify(newTime));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1.2) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (!product) {
    return <div>Produit ou site non trouvé</div>;
  }

  const handleAddToCart = async () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === product.id);

    if (productIndex !== -1) {
      // Si le produit est déjà dans le panier et identique, augmenter la quantité
      if (JSON.stringify(cart[productIndex]) === JSON.stringify({ ...product, quantity: cart[productIndex].quantity })) {
        cart[productIndex].quantity += 1;
      } else {
        // Si le produit est différent, ajouter comme un nouveau produit
        const productWithQuantity = { ...product, quantity: 1 };
        cart.push(productWithQuantity);
      }
    } else {
      // Sinon, ajouter le produit avec la quantité spécifiée
      const productWithQuantity = { ...product, quantity: 1 };
      cart.push(productWithQuantity);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Changer le texte du bouton
    setButtonText('Produit ajouté');
    setTimeout(() => setButtonText('Ajouter au panier'), 3000);
    // Ouvrir le drawer du panier
    document.querySelector('.cart-container').click();

    // Call the conversion tracking function
    gtag_report_conversion();

    //console.log(cart);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNextImages = () => {
    if (visibleImageIndex + 1 < images.length) {
      setVisibleImageIndex(visibleImageIndex + 1);
      setSelectedImageIndex(visibleImageIndex + 1); // Update the large image
    } else {
      setVisibleImageIndex(0); // Reset to the beginning
      setSelectedImageIndex(0); // Reset the large image
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const largeImage = document.querySelector('.large-image');
    if (largeImage) {
      largeImage.style.setProperty('--mouse-x', `${mousePosition.x}%`);
      largeImage.style.setProperty('--mouse-y', `${mousePosition.y}%`);
    }
  }, [mousePosition]);

  const images = product.images || [];
  const visibleImages = images.slice(visibleImageIndex, visibleImageIndex + 4);
  if (visibleImages.length < 4) {
    visibleImages.push(...images.slice(0, 4 - visibleImages.length));
  }

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Fonction pour ouvrir la popup
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Fonction pour fermer la popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Tracking Page Vue (Google Tag Manager)
  useEffect(() => {
    gtag('event', 'conversion', {
      'send_to': 'AW-16883090550/zEaGCIbkxLEaEPaIvvI-',
      'value': 1.0,
      'currency': 'EUR'
    });
  }, []);

  return (
    <div className="container">

      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${product.title} - ${shop.name}`}
            description={product.description}
      />
      
      <main className='product-page'>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} />

        {isPopupVisible && (
          <div className="popup-overlay" onClick={closePopup}>
            <button class="close-popup"><i class="fas fa-times"></i></button>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[selectedImageIndex]}
                alt={product.title}
                className="popup-image"
              />
              <div className="popup-thumbnail-container">
                {visibleImages.map((image, index) => (
                  image && (
                    <img
                      key={index + visibleImageIndex}
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      onClick={() => handleImageClick(index + visibleImageIndex)}
                      className={`thumbnail ${selectedImageIndex === index + visibleImageIndex ? 'selected' : ''}`}
                    />
                  )
                ))}
                {images.length > 4 && (
                  <button className="next-button" onClick={handleNextImages}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <section className="product-hero">
        <div className="product-columns">
          <div className="product-image">
            {images[selectedImageIndex] && (
              <img
                src={images[selectedImageIndex]}
                alt={product.title}
                className="large-image"
                onMouseMove={handleMouseMove}
                onClick={openPopup}
              />
            )}
            <div className="thumbnail-container">
              {visibleImages.map((image, index) => (
                image && (
                  <img
                    key={index + visibleImageIndex}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    onClick={() => handleImageClick(index + visibleImageIndex)}
                    className={`thumbnail ${selectedImageIndex === index + visibleImageIndex ? 'selected' : ''}`}
                  />
                )
              ))}
              {images.length > 4 && (
                <button className="next-button" onClick={handleNextImages}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
          <ProductInfos data={data} product={product} handleAddToCart={handleAddToCart} buttonText={buttonText} shop={shop}/>
        </div>
      </section>

        <Reviews data={data} />
  
        <section className="product-details">
          <div className="wrapper advantages" dangerouslySetInnerHTML={{ __html: product.advantages }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.more1 }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.more2 }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.more3 }}/>
        </section>
  
        <Testimonials data={data} shop={shop} />

        <Products
          categories={categories}
          products={relatedProducts}
          title={`Nos autres ${category.title}`}
          showCategoryFilter={false}
          data={data}
          shop={shop}
        />

        <Categories title='Catégories similaires' categories={otherCategories} data={data}/>
        
      </main>
      {showBanner && (
        <div className="cta-banner">
          <div className="banner-content">
              <h3>{product.title}</h3>
              <p className="description">{product.desc.replace(/<li>/g, '').replace(/<\/li>/g, ' ⋅').replace(/<\/il>/g, '').replace(/<ul>/g, '').replace(/<\/ul>/g, '').replace(/<strong>/g, '').replace(/</strong>/g, '')}</p>
              {product.discounted ? (
                <>
                  <p className="price new color-primary">
                    {product.price.toFixed(2).replace('.', ',')} {shop.currency}
                    <span className="initial-price">{product.discounted.toFixed(2).replace('.', ',')} {shop.currency}</span>
                  </p>
                </>
              ) : (
                <p className="price">{product.price.toFixed(2).replace('.', ',')} {shop.currency}</p>
              )}
          </div>
          <article>
            <span>{data.productCtaPromo}</span>
            <button onClick={handleBuyNow}>{data.productBuyFor} {(product.price * 0.85).toFixed(2).replace('.', ',')}{shop.currency}</button>
          </article>
       </div>
      )}
      <Footer shop={shop} data={data} />
    </div>
  );

  function handleBuyNow() {
    handleAddToCart();
    window.location.href = '/checkout';
  }
}

export async function getStaticPaths() {
  // Récupération des catégories et produits depuis Supabase
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });

  // Vérification que les données sont valides
  if (!categories || !products || categories.length === 0 || products.length === 0) {
    console.error("Erreur : catégories ou produits manquants dans les données récupérées.");
    return { paths: [], fallback: false };
  }

  // Création d'un dictionnaire pour accéder rapidement aux slugs des catégories par leur ID
  const categorySlugMap = categories.reduce((map, category) => {
    map[category.id] = category.slug;
    return map;
  }, {});

  // Génération des chemins à partir des slugs des catégories et produits
  const paths = products.map(product => {
    const categorySlug = categorySlugMap[product.category_id]; // Récupération du slug de la catégorie via category_id
    if (!categorySlug) {
      console.warn(`Aucun slug trouvé pour la catégorie avec ID ${product.category_id}`);
      return null; // Ignorer les produits sans catégorie correspondante
    }
    return { 
      params: {
        category: categorySlug,
        slug: product.slug,
      },
    };
  }).filter(Boolean); // Supprimer les chemins null ou indéfinis 

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { category: categorySlug, slug } = params;

  // Récupération des catégories et produits depuis Supabase
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });

  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  // Trouver la catégorie correspondant au slug
  const category = categories.find(cat => cat.slug === categorySlug);

  if (!category) {
    return {
      notFound: true,
    };
  }

  // Trouver le produit correspondant au slug et à la catégorie
  const product = products.find(p => p.slug === slug && p.category_id === category.id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  // Produits associés (même catégorie, exclure le produit actuel)
  const relatedProducts = products.filter(
    p => p.category_id === product.category_id && p.slug !== slug
  );

  // Autres catégories (exclure la catégorie actuelle)
  const otherCategories = categories.filter(
    cat => cat.id !== category.id
  );

  return {
    props: {
      product,
      category, // Passez l'objet complet de la catégorie
      products,
      relatedProducts,
      otherCategories,
      categories,
      shop: shop[0],
      brand: brand[0],
      data: data[0],
    },
  };
}