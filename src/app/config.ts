export const staticPages = ['/_not-found', '/404', '/500'];

export const isStaticPage = (path: string) => {
  return staticPages.includes(path);
}; 