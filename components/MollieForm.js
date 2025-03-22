import { useEffect, useRef } from 'react';

const MollieForm = ({ amount, orderNumber, onBack, formData, cart }) => {
  const formContainerRef = useRef(null);

  useEffect(() => {
    if (!formContainerRef.current) return;

    const existingScript = document.querySelector('script[src="https://js.mollie.com/v1/mollie.js"]');
    if (existingScript) {
      initializeMollieForm();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.mollie.com/v1/mollie.js';
    script.async = true;
    script.onload = initializeMollieForm;
    document.body.appendChild(script);

    return () => {
      if (formContainerRef.current) formContainerRef.current.innerHTML = '';
    };
  }, [amount, orderNumber]);

  const initializeMollieForm = () => {
    if (!formContainerRef.current) return;

    formContainerRef.current.innerHTML = '';
    const mollie = Mollie('pfl_HaPLTnNWCo', { locale: 'fr_FR', testmode: false });

    const options = {
      styles: {
        base: { color: '#666', fontSize: '.9rem', '::placeholder': { color: '#999' } },
        valid: { color: '#111' },
      },
    };

    const cardHolder = mollie.createComponent('cardHolder', options);
    const cardNumber = mollie.createComponent('cardNumber', options);
    const expiryDate = mollie.createComponent('expiryDate', options);
    const verificationCode = mollie.createComponent('verificationCode', options);

    const form = document.createElement('form');
    form.id = 'mollie-form';
    form.action = '/api/create-payment';
    form.method = 'POST';

    const createFormElement = (id, labelText) => {
      const container = document.createElement('div');
      container.style.marginBottom = '1rem';

      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = labelText;
      Object.assign(label.style, {
        color: '#111',
        fontWeight: '400',
        fontSize: '14px',
        margin: '0.5rem 0.25rem',
        display: 'block',
      });

      const div = document.createElement('div');
      div.id = id;
      Object.assign(div.style, {
        padding: '0.6rem 1rem .8rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
      });

      container.appendChild(label);
      container.appendChild(div);
      return container;
    };

    form.appendChild(createFormElement('card-number', 'Numéro de carte'));
    form.appendChild(createFormElement('card-holder', 'Titulaire de la carte'));

    const createExpiryAndCVVRow = () => {
      const formRow = document.createElement('div');
      formRow.className = 'form-row';
      Object.assign(formRow.style, { display: 'flex', gap: '1rem', marginBottom: '-1rem' });

      const expiryDateContainer = createFormElement('expiry-date', 'Date d\'expiration');
      expiryDateContainer.style.flex = '1';

      const verificationCodeContainer = createFormElement('verification-code', 'CVV');
      verificationCodeContainer.style.flex = '1';

      formRow.appendChild(expiryDateContainer);
      formRow.appendChild(verificationCodeContainer);
      return formRow;
    };

    form.appendChild(createExpiryAndCVVRow());

    const amountInput = document.createElement('input');
    amountInput.type = 'hidden';
    amountInput.name = 'amount';
    amountInput.value = amount;

    const orderInput = document.createElement('input');
    orderInput.type = 'hidden';
    orderInput.name = 'orderNumber';
    orderInput.value = orderNumber;

    form.appendChild(amountInput);
    form.appendChild(orderInput);

    const article = document.createElement('article');
    article.className = 'checkout-buttons';

    const backButton = document.createElement('button');
    backButton.className = 'back-checkout';
    backButton.type = 'button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.onclick = () => onBack && onBack();

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Procéder au paiement';

    article.appendChild(backButton);
    article.appendChild(submitButton);
    form.appendChild(article);

    formContainerRef.current.appendChild(form);

    cardHolder.mount('#card-holder');
    cardNumber.mount('#card-number');
    expiryDate.mount('#expiry-date');
    verificationCode.mount('#verification-code');

    // Handle form submission
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
    
      try {
        const { token } = await mollie.createToken();
        console.log('Generated cardToken:', token); // Debugging cardToken
        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardToken: token,
            amount,
            orderNumber,
            email: formData.email, // Ajouter l'email
            phone: formData.phone, // Ajouter le téléphone
            name: formData.fullName, // Ajouter le nom complet
            address: formData.address, // Ajouter l'adresse
            cart: cart, // Ajouter le panier
          }),
        });
    
        const result = await response.json();
        console.log('Payment API response:', result); // Debugging API response
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl; // Redirige vers l'URL de paiement
        } else {
          alert('Erreur lors de la création du paiement.');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue.');
      }
    });
  };

  return <div ref={formContainerRef}></div>;
};

export default MollieForm;