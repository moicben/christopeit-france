import React from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProductInfos({ product, handleAddToCart, buttonText, shop }) {
  const handleBuyNow = () => {
    //vider le panier actuel :
    localStorage.setItem('cart', JSON.stringify([]));
    handleAddToCart();
    window.location.href = '/paiement';
  };
  

  const getDeliveryDate = (deliveryType) => {
    const today = new Date();
    let deliveryDays;
    if (deliveryType === 'Express') {
      deliveryDays = 4;
    } else if (deliveryType === 'Fast') {
      deliveryDays = 5;
    } else if (deliveryType === 'Normal') {
      deliveryDays = 6;
    } else {
      return '';
    }
    const deliveryDate = addDays(today, deliveryDays);
    return format(deliveryDate, 'EEE dd MMM', { locale: fr });
  };

  return (
    <div className={`product-info ${product.bestseller ? 'best-seller' : ''}`}>
      <span className='best-wrap bg-main'>🏆 TOP VENTE</span>
      <h1>{product.title}</h1>
      {product.discounted ? (
        <>
          <p className="product-price new">
            {product.price},00 €
            <span className="initial-price">{product.discounted},00 €</span>
          </p>
        </>
      ) : (
        <p className="product-price">{product.price}</p>
      )}
      <p className={`stock ${product.stock.startsWith('Plus que') ? 'low' : ''}`}>
        <span>⋅</span>{product.stock} {product.stock.startsWith('Plus que') ? 'en stock' : ''}
      </p>
      <p className='delivery'>Livraison estimée : {getDeliveryDate(product.delivery)}</p>
      <div
        className="product-description"
        dangerouslySetInnerHTML={{ __html: product.desc }}
      />

      <article className="purchase-row">
        <p className="comptor">PROMO FIN-MARS 15%</p>
        <button className="buy-now" onClick={handleBuyNow}>
          Acheter pour {product.discounted},00€
        </button>
        <button onClick={handleAddToCart}>{buttonText}</button>
      </article>

      <ul className="product-badges">
        <li>
          <i className="fas fa-shield-alt"></i>
          <span>
            Retour offert<br></br> 60 jours
          </span>
        </li>
        <li>
          <i className="fas fa-award"></i>
          <span>
            Garantie <br></br> 2 ans
          </span>
        </li>
        <li>
          <i className="fas fa-shipping-fast"></i>
          <span>
            Livraison<br></br> gratuite
          </span>
        </li>
        <li>
          <i className="fas fa-box-open"></i>
          <span>
            Expédié <br></br>sous 48h
          </span>
        </li>
      </ul>
      
      {/* <div className="gift-container">
        <div className="cover"></div>
        <h4>JOYEUSE ANNÉE 2025 !</h4>
        <h5>AVEC {shop.name.toUpperCase()}</h5>
        <p>
          - 15% de réduction avec le code "<strong>YEAR15</strong>"
        </p>
        <p>- Livraison gratuite sans minimum d'achat</p>
        <p>- Retours étendus jusqu'au 14/03/2025 </p>
      </div> */}
      <div className='carousels-container'>
        <details >
          <summary>Détails techniques du produit</summary>
          <div
            className="product-content"
            dangerouslySetInnerHTML={{ __html: product.details }}
          />
        </details>
        <details >
          <summary>Livraison, garantie et retours</summary>
          <div className="product-content guarantee">
            <span>Moyens de paiement :</span> cartes bancaires (Visa, MasterCard,
            AMEX), PayPal ou virement bancaire, sécurisé par protocol SSL.
            <br />
            <br />
            <span>Expédition :</span> les commandes sont expédiées sous 24 à 48h
            ouvrées avec un suivi en temps réel.
            <br />
            <br />
            <span>Suivi :</span> les délais de livraison varient entre 2 et 5
            jours ouvrés selon votre localisation. Vous recevrez par mail un
            numéro de suivi dès l’expédition.
            <br />
            <br />
            <span>Retours :</span> <b>Si un équipement ne vous convient pas, vous
            disposez de 60 jours après réception pour le retourner gratuitement</b>.
            Une fois le colis retourné, nous procédons au remboursement sous 2 jours ouvrés.
            <br />
            <br />
            <span>Garantie :</span> <b>Tous nos équipements sont couverts par la garantie constructeur
            pendant 2 ans, suite à la date d'achat.</b> Prenant en charge tout défaut de fabrication et disfonctionnement.
            <br />
            <br />
            <span>Support :</span> Disponible 7j/7 via formulaire en ligne ou par
            mail à support@{shop.domain}
            <br />
            <br />
          </div>
        </details>
      </div>
    </div>
  );
}