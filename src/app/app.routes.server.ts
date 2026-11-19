import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'p-detailes/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'payment/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'subcategory/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'Subcategoryproducts/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'brandsproducts/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'categoriesproduct/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
