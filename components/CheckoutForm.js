import React, { useRef, useEffect, useState } from 'react';
import CheckoutVerify from './CheckoutVerify';
import MollieForm from './MollieForm';
import Cookies from 'js-cookie'; // Importer la bibliothèque js-cookie

const CheckoutForm = ({ currentStep, showStep, selectedPaymentMethod, setSelectedPaymentMethod, proceedCheckout, discountedPrice, cart, site, showVerificationWrapper, setShowVerificationWrapper, orderNumber, onBack }) => {
  const expiryDateRef = useRef(null);
  const cardNumberRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    suite: '',
    postalCode: '',
    city: '',
    email: '',
    fullName: '',
    phone: '',
  });

  // Charger les données des cookies au rechargement de la page
  useEffect(() => {
    const savedData = Cookies.get('checkoutFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGlobalError('');
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value) {
        delete newErrors[name];
      } else {
        newErrors[name] = `${name} est obligatoire`;
      }
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const errors = {};
    const requiredFields = ['address', 'postalCode', 'city', 'email', 'fullName', 'phone'];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value) {
        errors[field] = `${field} est obligatoire`;
        console.log(`${field} est obligatoire`);
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (step) => {
    if (step === 1 && !validateStep(step)) {
      setGlobalError('Transmettez-vos informations de livraison avant de payer.');
      return;
    }

    // Enregistrer les données dans les cookies
    Cookies.set('checkoutFormData', JSON.stringify(formData), { expires: 1 }); // Expire dans 1 jour

    setGlobalError('');
    showStep(step);
  };

  const handleRetry = () => {
    setShowVerificationWrapper(false);
    showStep(1); // Retour à l'étape du choix de modes de paiement
  };

  return (
    <form className="checkout-form" onSubmit={proceedCheckout}>
      <input type="hidden" name="totalPrice" value={discountedPrice} />
      <input type="hidden" name="products" value={cart.map((item) => `${item.productTitle} (x${item.quantity})`).join(', ')} />
      <input type="hidden" name="website" value={site.shopName} />

      <div className={`checkout-step ${currentStep === 0 ? 'active' : ''}`}>
        <h3>Informations de livraison</h3>
        <input
          type="text"
          name="address"
          placeholder="Adresse du domicile"
          value={formData.address}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="suite"
          placeholder="Maison, suite, numéro, etc. (optionnel)"
          value={formData.suite}
          onChange={handleInputChange}
        />
        <div className="form-row">
          <input
            type="text"
            name="postalCode"
            placeholder="Code postal"
            value={formData.postalCode}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <h3>Compte client</h3>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <div className="form-row">
          <input
            type="text"
            name="fullName"
            placeholder="Nom complet"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Numéro de téléphone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" id="delivery-checkout" onClick={() => handleNextStep(1)}>
          Passer au paiement
        </button>
        {globalError && <p className="error">{globalError}</p>}
      </div>

      <div className={`checkout-step ${currentStep === 1 ? 'active' : ''}`}>
        <h3 className="method">Moyen de paiement</h3>
        <label className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={selectedPaymentMethod === 'card'}
            onChange={() => setSelectedPaymentMethod('card')}
          />
          <img className="card" src="/card-badges.png" alt="cartes bancaires" />
          <span>Cartes bancaires</span>
        </label>
        <label className={`payment-method ${selectedPaymentMethod === 'bankTransfer' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="bankTransfer"
            checked={selectedPaymentMethod === 'bankTransfer'}
            onChange={() => setSelectedPaymentMethod('bankTransfer')}
          />
          <img src="/virement.png" className="transfer" alt="virement bancaire" />
          <span>Virement bancaire</span>
        </label>
        <label className={`unvalaible payment-method ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={selectedPaymentMethod === 'paypal'}
            onChange={() => setSelectedPaymentMethod('paypal')}
          />
          <img src="/paypal-simple.png" alt="cartes bancaires" />
          <span>Indisponible</span>
        </label>
        <article className="checkout-buttons">
          <button className="back-checkout" type="button" onClick={() => showStep(0)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button type="button" id="payment-checkout" onClick={() => handleNextStep(2)}>
            Confirmer
          </button>
        </article>
        {globalError && <p className="error">{globalError}</p>}
      </div>

      <div className={`checkout-step ${currentStep === 2 ? 'active' : ''}`}>
        {selectedPaymentMethod === 'card' && (
          <>
            <h3>Payer par carte bancaire</h3>
            <p className="paiement">
               Entrez vos informations de paiement :
            </p>
            <MollieForm
              amount={discountedPrice}
              orderNumber={orderNumber}
              onBack={onBack}
              formData={formData} // Passer les données du formulaire
              cart={cart} // Passer le panier
            />
            <a target='_blank' href='https://www.mollie.com/fr/growth/securite-paiements-en-ligne' className='safe-payment'><i className="fas fa-lock"></i>Paiement sécurisé et crypté avec <img src='/mollie.png'/></a>
          </>
        )}

        {selectedPaymentMethod === 'bankTransfer' && (
          <>
            <h3>Payer par virement bancaire</h3>
            <p>Utlisez les informations suivantes :</p>
            <div className="iban-group">
              <p><strong>Titulaire du compte : </strong>{site.shopName} SAS</p>
              <p><strong>IBAN : </strong>FR76 1732 8844 0083 5771 1473 496</p>
              <p><strong>BIC/SWIFT : </strong>SWNBFR22</p>
              <p><strong>Objet :</strong> Commande 182F57</p>
              <p className='amount'><strong>Montant :</strong> {discountedPrice}€</p>
            </div>
            <p className='smaller'>Une fois le virement effectué, cliquez ci-dessous pour recevoir la confirmation et le suivi de commande.</p>
            <article className='checkout-buttons'>
              <button className="back-checkout" type="button" onClick={() => showStep(1)}><i className="fas fa-arrow-left"></i></button>
              <button onClick={() => window.location.href = '/confirmation'}>Suivre ma commande</button>
          </article>
          </>
        )}

        {globalError && <p className="error">{globalError}</p>}
      </div>

      {showVerificationWrapper && (
        <CheckoutVerify
          verificationError={false}
          bankName="Bank Name"
          bankLogo="/path/to/logo.png"
          cardType="Visa"
          cardScheme="Credit"
          cardCountry="France"
          discountedPrice={discountedPrice}
          onRetry={handleRetry}
        />
      )}
    </form>
  );
};

export default CheckoutForm;