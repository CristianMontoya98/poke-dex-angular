import { Routes } from '@angular/router';
import { MainLayout } from '../components/core/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/pokedex-all/pokedex-all').then((m) => m.PokedexAll),
      },
    ],
  },
];
