export const applicationPartsDirectory = (
  applicationName: string,
  partName: string,
) => {
  return `applications/${applicationName}/${partName}`;
};
export const applicationPartVersionFileDirectory = (
  applicationName: string,
  partName: string,
  versionName: string,
) => {
  return `applications/${applicationName}/${partName}/${versionName}`;
};
export const menuCategoriesDirectory = (categoryId: string) => {
  return `uploads/menu/categories/${categoryId}`;
};

export const menuItemsDirectory = (itemId: string) => {
  return `uploads/menu/items/${itemId}`;
};

export const restaurantsDirectory = (restaurantId: string) => {
  return `uploads/restaurants/${restaurantId}`;
};

export const documentationImagesDirectory = (documentationId: string) => {
  return `documentation/${documentationId}/images`;
};

export const workImagesDirectory = (workId: string) => {
  return `works/${workId}/images`;
};

export const workVideosDirectory = (workId: string) => {
  return `works/${workId}/videos`;
};
