import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Confirmation() {
  const router = useRouter();
  const { commande: orderId } = router.query;

  useEffect(() => {
    // Vider le panier à l'arrivée sur la page
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="confirmation-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2>Commande #{orderId} confirmée</h2>
      <p>
        Merci pour votre commande <strong>#{orderId}</strong> sur notre boutique,
        <br />
        Comptez 2 jours ouvrés pour son traitement et son expédition.
        <br />
        Vous recevrez sous peu, un suivi de livraison par mail.
      </p>
      <a href="/"><button type="button">Retourner à la boutique</button></a>
    </div>
  );
}