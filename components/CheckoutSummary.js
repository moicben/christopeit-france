import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const CheckoutSummary = ({ cart, totalPrice, discount, discountedPrice, site, paymentFees, deliveryEstimate }) => {

  if (cart[0]){
    console.log('cart:', cart[0].productDelivery);
  }
  
  

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
    return format(deliveryDate, 'EEEE d MMMM', { locale: fr });
  };


  return (
    <>
      <div className="shop-info">
        <h2>{`Montant à régler`}</h2>
        <h1>{`${parseFloat(discountedPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</h1>
      </div>
      <div className="cart-summary">
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <div className="cart-item">
                <h4>{item.productTitle}</h4>
                <p className='quantity'>(x{item.quantity})</p>
                <p>{`${parseFloat(item.productPrice.replace('€', '').replace(',', '.')).toFixed(2).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-item discount">
          <h4>CODE PROMO : <input value=' MARS15'/></h4>
          <p className='quantity'>15%</p>
          <p>{`-${parseFloat(discount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
        </div>
        <div className="cart-item discount">
          <h4>Livraison estimiée :</h4>
          <p className='quantity delivery'>{cart[0] && getDeliveryDate(cart[0].productDelivery)}</p>
          <p>OFFERT</p>
        </div>
        <div className="cart-item subtotal">
          <h4>Avant-réduction</h4>
          <p>{`${parseFloat(totalPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
        </div>

        <div className="total-price">
          <h4>Total dû :</h4>
          <p>{`${parseFloat(discountedPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
        </div>
      </div>
      <p className='secure footer'>© Tous droits réservés -  {site.shopName} SAS 32455</p>
    </>
  );
};

export default CheckoutSummary;