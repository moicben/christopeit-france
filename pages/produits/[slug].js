import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import content from '../../content.json';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from '../../components/Products';
import productsData from '../../products.json';
import Reviews from '../../components/Reviews';

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
      'value': 5.0,
      'currency': 'EUR',
      'event_callback': callback
  });

  // Compte 2
  gtag('event', 'conversion', {
      'send_to': 'AW-16915371402/K1GaCLyT2KcaEIqr8IE_',
      'value': 5.0,
      'currency': 'EUR',
      'event_callback': callback
  });
  return false;
}

export default function ProductDetail({ product, site, products, relatedProducts }) {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const cartDrawer = document.querySelector('.cart-drawer');
      // if (cartDrawer && cartDrawer.contains(event.target)) {
      //   cartDrawer.classList.add('open');
      // } else {
      //   cartDrawer.classList.remove('open');
      // }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      // Si le produit est déjà dans le panier, augmenter la quantité
      cart[productIndex].quantity += quantity;
    } else {
      // Sinon, ajouter le produit avec la quantité spécifiée
      const productWithQuantity = { ...product, quantity };
      cart.push(productWithQuantity);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Changer le texte du bouton
    setButtonText('Ajouté !');
    setTimeout(() => setButtonText('Ajouter au panier'), 3000);
    // Ouvrir le drawer du panier
    document.querySelector('.cart-container').click();

    // Call the conversion tracking function
    gtag_report_conversion();
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

  return (
    <div className="container">
      <Head>
        <title>{`${product.productTitle} - ${site.shopName}`}</title>
      </Head>
      
      <main>
        <Header shopName={site.shopName} keywordPlurial={site.keywordPlurial} />
        
        <section className="product-hero">
        <div className="product-columns">
          <div className="product-image">
            {images[selectedImageIndex] && (
              <img
                src={images[selectedImageIndex]}
                alt={product.productTitle}
                className="large-image"
                onMouseMove={handleMouseMove}
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
          <div className="product-info">
            <h1>{product.productTitle}</h1>
              {product.productDiscounted ? (
                <>
                  <p className='product-price new'>{product.productPrice}<span className='initial-price'>{product.productDiscounted}</span></p>
                </>
              ) : (
                <p className="product-price">{product.productPrice}</p>
              )}
            <div className="product-description" dangerouslySetInnerHTML={{ __html: product.productDescription }} />

            <article className="purchase-row">
                <p className='comptor'>PLUS QUE {formatTime(timeLeft)}</p>
                <button className='buy-now' onClick={handleBuyNow}>Acheter maintenant<span className='notice'>POUR {discountedPrice.toFixed(2)}€</span></button>
                <button onClick={handleAddToCart}>{buttonText}</button>
            </article>
            <ul className='product-features'>
              <li>
                <span><i className="fas fa-lock"></i>Paiement Sécurisé</span><img src='/card-badges.png' alt={"paiement " + site.keyword} />
              </li>
              <li>
                <span><i className="fas fa-check"></i>En stock, expédié sous 24/48h</span>
              </li>
              <li>
                <span><i className="fas fa-truck"></i>Livraison Suivie OFFERTE</span>
              </li>
            </ul>
            <div className='gift-container'>
              <div className='cover'></div>
                <h4>JOYEUSE ANNÉE 2025 !</h4>
                <h5>AVEC {site.shopName.toUpperCase()}</h5>
                <p>- 15% de réduction avec le code "<strong>YEAR15</strong>"</p>
                <p>- Livraison gratuite sans minimum d'achat</p>
                <p>- Retours étendus jusqu'au 14/03/2025 </p>
            </div>
            <details>
              <summary>Détails techniques du produit</summary>
              <div className="product-content" dangerouslySetInnerHTML={{ __html: product.productDetails }} />
            </details>
            <details>
              <summary>Paiement, livraison et retours</summary>
              <div className="product-content">
                <span>Moyen de paiement :</span> cartes bancaires (Visa, MasterCard, AMEX), PayPal et virement bancaire.
                <br /><br />
                <span>Expédition :</span> les commandes sont expédiées sous 24 à 48h ouvrées avec un suivi en temps réel.
                <br /><br />
                <span>Suivi :</span> les délais de livraison varient entre 2 et 5 jours ouvrés selon votre localisation. Vous recevrez par mail un numéro de suivi dès l’expédition.
                <br /><br />
                <span>Retours :</span>Si un équipement ne vous convient pas, vous disposez de 60 jours après réception pour le retourner gratuitement. Une fois le colis reçu en parfait état, nous procédons au remboursement sous 2 à 5 jours ouvrés.
                <br /><br />
                <span>Support :</span> Disponible 7j/7 via formulaire en ligne ou par mail à support@christopeit-france.shop
                <br /><br />
              </div>
            </details>
          </div>
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
      </main>
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
    params: { slug: product.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = productsData.products.find(p => p.slug === params.slug);
  const site = content.sites[0];
  const products = productsData.products.filter(p => p.siteId === site.id);
  const relatedProducts = productsData.products.filter(p => p.productCategorySlug === product.productCategorySlug && p.slug !== product.slug);

  return {
    props: {  
      product: product || null,
      site: site || null,
      products,
      relatedProducts,
    },
  };
}