export const resolveRemoteCollection = (remoteCollection, fallbackCollection) => {
  if (remoteCollection === null || remoteCollection === undefined) {
    return fallbackCollection;
  }

  return remoteCollection;
};

export const filterVisibleProducts = (products = [], hiddenProductIds = []) => {
  const hidden = new Set(hiddenProductIds || []);
  return (products || []).filter((product) => !hidden.has(product.id));
};
