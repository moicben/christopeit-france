import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const CheckoutSummary = ({ cart, totalPrice, discount, discountedPrice, name, paymentFees, deliveryEstimate, data, shop }) => {

  if (cart){
    console.log('cart:', cart.delivery);
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
        <h2>{data.checkoutPayLabel}</h2>
        <h1 className='color-primary'>{`${(cart.reduce((total, item) => total + item.price * item.quantity, 0) * (1 - `.${data.checkoutPromoRate}`)).toLocaleString(shop.language, { minimumFractionDigits: 2 })} ${shop.currency}`}</h1>
      </div>
      <div className="cart-summary">
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <div className="cart-item">
                <h4>{item.title}</h4>
                <p className='quantity'>(x{item.quantity})</p>
                <p>{item.price.toLocaleString(shop.language, { minimumFractionDigits: 2 })} {shop.currency}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-item discount">
          <h4>{data.checkoutPromoLabel} <input value={data.checkoutPromoCode}/></h4>
          <p className='quantity'>{data.checkoutPromoRate}%</p>
          <p>{`-${(cart.reduce((total, item) => total + item.price * item.quantity, 0) * `.${data.checkoutPromoRate}`).toLocaleString(shop.language, { minimumFractionDigits: 2 })} ${shop.currency}`}</p>
        </div>
        <div className="cart-item discount">
          <h4>{data.productDeliveryLabel}</h4>
          <p className='quantity delivery'>{cart[0] && getDeliveryDate(cart[0].delivery)}</p>
          <p>{data.checkoutFreeLabel}</p>
        </div>
        <div className="cart-item subtotal">
          <h4>{data.checkoutBeforePromo}</h4>
          <p>{`${cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString(shop.language, { minimumFractionDigits: 2 })} ${shop.currency}`}</p>
        </div>

        <div className="total-price">
          <h4>{data.cartTotal}</h4>
          <p>{`${(cart.reduce((total, item) => total + item.price * item.quantity, 0) * (1 - `.${data.checkoutPromoRate}`)).toLocaleString(shop.language, { minimumFractionDigits: 2 })} ${shop.currency}`}</p>
        </div>
      </div>
      <p className='secure footer'>2025 © {data.footerCopyright} - {name} INC. 32455</p>
    </>
  );
};

export default CheckoutSummary;