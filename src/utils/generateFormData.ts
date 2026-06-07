export const generateFormData = (object: Record<string, unknown>) => {
  const params = new URLSearchParams();

  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    params.append(key, String(value));
  });

  return params.toString();
};
