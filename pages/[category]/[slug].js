import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import content from '../../content.json';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from '../../components/Products';
import Reviews from '../../components/Reviews';
import Categories from '../../components/Categories'; 

import ProductInfos from '../../components/ProductInfos';

import categoriesData from '../../categories.json'; 
import productsData from '../../products.json';


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

export default function ProductDetail({ product, site, products, relatedProducts, otherCategories }) {
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

  if (!product || !site) {
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

  const images = product.productImages || [];
  const visibleImages = images.slice(visibleImageIndex, visibleImageIndex + 4);
  if (visibleImages.length < 4) {
    visibleImages.push(...images.slice(0, 4 - visibleImages.length));
  }

  const discountedPrice = parseFloat(product.productPrice.replace('€', '').replace(',', '.')) * 0.85;

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Fonction pour ouvrir la popup
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Fonction pour fermer la popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };



  return (
    <div className="container">
      <Head>
        <title>{`${product.productTitle} - ${site.shopName}`}</title>
        <meta name="description" content={product.productDescription} />
        <meta property="og:image" content={product.productImages[0]} />
      </Head>
      
      <main className='product-page'>
        <Header shopName={site.shopName} keywordPlurial={site.keywordPlurial} />

        {isPopupVisible && (
          <div className="popup-overlay" onClick={closePopup}>
            <button class="close-popup"><i class="fas fa-times"></i></button>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[selectedImageIndex]}
                alt={product.productTitle}
                className="popup-image"
              />
              <div className="popup-thumbnail-container">
                {visibleImages.map((image, index) => (
                  image && (
                    <img
                      key={index + visibleImageIndex}
                      src={image}
                      alt={`${product.productTitle} ${index + 1}`}
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
                alt={product.productTitle}
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
                    alt={`${product.productTitle} ${index + 1}`}
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
          <ProductInfos product={product} discountedPrice={discountedPrice} handleAddToCart={handleAddToCart} buttonText={buttonText} site={site} />
        </div>
      </section>

        <Reviews product={product} />
  
        <section className="product-details">
          <div className="wrapper advantages" dangerouslySetInnerHTML={{ __html: product.productAdvantages }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight1 }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight2 }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight3 }}/>
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight4 }}/>   
        </section>
  
        <Products title={`Nos autres ${product.productCategoryName}`} products={relatedProducts} showCategoryFilter={false} />
        <Categories categories={otherCategories} />
      </main>
      {showBanner && (
        <div className="cta-banner">
          <div className="banner-content">
              <h3>{product.productTitle}</h3>
              <p className='price'>{product.productPrice}</p>

          </div>
          <button onClick={handleBuyNow}>Acheter pour {discountedPrice.toFixed(2)}€ </button>
       </div>
      )}
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );

  function handleBuyNow() {
    handleAddToCart();
    window.location.href = '/paiement';
  }
}

export async function getStaticPaths() {
  const paths = productsData.products.map(product => ({
    params: { 
      category: product.productCategorySlug, // Inclure la catégorie
      slug: product.slug 
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { category, slug } = params;

  const product = productsData.products.find(p => p.slug === slug && p.productCategorySlug === category);
  const site = content.sites[0];
  const products = productsData.products.filter(p => p.siteId === site.id);
  const relatedProducts = productsData.products.filter(
    p => p.productCategorySlug === category && p.slug !== slug
  );

  const otherCategories = categoriesData.categories.filter(
    (cat) => cat.slug !== category // Exclure la catégorie actuelle
  );

  return {
    props: {  
      product: product || null,
      site: site || null,
      products,
      relatedProducts,
      otherCategories,
    },
  };
}