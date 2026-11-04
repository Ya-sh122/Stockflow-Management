// low stock rule lives here so dashboard and product list always agree

function effectiveThreshold(product, orgDefault) {
  if (product.lowStockThreshold === null || product.lowStockThreshold === undefined) {
    return orgDefault;
  }
  return product.lowStockThreshold;
}

function isLowStock(product, orgDefault) {
  return product.quantityOnHand <= effectiveThreshold(product, orgDefault);
}

// add threshold and isLowStock to every product before sending to react
function withStockStatus(products, orgDefault) {
  return products.map((product) => {
    const plain = product.toJSON ? product.toJSON() : product;
    return {
      ...plain,
      effectiveThreshold: effectiveThreshold(plain, orgDefault),
      isLowStock: isLowStock(plain, orgDefault),
    };
  });
}

module.exports = { effectiveThreshold, isLowStock, withStockStatus };
