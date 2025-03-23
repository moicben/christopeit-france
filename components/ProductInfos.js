import React from 'react';

export default function ProductInfos({ product, discountedPrice, handleAddToCart, buttonText, site }) {
  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/paiement';
  };

  return (
    <div className="product-info">
      <h1>{product.productTitle}</h1>
      {product.productDiscounted ? (
        <>
          <p className="product-price new">
            {product.productPrice}
            <span className="initial-price">{product.productDiscounted}</span>
          </p>
        </>
      ) : (
        <p className="product-price">{product.productPrice}</p>
      )}
      <div
        className="product-description"
        dangerouslySetInnerHTML={{ __html: product.productDescription }}
      />

      <article className="purchase-row">
        <p className="comptor">PROMO FIN-MARS 15%</p>
        <button className="buy-now" onClick={handleBuyNow}>
          Acheter pour {discountedPrice.toFixed(2)}€
        </button>
        <button onClick={handleAddToCart}>{buttonText}</button>
      </article>
      <ul className="product-features">
        <li>
          <span>
            <i className="fas fa-lock"></i>Paiement Sécurisé
          </span>
          <img src="/card-badges.png" alt={"paiement " + site.keyword} />
        </li>
        <li>
          <span>
            <i className="fas fa-check"></i>En stock, expédié sous 24/48h
          </span>
        </li>
        <li>
          <span>
            <i className="fas fa-truck"></i>Livraison Suivie OFFERTE
          </span>
        </li>
      </ul>
      <div className="gift-container">
        <div className="cover"></div>
        <h4>JOYEUSE ANNÉE 2025 !</h4>
        <h5>AVEC {site.shopName.toUpperCase()}</h5>
        <p>
          - 15% de réduction avec le code "<strong>YEAR15</strong>"
        </p>
        <p>- Livraison gratuite sans minimum d'achat</p>
        <p>- Retours étendus jusqu'au 14/03/2025 </p>
      </div>
      <details>
        <summary>Détails techniques du produit</summary>
        <div
          className="product-content"
          dangerouslySetInnerHTML={{ __html: product.productDetails }}
        />
      </details>
      <details>
        <summary>Paiement, livraison et retours</summary>
        <div className="product-content">
          <span>Moyen de paiement :</span> cartes bancaires (Visa, MasterCard,
          AMEX), PayPal et virement bancaire.
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
          <span>Retours :</span>Si un équipement ne vous convient pas, vous
          disposez de 60 jours après réception pour le retourner gratuitement.
          Une fois le colis reçu en parfait état, nous procédons au remboursement
          sous 2 à 5 jours ouvrés.
          <br />
          <br />
          <span>Support :</span> Disponible 7j/7 via formulaire en ligne ou par
          mail à support@christopeit-france.shop
          <br />
          <br />
        </div>
      </details>
    </div>
  );
}