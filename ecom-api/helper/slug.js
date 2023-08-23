export const createSlug = (title) => {
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();

  const slug = cleanTitle.replace(/\s+/g, "-");

  return slug;
};
