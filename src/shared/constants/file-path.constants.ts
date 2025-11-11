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
