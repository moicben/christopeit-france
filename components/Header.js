import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaRegTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import ReviewsBadge from './ReviewsBadge';

const Header = ({ name, domain, logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const cartDrawerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (isCartOpen) {
      // Attendre que le composant soit monté pour ajouter la classe
      setTimeout(() => cartDrawer.classList.add('open'), 25);
    } else {
      //cartDrawer.classList.remove('open');
    }
  }, [isCartOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const nav = document.querySelector('.header .nav ul');
    if (!isMenuOpen) {
      nav.classList.add('open');
    } else {
      nav.classList.remove('open');
    }
  };

  const getUserLocation = async () => {
    try {
      const responseIp = await fetch('https://api.ipify.org?format=json');
      const dataIp = await responseIp.json();

      const responseLocation = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_8RkVQJkGontjhO0cL3O0AZXCX17Y2&ipAddress=${dataIp.ip}`);
      const dataLocation = await responseLocation.json();
      
      return dataLocation;

    } catch (error) {
      console.error('Error fetching IP:', error);
      return null;
    }
  };

  const toggleCart = async () => {
    setIsCartOpen(!isCartOpen);
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  };

  useEffect(() => {
    // Applique display none à : #__EAAPS_PORTAL>div>div>div.Window__Container-sc-251c030e-0.iKEatB a
    const element = document.querySelector('#__EAAPS_PORTAL>div>div>div.Window__Container-sc-251c030e-0.iKEatB a');
    if (element) {
      element.style.display = 'none';
    }
  }, []);

  const handleCheckout = async () => {
    
    router.push('/paiement');
  };

  

  return (
    <>
    
      <script src="https://static.elfsight.com/platform/platform.js" async></script>
      <div class="elfsight-app-ff817ebe-8d94-42a7-a8d9-ace1c29d4f7a" data-elfsight-app-lazy></div>
      
      {/* <section className="sub">
        -15% sur nos équipements code : <span style={{ fontWeight: 500 }}>mars15</span> &nbsp;|&nbsp; Livraison sous 2 à 5 jours ouvrés &nbsp;|&nbsp; support disponible 7j/7
      </section> */}
      <header className="header">
        <div className='wrapper'>
          <a className="logo-header" href="/"><img src={logo} alt="Logo"/></a>
          <nav className="nav">
            <ul>
              <li><a href="/tous-les-equipements">équipements</a></li>
              <li><a href="/bestsellers">Bestsellers</a></li>
              <li><a href="/tapis-roulants">tapis</a></li>
              <li><a href="/velos-appartement">Vélos</a></li>
              <li><a href="/rameurs">Rameurs</a></li>
              <li className="dropdown">
                <a className='color-primary' href="#"><i className='fas fa-info border-primary'></i>{name}</a>
                <ul className="dropdown-menu">
                  <li><a href="/a-propos">Notre histoire</a></li>
                  
                  <li><a href="/blog">Blog & Guides</a></li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // Empêche le comportement par défaut du lien
                        const badgeImage = document.querySelector("section.badge-container > img");
                        if (badgeImage) {
                          badgeImage.click(); // Simule un clic sur l'image
                        }
                      }}
                    >
                      Avis clients
                    </a>
                  </li>
                  <li><a href="/contact">contact</a></li>
                  <li><a href="/faq">FAQ</a></li>
                </ul>
              </li>
            </ul>
          </nav>
          <div className="cart-container" onClick={toggleCart}>
            <FaShoppingCart className="cart-icon" />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
          <span className="burger-icon" onClick={toggleMenu}>{isMenuOpen ? <FaTimes /> : <FaBars />} </span>
        </div>
      </header>
      {isCartOpen && (
        <div className="cart-drawer" ref={cartDrawerRef}>
          <h2>Panier</h2>
          {cart.length === 0 ? (
            <p>Votre panier est vide</p>
          ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <img src={item.productImages[0]} alt={item.productTitle} />
                <div>
                  <h3>{item.productTitle}</h3>
                  <p>{item.productPrice}</p>
                  <div className="quantity-selector">
                    <button onClick={() => handleQuantityChange(index, item.quantity > 1 ? item.quantity - 1 : 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                  </div>
                  <button className="delete" onClick={() => handleRemoveFromCart(index)}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="total">
            <h4>Total dû :</h4>
            <p>{cart.reduce((total, item) => total + parseFloat(item.productPrice.replace('€', '').replace(',', '.')) * item.quantity, 0).toFixed(2)} €</p>
        </div>
        <button className="close" onClick={toggleCart}>+</button>
        <button className="checkout" onClick={handleCheckout}>Passer commande</button>
      </div>
        )}

      <section className="badge-container">
          <ReviewsBadge domain={domain} logo={logo}/>
      </section>
    </>
  );
};

export default Header;