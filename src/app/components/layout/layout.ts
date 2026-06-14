import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MiningDataService } from '../../services/mining-data.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  template: `
    <div class="h-[100dvh] overflow-hidden bg-slate-900 text-slate-100 font-sans flex flex-col antialiased">
      <!-- High-Density Industrial Header -->
      <header class="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-4 md:px-6 z-40 sticky top-0 shrink-0 shadow-lg">
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Toggle Button -->
          <button (click)="toggleMobileSidebar()" class="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition" aria-label="Toggle Menu">
            <mat-icon>menu</mat-icon>
          </button>

          <!-- Desktop Sidebar Toggle Button -->
          <button (click)="toggleSidebarExpanded()" class="hidden lg:flex p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition items-center justify-center" [title]="sidebarExpanded() ? 'Collapse Sidebar' : 'Expand Sidebar'" aria-label="Toggle Sidebar">
            <mat-icon class="transition-transform duration-300" [class.rotate-180]="!sidebarExpanded()">menu_open</mat-icon>
          </button>
          
          <!-- Branded Corporate Logo & Name -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-mono text-slate-950 font-bold tracking-tight text-lg shadow-inner">
               MO
            </div>
            <span class="font-mono text-xl font-bold tracking-wider text-slate-100 hidden sm:inline">{{ t()('MINEOPS', 'common') }}</span>
            <span class="text-xs bg-slate-700 text-amber-400 px-2 py-0.5 rounded font-mono border border-slate-600">{{ t()('PROTOTYPE', 'common') }}</span>
          </div>
        </div>

        <!-- Right Side Stats, Shift Info and User Profile Controls -->
        <div class="flex items-center gap-4">
          <!-- Active Shift Badge -->
          <div class="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-full border border-slate-700 text-xs font-mono text-slate-400">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-slate-300">{{ t()('SHIFT', 'common') }}:</span>
            <span class="text-amber-400">{{ t()('SHIFT_A', 'common') }}</span>
          </div>

          <!-- Active Master Alarms Control Room Dropdown -->
          <div class="relative">
            <button (click)="toggleAlertsDropdown()" class="p-2 bg-slate-950 rounded border border-slate-700 hover:bg-slate-700 transition relative flex items-center justify-center text-slate-300" aria-label="Open critical system alerts">
              <mat-icon [class.text-rose-500]="activeAlarmsCount() > 0" [class.animate-pulse]="activeAlarmsCount() > 0">notifications_active</mat-icon>
              @if (activeAlarmsCount() > 0) {
                <span class="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center font-mono font-bold text-[10px] shadow-sm">
                  {{ activeAlarmsCount() }}
                </span>
              }
            </button>

            <!-- Alerts Overlay Panel -->
            @if (alertsDropdownOpen()) {
              <div class="absolute right-[-80px] sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-slate-800 rounded-lg border border-slate-700 shadow-2xl z-50 overflow-hidden font-sans">
                <div class="p-3 bg-slate-950 border-b border-slate-700 flex justify-between items-center">
                  <span class="font-mono font-bold text-xs tracking-wider text-slate-300">{{ t()('CRITICAL_DIRECTIVES', 'common') }}</span>
                  <span class="text-[10px] text-rose-400 uppercase tracking-widest font-bold">{{ t()('OPS_WARNING', 'common') }}</span>
                </div>
                <div class="max-h-72 overflow-y-auto divide-y divide-slate-700 bg-slate-950">
                  @if (alerts().length === 0) {
                    <div class="p-6 text-center text-xs text-slate-500 py-10">
                      {{ t()('NO_ALERTS', 'common') }}
                    </div>
                  } @else {
                    @for (alert of alerts(); track alert.id) {
                      <div class="p-3 hover:bg-slate-900 transition flex flex-col gap-1.5" [class.bg-rose-950]="alert.severity === 'Critical' && !alert.acknowledged">
                        <div class="flex justify-between items-start">
                          <span class="text-[11px] font-bold font-mono tracking-wide rounded px-1.5 py-0.5 flex items-center gap-1"
                                [ngClass]="{
                                  'bg-rose-900/50 text-rose-400 border border-rose-700': alert.severity === 'Critical',
                                  'bg-amber-900/50 text-amber-400 border border-amber-700': alert.severity === 'High',
                                  'bg-slate-800 text-slate-400 border border-slate-700': alert.severity === 'Medium'
                                }">
                            <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{'bg-rose-500': alert.severity === 'Critical', 'bg-amber-500': alert.severity === 'High', 'bg-slate-400': alert.severity === 'Medium'}"></span>
                            {{ alert.severity }}
                          </span>
                          <span class="text-[10px] font-mono text-slate-500">{{ alert.time }}</span>
                        </div>
                        <p class="text-xs text-slate-300 line-clamp-2">{{ alert.message }}</p>
                        <div class="flex justify-between items-center mt-1">
                          <span class="text-[10px] text-slate-400 font-mono">{{ alert.equipmentName }} ({{ alert.equipmentId }})</span>
                          @if (!alert.acknowledged) {
                            <button (click)="ackAlert(alert.id)" class="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-2 py-0.5 rounded border border-slate-700 transition">
                              {{ t()('ACKNOWLEDGE', 'common') }}
                            </button>
                          } @else {
                            <span class="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
                              <mat-icon class="text-emerald-500 text-[12px] h-3 w-3 leading-none">check_circle</mat-icon> {{ t()('ACKNOWLEDGED', 'common') }}
                            </span>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
                <div class="p-2 bg-slate-900 text-center border-t border-slate-700">
                  <button (click)="closeAlerts()" class="text-xs text-slate-400 hover:text-white transition py-1 w-full font-mono">
                    {{ t()('CLOSE_PANEL', 'common') }}
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- User Profile Dropdown Component -->
          <div class="relative">
            <button (click)="toggleProfileDropdown()" class="flex items-center gap-2 p-1.5 bg-slate-950 rounded hover:bg-slate-700 border border-slate-700 transition text-left" aria-label="Open operator profile">
              <img [src]="user()?.avatarUrl" class="w-7 h-7 rounded object-cover border border-slate-600" alt="Avatar">
              <div class="hidden sm:block text-xs">
                <p class="font-bold text-slate-200 leading-tight">{{ user()?.fullName }}</p>
                <p class="text-[10px] text-slate-400 uppercase font-mono tracking-wider">{{ user()?.role }}</p>
              </div>
              <mat-icon class="text-slate-400 ml-1 text-sm">keyboard_arrow_down</mat-icon>
            </button>

            @if (profileDropdownOpen()) {
              <div class="absolute right-0 mt-2 w-56 bg-slate-800 rounded border border-slate-700 shadow-2xl z-50 overflow-hidden font-sans">
                <div class="p-3 border-b border-slate-700 bg-slate-950 flex flex-col">
                  <span class="text-xs font-bold text-slate-300">{{ user()?.fullName }}</span>
                  <span class="text-[10px] text-slate-500 font-mono italic">{{ user()?.email }}</span>
                </div>
                <div class="py-1">
                  <a routerLink="/settings" (click)="closeProfile()" class="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 transition">
                    <mat-icon class="text-sm">settings</mat-icon> {{ t()('SYS_SETTINGS', 'common') }}
                  </a>
                  <button (click)="triggerLogout()" class="flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-slate-700 transition w-full text-left font-bold">
                    <mat-icon class="text-sm text-rose-400">logout</mat-icon> {{ t()('LOGOUT', 'common') }}
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </header>

      <!-- Main Layout Body -->
      <div class="flex-1 flex overflow-hidden relative_class">
        
        <!-- Collapsible Enterprise Desktop Sidebar / Mobile Drawer Overlay -->
        <aside [ngClass]="{
            'translate-x-0 lg:translate-x-0': mobileSidebarOpen(),
            '-translate-x-full lg:translate-x-0': !mobileSidebarOpen(),
            'lg:w-64': sidebarExpanded(),
            'lg:w-20': !sidebarExpanded()
          }" 
          class="fixed inset-y-0 left-0 top-16 z-30 border-r border-slate-700 bg-slate-800 flex flex-col transition-all duration-300 lg:static lg:top-0 h-full shrink-0 shadow-2xl lg:shadow-none">
          
          <!-- Collapsed toggle control inside sidebar (for quick actions) -->
          <div class="hidden lg:flex justify-end p-2 border-b border-slate-700/50 bg-slate-800">
            <button (click)="toggleSidebarExpanded()" class="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition" [title]="sidebarExpanded() ? 'Collapse Sidebar' : 'Expand Sidebar'">
              <mat-icon>{{ sidebarExpanded() ? 'chevron_left' : 'chevron_right' }}</mat-icon>
            </button>
          </div>

          <!-- Navigation Links Section -->
          <nav class="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 select-none">
            
            <!-- SECTION LABEL: OVERVIEW -->
            @if (sidebarExpanded()) {
              <div class="text-[10px] font-bold font-mono tracking-wider text-slate-500 px-3 uppercase mb-1 mt-2">{{ t()('MAIN_PORTAL', 'common') }}</div>
            } @else {
              <div class="border-b border-slate-700/50 my-2"></div>
            }

            <a routerLink="/dashboard" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group relative"
               [title]="!sidebarExpanded() ? t()('DASHBOARD', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/dashboard')">dashboard</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('DASHBOARD', 'common') }}</span>
              }
            </a>

            <!-- SECTION LABEL: OPERATIONS -->
            @if (sidebarExpanded()) {
              <div class="text-[10px] font-bold font-mono tracking-wider text-slate-500 px-3 uppercase mb-1 mt-4">{{ t()('FIELD_OPS', 'common') }}</div>
            } @else {
              <div class="border-b border-slate-700/50 my-3"></div>
            }

            <a routerLink="/equipment" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group relative"
               [title]="!sidebarExpanded() ? t()('FLEET', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/equipment')">construction</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('FLEET', 'common') }}</span>
              }
            </a>

            <a routerLink="/teams" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group"
               [title]="!sidebarExpanded() ? t()('TEAMS', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/teams')">groups</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('TEAMS', 'common') }}</span>
              }
            </a>

            <a routerLink="/work-orders" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group"
               [title]="!sidebarExpanded() ? t()('KANBAN', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/work-orders')">assignment</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('KANBAN', 'common') }}</span>
              }
            </a>

            <!-- SECTION LABEL: GEOSPATIAL -->
            @if (sidebarExpanded()) {
              <div class="text-[10px] font-bold font-mono tracking-wider text-slate-500 px-3 uppercase mb-1 mt-4">{{ t()('GEOSPATIAL_SYS', 'common') }}</div>
            } @else {
              <div class="border-b border-slate-700/50 my-3"></div>
            }

            <a routerLink="/map" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group"
               [title]="!sidebarExpanded() ? t()('SPATIAL_INDEX', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/map')">map</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('SPATIAL_INDEX', 'common') }}</span>
              }
            </a>

            <!-- SECTION LABEL: ANALYTICS -->
            @if (sidebarExpanded()) {
              <div class="text-[10px] font-bold font-mono tracking-wider text-slate-500 px-3 uppercase mb-1 mt-4">{{ t()('ANALYTICAL_INDEX', 'common') }}</div>
            } @else {
              <div class="border-b border-slate-700/50 my-3"></div>
            }

            <a routerLink="/reports" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group"
               [title]="!sidebarExpanded() ? t()('REPORTS', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/reports')">query_stats</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('REPORTS', 'common') }}</span>
              }
            </a>

            <!-- SECTION LABEL: SETTINGS -->
            @if (sidebarExpanded()) {
              <div class="text-[10px] font-bold font-mono tracking-wider text-slate-500 px-3 uppercase mb-1 mt-4">{{ t()('SETTINGS', 'common') }}</div>
            } @else {
              <div class="border-b border-slate-700/50 my-3"></div>
            }

            <a routerLink="/settings" routerLinkActive="active-nav" (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition group"
               [title]="!sidebarExpanded() ? t()('SETTINGS', 'common') : ''">
              <mat-icon class="text-slate-400 group-hover:text-amber-400 transition" [class.text-amber-400]="isRouteActive('/settings')">settings</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-xs font-semibold tracking-wide">{{ t()('SETTINGS', 'common') }}</span>
              }
            </a>

          </nav>

          <!-- Sidebar Footer Component -->
          <div class="p-3 border-t border-slate-700 bg-slate-900/60 block">
            <div class="flex items-center gap-2" [class.justify-center]="!sidebarExpanded()">
              <mat-icon class="text-xs text-emerald-500">dns</mat-icon>
              @if (sidebarExpanded()) {
                <span class="text-[10px] font-mono text-slate-400">{{ t()('ERP_SYNC', 'common') }}</span>
              }
            </div>
          </div>
        </aside>

        <!-- Mobile Drawer Backdrop Overlay -->
        @if (mobileSidebarOpen()) {
          <div (click)="closeMobileSidebar()"
               (keydown.enter)="closeMobileSidebar()"
               role="button"
               tabindex="0"
               aria-label="Close mobile sidebar menu backdrop"
               class="fixed inset-0 bg-slate-950/75 z-20 lg:hidden cursor-pointer"
               id="mobile-drawer-backdrop"></div>
        }

        <!-- High density scrollable main routing view panel -->
        <main class="flex-1 bg-slate-900 p-3 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-5 lg:gap-6"
              [class.overflow-hidden]="isRouteActive('/dashboard')"
              [class.overflow-y-auto]="!isRouteActive('/dashboard')">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .active-nav {
      background-color: rgba(59, 130, 246, 0.15) !important;
      color: #60A5FA !important;
      border-left: 4px solid #3B82F6 !important;
    }
  `]
})
export class Layout {
  private miningService = inject(MiningDataService);
  private authService = inject(AuthService);
  private transService = inject(TranslationService);
  private router = inject(Router);

  public sidebarExpanded = signal<boolean>(true);
  public mobileSidebarOpen = signal<boolean>(false);
  public alertsDropdownOpen = signal<boolean>(false);
  public profileDropdownOpen = signal<boolean>(false);

  public user = computed(() => this.authService.currentUser());
  public alerts = computed(() => this.miningService.systemAlerts().reverse());
  public activeAlarmsCount = computed(() => this.miningService.systemAlerts().filter(a => !a.acknowledged).length);
  public t = computed(() => this.transService.translate());

  public toggleSidebarExpanded() {
    this.sidebarExpanded.update(x => !x);
  }

  public toggleMobileSidebar() {
    this.mobileSidebarOpen.update(x => !x);
  }

  public closeMobileSidebar() {
    this.mobileSidebarOpen.set(false);
  }

  public toggleAlertsDropdown() {
    this.alertsDropdownOpen.update(x => !x);
    if (this.alertsDropdownOpen()) {
      this.profileDropdownOpen.set(false);
    }
  }

  public closeAlerts() {
    this.alertsDropdownOpen.set(false);
  }

  public ackAlert(id: string) {
    this.miningService.acknowledgeAlert(id);
  }

  public toggleProfileDropdown() {
    this.profileDropdownOpen.update(x => !x);
    if (this.profileDropdownOpen()) {
      this.alertsDropdownOpen.set(false);
    }
  }

  public closeProfile() {
    this.profileDropdownOpen.set(false);
  }

  public triggerLogout() {
    this.closeProfile();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public isRouteActive(url: string): boolean {
    return this.router.url === url;
  }
}
