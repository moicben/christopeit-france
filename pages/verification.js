import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Verification() {
  const router = useRouter();
  const { orderNumber } = router.query; // Récupère le numéro de commande depuis l'URL
  const [status, setStatus] = useState('pending'); // Statut initial

  useEffect(() => {
    if (!orderNumber) return; // Attendre que `orderNumber` soit disponible

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/get-order-status?orderNumber=${orderNumber}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (data.status === 'paid') {
          router.push(`/confirmation?commande=${orderNumber}`);
        } else if (data.status === 'failed') {
          router.push(`/paiement?failed=true`);
        } else {
          console.log(`Statut actuel: ${data.status}`);
          setStatus(data.status); // Met à jour le statut affiché
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
      }
    };

    const interval = setInterval(checkOrderStatus, 5000); // Vérifie toutes les 5 secondes
    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage du composant
  }, [orderNumber, router]);

  return (
    <div className="confirmation-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2>Vérification du paiement</h2>
      <p>Nous vérifions votre paiement, cela peut prendre quelques minutes.</p>
      <p>Statut actuel : {status}</p>
      <div className="loader"></div>
    </div>
  );
}