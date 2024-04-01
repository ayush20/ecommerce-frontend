import numeral from "numeral";
const multiCurrency = (price) => {
    const MultiCurrencySession = localStorage.getItem("MULTI_CURRENCY");
    const parsedMultiCurrencySession = MultiCurrencySession ? JSON.parse(MultiCurrencySession) : {};
    let afterPrice = 0;
    let format = '0,0.00';
    /* if (parsedMultiCurrencySession) {
        afterPrice = price / parsedMultiCurrencySession.cr_rate;
        if(parsedMultiCurrencySession.cr_decimal === 0){
            format = '0,0';
        }else if(parsedMultiCurrencySession.cr_decimal === 1){
            format = '0,0.0';
        }else if(parsedMultiCurrencySession.cr_decimal === 2){
            format = '0,0.00';
        }else if(parsedMultiCurrencySession.cr_decimal === 3){
            format = '0,0.000';
        }
        afterPrice = parsedMultiCurrencySession.cr_symbol + numeral(afterPrice).format(format); 
        afterPrice = '₹'+ numeral(price).format(format);
    } */
    afterPrice = '₹'+ numeral(price).format(format);
    return afterPrice;
  };
  
  export default multiCurrency;
  