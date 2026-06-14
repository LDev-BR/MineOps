import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Layout } from './components/layout/layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { EquipmentManagement } from './pages/equipment/equipment';
import { TeamsManagement } from './pages/teams/teams';
import { WorkOrdersKanban } from './pages/work-orders/work-orders';
import { MapPage } from './pages/map/map';
import { ReportsPage } from './pages/reports/reports';
import { SettingsPage } from './pages/settings/settings';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'equipment',
        component: EquipmentManagement
      },
      {
        path: 'teams',
        component: TeamsManagement
      },
      {
        path: 'work-orders',
        component: WorkOrdersKanban
      },
      {
        path: 'map',
        component: MapPage
      },
      {
        path: 'reports',
        component: ReportsPage
      },
      {
        path: 'settings',
        component: SettingsPage
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
