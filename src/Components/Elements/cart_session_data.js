const sessionCartData = () => {
  const addressSession = localStorage.getItem("ADDRESS_SESSION");
  const parsedAddressSession = addressSession ? JSON.parse(addressSession) : {};

  const couponSession = localStorage.getItem("COUPON_SESSION");
  const parsedCouponSession = couponSession ? JSON.parse(couponSession) : {discount_amount: 0.0,
    promo_id: 0,
    promo_code: "",
    cart_amount: 0.0,
  };

  const cartSession = localStorage.getItem("CART_SESSION");
  const parsedCartSession = cartSession ? JSON.parse(cartSession) : [];
  const parsedCartSummary = {
    itemTotal: 0,
    discount: 0,
    total_amount: 0,
    shipping_charge: 0,
  };
  const discountAmount = parsedCouponSession.discount_amount !== undefined && parsedCouponSession.discount_amount !== null && !isNaN(parsedCouponSession.discount_amount) && parsedCouponSession.discount_amount !== ''
    ? Number(parsedCouponSession.discount_amount)
    : 0;

  parsedCartSession.forEach((value) => {
    parsedCartSummary.itemTotal = parsedCartSession.reduce(
      (total, cartItem) => total + cartItem.product_price * cartItem.quantity,
      0
    );
    parsedCartSummary.discount = parsedCartSession.reduce(
      (total, cartItem) =>
        total +
        (cartItem.product_price - cartItem.product_selling_price) *
          cartItem.quantity,
      0
    );
  });
  parsedCartSummary.total_amount =  Number(parsedCartSummary.itemTotal) -  Number(parsedCartSummary.discount) -  discountAmount;

  const recentlyProductsSession = localStorage.getItem("RECENTLY_VIEWED");
  const parsedRecentlyProductsSession = recentlyProductsSession ? JSON.parse(recentlyProductsSession) : [];


  const dataArr = [
    parsedAddressSession,
    parsedCartSession,
    parsedCouponSession,
    parsedCartSummary,
    parsedRecentlyProductsSession,
  ];

  return dataArr;
};

export default sessionCartData;
