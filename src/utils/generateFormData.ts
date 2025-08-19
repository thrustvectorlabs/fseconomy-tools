export const generateFormData = (object: Record<string, unknown>) => {
  return Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join('&');
};
