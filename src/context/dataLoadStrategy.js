export const resolveRemoteCollection = (remoteCollection, fallbackCollection) => {
  if (remoteCollection === null || remoteCollection === undefined) {
    return fallbackCollection;
  }

  return remoteCollection;
};
