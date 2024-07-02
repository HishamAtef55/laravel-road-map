// update value to decimal if not decimal (5 => 5.00)
const toDecimal = amount => {
  return amount % 1 ? amount : +`${amount}.00`;
};

const getRandomNum = () => Math.round(Math.random() * 10000000000);

const getPrice = (price, currency) => {
  let newPrice = +price;
  return `${newPrice.toFixed(2)}${currency ? ` ${currency}` : ""}`;
};

function getAmountPercent(amount, discount) {
  return getPrice(amount - (discount / 100) * amount);
}
