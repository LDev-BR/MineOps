import { Component, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MiningDataService } from '../../services/mining-data.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <!-- Top Branded Action Line and Tab strip inspired by Reference Screen 2 -->
    <div class="flex flex-col gap-2.5 border-b border-slate-800 pb-2 shrink-0">
      <!-- Title Block -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 class="text-md md:text-lg font-bold font-sans tracking-tight text-slate-100 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded bg-amber-500"></span>
            {{ t()('TITLE', 'dashboard') }}
          </h1>
          <p class="text-[9px] text-slate-400 mt-0.5 uppercase font-[#8B949E] tracking-widest font-mono">
            {{ t()('SUBTITLE', 'dashboard') }}
          </p>
        </div>
        
        <!-- Live status telemetry beacon -->
        <div class="flex items-center gap-1.5 font-mono text-[8px] bg-slate-950 px-2 py-0.5 rounded border border-slate-850 self-start sm:self-auto text-slate-400 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold">SYSTEM STATE: ONLINE</span>
          <span class="text-slate-800">|</span>
          <span class="text-amber-500 font-bold font-mono">14 JUNE 2026</span>
        </div>
      </div>

      <!-- Action Panel Switcher (Responsive HUD Grid Layout) -->
      <div class="flex flex-col gap-1.5 mt-0.5 shrink-0">
        <!-- Desktop and Tablet Tab strip (Hidden on small mobile viewports) -->
        <div class="hidden lg:flex bg-slate-950 p-1 rounded-lg border border-slate-850 gap-1 select-none">
          @for (panel of panels; track panel.id; let idx = $index) {
            <button (click)="activePanel.set(panel.id)"
                    class="flex-1 py-1.5 px-3 text-[10px] xl:text-[11px] font-bold tracking-wider uppercase transition-all duration-200 rounded font-sans cursor-pointer focus:outline-none"
                    [class.bg-amber-500]="activePanel() === panel.id"
                    [class.text-slate-950]="activePanel() === panel.id"
                    [class.text-slate-400]="activePanel() !== panel.id"
                    [class.hover:text-slate-200]="activePanel() !== panel.id"
                    [class.hover:bg-slate-900]="activePanel() !== panel.id">
              {{ isPt() ? panel.namePt : panel.nameKey }}
            </button>
          }
        </div>

        <!-- Mobile Step Navigator HUD (Displays on screens < 1024px) -->
        <div class="flex lg:hidden items-center justify-between bg-slate-950 p-1.5 rounded-lg border border-slate-850 select-none">
          <button (click)="prevPanel()" class="p-1 px-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded text-slate-400 hover:text-slate-100 transition flex items-center justify-center cursor-pointer focus:outline-none" aria-label="Previous Telemetry Panel">
            <mat-icon class="text-sm">chevron_left</mat-icon>
          </button>
          <div class="flex flex-col items-center">
            <span class="text-[8px] font-mono font-bold text-amber-500 uppercase tracking-widest leading-none">TELEMETRY PANEL {{ currentPanelIndex() + 1 }} OF 5</span>
            <span class="text-[10px] font-bold text-slate-250 uppercase mt-1 tracking-wide leading-none">{{ activePanelName() }}</span>
          </div>
          <button (click)="nextPanel()" class="p-1 px-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded text-slate-400 hover:text-slate-100 transition flex items-center justify-center cursor-pointer focus:outline-none" aria-label="Next Telemetry Panel">
            <mat-icon class="text-sm">chevron_right</mat-icon>
          </button>
        </div>

        <!-- Tactile LED Step dots for mobile views -->
        <div class="flex justify-center gap-1.5 lg:hidden select-none pb-0.5">
          @for (panel of panels; track panel.id; let idx = $index) {
            <button (click)="activePanel.set(panel.id)" 
                 class="h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0 p-0 focus:outline-none"
                 [class.w-5]="activePanel() === panel.id"
                 [class.bg-amber-500]="activePanel() === panel.id"
                 [class.w-1.5]="activePanel() !== panel.id"
                 [class.bg-slate-800]="activePanel() !== panel.id"
                 [class.hover:bg-slate-600]="activePanel() !== panel.id"
                 [attr.aria-label]="'Go to step ' + (idx + 1)"></button>
          }
        </div>
      </div>
    </div>

    <!-- Export Toast confirmation message -->
    @if (showExportToast()) {
      <div class="fixed top-20 right-6 bg-slate-900 border border-emerald-500 text-white rounded-lg p-3 shadow-2xl flex items-center gap-2.5 z-50 animate-fade-in font-sans select-none">
        <mat-icon class="text-emerald-500 animate-bounce text-lg flex items-center justify-center">check_circle</mat-icon>
        <div>
          <p class="text-[11px] font-bold uppercase tracking-wider">
            {{ isPt() ? 'Relatório Exportado' : 'Data Matrix Exported' }}
          </p>
          <p class="text-[9px] text-slate-400">CSV/JSON process pack dispatched directly to workspace environment.</p>
        </div>
      </div>
    }

    <!-- Quick ERP operational Actions -->
    <div class="flex gap-2 justify-end items-center mt-0.5 shrink-0 select-none">
      <button (click)="exportData()"
              class="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:bg-slate-850 rounded text-[10px] md:text-xs font-bold font-sans tracking-wide text-slate-350 hover:text-slate-100 transition flex items-center gap-1.5 shadow-sm cursor-pointer">
        <mat-icon class="text-xs h-3.5 w-3.5 flex items-center justify-center">download</mat-icon>
        {{ isPt() ? 'EXPORTAR' : 'EXPORT' }}
      </button>
      <button (click)="showNewLogModal.set(true)"
              class="px-2.5 py-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded text-[10px] md:text-xs font-bold font-sans tracking-wide transition flex items-center gap-1.5 shadow-md cursor-pointer">
        <mat-icon class="text-xs h-3.5 w-3.5 flex items-center justify-center">add</mat-icon>
        {{ isPt() ? 'REGISTRO ERP' : 'NEW LOG' }}
      </button>
    </div>

    <!-- CONSOLE WIDGET VIEWER (Flexible 100% height container) -->
    <div class="flex-1 flex flex-col overflow-hidden min-h-0 relative">
      
      <!-- PANEL 1: CORE KPIs -->
      @if (activePanel() === 'kpis') {
        <div class="flex flex-col gap-2 sm:gap-3 flex-1 overflow-hidden animate-fade-in py-1">
          
          <!-- Active Master Alarms Warning Banner -->
          @if (unacknowledgedAlerts().length > 0) {
            <div class="bg-rose-950/20 border-l-4 border-rose-600 rounded-lg p-2 flex flex-col md:flex-row md:items-center justify-between gap-1.5 shadow-inner shrink-0 leading-none">
              <div class="flex items-start gap-2">
                <mat-icon class="text-rose-500 animate-bounce text-sm">warning</mat-icon>
                <div>
                  <h4 class="text-[9px] font-bold font-mono text-rose-450 uppercase tracking-wider flex items-center gap-1.5">
                    {{ isPt() ? 'ALARME CRÍTICO DETECTADO' : 'CRITICAL ALARM DETECTED' }} ({{ unacknowledgedAlerts().length }} {{ isPt() ? 'NÃO RESOLVIDOS' : 'UNRESOLVED' }})
                  </h4>
                  <p class="text-[11px] text-slate-300 mt-1 font-sans leading-tight line-clamp-1">
                    {{ unacknowledgedAlerts()[0].equipmentName }} {{ isPt() ? 'reporta' : 'reports' }}: "{{ unacknowledgedAlerts()[0].message }}"
                  </p>
                </div>
              </div>
              <button [routerLink]="['/equipment']" class="bg-rose-900/50 hover:bg-rose-900 text-rose-200 text-[8px] md:text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-rose-700 uppercase transition shrink-0 self-start md:self-auto cursor-pointer">
                {{ isPt() ? 'SOLICITAR DISPACHO' : 'DISPATCH SQUAD' }}
              </button>
            </div>
          }

          <!-- Grid layout designed to exactly fit without horizontal overflow on mobile -->
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-1.5 sm:gap-2 flex-1 content-start py-0.5 select-none">
            <!-- Active Equipment -->
            <div class="bg-slate-850 border border-slate-755 p-1.5 sm:p-2.5 rounded-lg shadow-sm flex flex-col justify-between h-[58px] sm:h-[72px] md:h-[80px]">
              <span class="text-[7px] sm:text-[8px] font-bold font-sans tracking-wide text-slate-500 uppercase">{{ t()('KPI_ACTIVE_FLEET', 'dashboard') }}</span>
              <div class="flex items-baseline gap-1 mt-0 sm:mt-0.5">
                <span class="text-sm sm:text-lg md:text-xl font-extrabold font-sans text-slate-100 leading-none">
                  {{ kpis().activeEquipment | number:'2.0-0' }}
                </span>
                <span class="text-[7px] sm:text-[8px] text-emerald-600 font-bold font-sans">+2%</span>
              </div>
              <span class="text-[7px] sm:text-[8px] text-slate-400 font-mono tracking-wider truncate">{{ t()('KPI_ACTIVE_FLEET_SUB', 'dashboard') }}</span>
            </div>

            <!-- Fleet In Workshop -->
            <div class="bg-slate-850 border border-slate-755 border-t-4 border-t-amber-500 p-1.5 sm:p-2.5 rounded-lg shadow-sm flex flex-col justify-between h-[58px] sm:h-[72px] md:h-[80px]">
              <span class="text-[7px] sm:text-[8px] font-bold font-sans tracking-wide text-slate-500 uppercase">{{ t()('KPI_WORKSHOP', 'dashboard') }}</span>
              <div class="flex items-baseline gap-1 mt-0 sm:mt-0.5">
                <span class="text-sm sm:text-lg md:text-xl font-extrabold font-sans text-slate-100 leading-none">
                  {{ kpis().underMaintenance | number:'2.0-0' }}
                </span>
                <span class="text-[7px] sm:text-[8px] text-amber-600 font-mono font-bold uppercase">{{ isPt() ? 'PLANEJADO' : 'PLAN' }}</span>
              </div>
              <span class="text-[7px] sm:text-[8px] text-slate-400 font-mono tracking-wider truncate">{{ t()('KPI_WORKSHOP_SUB', 'dashboard') }}</span>
            </div>

            <!-- Active Crews -->
            <div class="bg-slate-850 border border-slate-755 p-1.5 sm:p-2.5 rounded-lg shadow-sm flex flex-col justify-between h-[58px] sm:h-[72px] md:h-[80px]">
              <span class="text-[7px] sm:text-[8px] font-bold font-sans tracking-wide text-slate-500 uppercase">{{ t()('KPI_CREWS', 'dashboard') }}</span>
              <div class="flex items-baseline gap-1 mt-0 sm:mt-0.5">
                <span class="text-sm sm:text-lg md:text-xl font-extrabold font-sans text-slate-100 leading-none">
                  {{ kpis().activeTeams | number:'2.0-0' }}
                </span>
                <span class="text-[7px] sm:text-[8px] text-slate-500 font-bold font-sans uppercase">{{ isPt() ? 'CARGA' : 'LOAD' }}</span>
              </div>
              <span class="text-[7px] sm:text-[8px] text-slate-400 font-mono tracking-wider truncate">{{ t()('KPI_CREWS_SUB', 'dashboard') }}</span>
            </div>

            <!-- Active Work Orders -->
            <div class="bg-slate-850 border border-slate-755 p-1.5 sm:p-2.5 rounded-lg shadow-sm flex flex-col justify-between h-[58px] sm:h-[72px] md:h-[80px]">
              <span class="text-[7px] sm:text-[8px] font-bold font-sans tracking-wide text-slate-500 uppercase">{{ t()('KPI_WOS', 'dashboard') }}</span>
              <div class="flex items-baseline gap-1 mt-0 sm:mt-0.5">
                <span class="text-sm sm:text-lg md:text-xl font-extrabold font-sans text-slate-100 leading-none">
                  {{ workOrders().length | number:'2.0-0' }}
                </span>
                <span class="text-[7px] sm:text-[8px] text-rose-500 font-bold font-sans uppercase">4 {{ isPt() ? 'ATRASO' : 'LATE' }}</span>
              </div>
              <span class="text-[7px] sm:text-[8px] text-slate-400 font-mono tracking-wider truncate">{{ t()('KPI_WOS_SUB', 'dashboard') }}</span>
            </div>

            <!-- Critical Alerts -->
            <div class="bg-slate-850 border border-slate-755 p-1.5 sm:p-2.5 rounded-lg shadow-sm flex flex-col justify-between h-[58px] sm:h-[72px] md:h-[80px]">
              <span class="text-[7px] sm:text-[8px] font-bold font-sans tracking-wide text-slate-500 uppercase">{{ isPt() ? 'ALERTAS' : 'ALERTS SYSTEM' }}</span>
              <div class="flex items-baseline gap-1 mt-0 sm:mt-0.5">
                <span class="text-sm sm:text-lg md:text-xl font-extrabold font-sans text-[#E11D48] leading-none">
                  {{ kpis().criticalAlerts | number:'2.0-0' }}
                </span>
                <span class="text-[7px] sm:text-[8px] text-rose-400 font-sans font-bold ml-1">{{ isPt() ? 'REQ RECO' : 'ACK REQ' }}</span>
              </div>
              <span class="text-[7px] sm:text-[8px] text-[#E11D48] font-mono font-bold tracking-wider uppercase text-left truncate">{{ isPt() ? 'FALHAS GRAVES' : 'ACTION REQUIRED' }}</span>
            </div>

            <!-- Productivity OEE -->
            <div class="bg-slate-850 border border-slate-755 p-1.5 sm:p-2.5 rounded-lg shadow-sm flex flex-col justify-between h-[58px] sm:h-[72px] md:h-[80px]">
              <span class="text-[7px] sm:text-[8px] font-bold font-sans tracking-wide text-slate-500 uppercase font-bold">{{ isPt() ? 'PROD. OEE' : 'OEE PRODUCTIVITY' }}</span>
              <div class="mt-0 sm:mt-0.5 flex items-baseline">
                <span class="text-sm sm:text-lg md:text-xl font-extrabold font-sans text-emerald-600 leading-none">
                  {{ kpis().productivityRate }}%
                </span>
              </div>
              <div class="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div class="bg-emerald-600 h-full rounded-full transition-all duration-1000" [style.width]="kpis().productivityRate + '%'"></div>
              </div>
            </div>
          </div>

          <!-- Bottom Operational telemetry details -->
          <div class="border border-slate-800 bg-slate-950 p-2.5 rounded-lg text-[9px] md:text-[10px] text-slate-400 flex justify-between items-center select-none mt-0.5 sm:mt-1">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ isPt() ? 'Console de Métricas operando com sincronização WITSML mestre.' : 'Metrics console operating under master WITSML active telemetry.' }}
            </span>
            <span class="font-mono text-[8px] text-[#F97316]">REF_P_01 : OK</span>
          </div>
        </div>
      }

      <!-- PANEL 2: SITE TELEMETRY MAP -->
      @if (activePanel() === 'map') {
        <div class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-lg flex flex-col relative flex-1 animate-fade-in min-h-[100px]">
          <div class="p-2 bg-slate-950 border-b border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-400 select-none">
            <span class="font-bold flex items-center gap-1.5">
              <mat-icon class="text-amber-500 text-xs">satellite</mat-icon> 
              {{ isPt() ? 'MAPA DE TELEMETRIA DO ATIVO ALPHA' : 'SITE ALPHA TELEMETRY OVERLAY' }}
            </span>
            <span class="text-[9px] text-slate-500">REFRESS_T: WGS84 OK</span>
          </div>

          <div class="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center min-h-[220px]">
            <!-- Grayscale mining pit vector contour map -->
            <svg class="absolute inset-0 w-full h-full stroke-slate-800/45 fill-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M50 40 C150 20, 500 50, 750 40 C950 30, 1100 120, 1150 220 C1200 320, 1050 450, 850 430 C650 410, 400 480, 200 420 C50 370, -20 280, 10 180 C30 110, -10 60, 50 40 Z" stroke-width="1.2" />
              <path d="M120 80 C220 60, 550 90, 720 80 C880 70, 980 140, 1020 220 C1060 300, 950 390, 780 370 C610 350, 410 410, 250 360 C120 320, 80 250, 90 170 C100 120, 70 90, 120 80 Z" stroke-width="1.0" />
              <path d="M220 130 C300 110, 580 130, 680 130 C780 130, 850 190, 880 240 C910 290, 820 330, 700 310 C580 290, 390 340, 280 300 C180 270, 160 210, 180 170 C200 140, 180 140, 220 130 Z" stroke-width="0.8" />
              <ellipse cx="480" cy="210" rx="140" ry="60" stroke="#f59e0b" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.6" />
            </svg>

            <!-- Machinery pulsing nodes -->
            <div class="absolute left-[30%] top-[35%] flex flex-col items-center z-10">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-slate-900"></span>
              </span>
              <div class="bg-slate-950/90 border border-slate-800 rounded px-1 mt-0.5 font-mono text-[8px] text-emerald-450 font-bold whitespace-nowrap shadow-md select-none">
                CAT 6040 [EQ-EXC-101]
              </div>
            </div>

            <div class="absolute left-[65%] top-[55%] flex flex-col items-center z-10">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-slate-900"></span>
              </span>
              <div class="bg-slate-950/90 border border-slate-800 rounded px-1 mt-0.5 font-mono text-[8px] text-emerald-450 font-bold whitespace-nowrap shadow-md select-none">
                LIEBHERR [EQ-DUM-201]
              </div>
            </div>

            <div class="absolute left-[15%] top-[65%] flex flex-col items-center z-10">
              <span class="relative flex h-2 w-2">
                <span class="animate-pulse absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-600 border border-slate-900"></span>
              </span>
              <div class="bg-slate-950/90 border border-rose-900/60 rounded px-1 mt-0.5 font-mono text-[8px] text-rose-500 font-bold whitespace-nowrap shadow-md select-none">
                OUTAGE [EQ-DUM-202]
              </div>
            </div>

            <div class="absolute left-[50%] top-[20%] flex flex-col items-center z-10">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-slate-900"></span>
              </span>
              <div class="bg-slate-950/90 border border-slate-800 rounded px-1 mt-0.5 font-mono text-[8px] text-emerald-450 font-bold whitespace-nowrap shadow-md select-none">
                DRILL RIG [EQ-DRI-301]
              </div>
            </div>

            <!-- Overlay indicators -->
            <div class="absolute bottom-2.5 left-2.5 text-left font-sans select-none pointer-events-none">
              <h3 class="text-[9px] md:text-xs font-bold text-slate-100 tracking-wide uppercase">{{ isPt() ? 'MAPA DE BENCH DE PILBARA' : 'PILBARA BENCH SECTOR' }}</h3>
              <p class="text-[8px] text-slate-500 mt-0.5 font-mono">SOUTH WEST BENCH SECTOR 2</p>
            </div>

            <div class="absolute bottom-2.5 right-2.5 text-right font-sans select-none pointer-events-none">
              <p class="text-[9px] md:text-xs font-bold text-slate-300 font-mono">{{ kpis().activeEquipment }} Assets Active</p>
              <p class="text-[8px] text-slate-500 font-mono">RESOLUTION: 0.5 METRICS</p>
            </div>
          </div>
        </div>
      }

      <!-- PANEL 3: PM SCHEDULES & ACTIVE WORK ORDERS -->
      @if (activePanel() === 'queues') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden animate-fade-in min-h-[100px]">
          <!-- Preventative major scheduled cycles -->
          <div class="bg-slate-850 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-hidden">
            <div class="flex justify-between items-center border-b border-slate-800 pb-1.5 shrink-0">
              <h3 class="text-[10px] md:text-xs font-bold font-mono text-slate-200 tracking-wider uppercase">
                {{ isPt() ? 'CONFORMIDADE DE PREVENTIVAS' : 'UPCOMING PM CRITICAL BENCHMARKS' }}
              </h3>
              <mat-icon class="text-slate-500 text-xs">schedule_send</mat-icon>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 scrollbar-thin">
              @for (eq of upcomingPMs(); track eq.id) {
                <div class="p-2.5 bg-slate-900 border border-slate-850 rounded flex flex-col gap-1.5 hover:border-slate-800 transition select-none">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-slate-250">{{ eq.name }}</span>
                    <span class="text-[9px] font-mono text-slate-550 uppercase">{{ eq.id }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[10px] text-slate-450 border-t border-slate-850/60 pt-1.5 leading-none">
                    <div>
                      <span class="text-slate-550 block uppercase text-[8px] font-mono font-bold leading-none">{{ isPt() ? 'Localização' : 'Location' }}</span>
                      <span class="truncate block font-semibold text-slate-350 mt-1">{{ eq.location }}</span>
                    </div>
                    <div>
                      <span class="text-slate-550 block uppercase text-[8px] font-mono font-bold leading-none">{{ isPt() ? 'Data Alvo' : 'Target Date' }}</span>
                      <span class="text-amber-500 block font-mono font-bold mt-1">{{ eq.nextMaintenanceDate }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center text-[9px] border-t border-slate-850/60 pt-1 mt-0.5">
                    <span class="text-slate-550 font-mono">{{ isPt() ? 'Horas:' : 'Hours:' }} {{ eq.operationalHours | number }} h</span>
                    <span class="font-bold font-mono px-1.5 py-0.5 rounded text-[8px]"
                          [ngClass]="{
                            'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60': eq.healthScore >= 90,
                            'bg-amber-950/40 text-amber-400 border border-amber-800/60': eq.healthScore < 90 && eq.healthScore >= 70,
                            'bg-rose-950/50 text-rose-455 border border-rose-800/60': eq.healthScore < 70
                          }">
                      {{ isPt() ? 'SAÚDE' : 'HEALTH' }}: {{ eq.healthScore }}%
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Active Kanban directives list -->
          <div class="bg-slate-850 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-hidden">
            <div class="flex justify-between items-center border-b border-slate-800 pb-1.5 shrink-0">
              <h3 class="text-[10px] md:text-xs font-bold font-mono text-slate-200 tracking-wider">
                {{ isPt() ? 'CONDIÇÕES DE ORDENS ATIVAS' : 'ACTIVE CONSOLE KANBAN DIRECTIVES' }}
              </h3>
              <button [routerLink]="['/work-orders']" class="text-amber-500 text-[8px] md:text-[9px] uppercase font-bold flex items-center hover:underline cursor-pointer">
                {{ isPt() ? 'QUADRO KANBAN' : 'KANBAN BOARD' }} <mat-icon class="text-xs ml-0.5">arrow_forward</mat-icon>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 scrollbar-thin">
              @for (wo of recentWorkOrders().slice(0, 3); track wo.id) {
                <div class="p-2.5 bg-slate-900 border border-slate-850 rounded flex flex-col gap-1 hover:border-slate-800 transition select-none">
                  <div class="flex justify-between items-center text-[9px] font-mono leading-none">
                    <span class="font-bold text-slate-550">{{ wo.id }}</span>
                    <span class="font-bold px-1.5 py-0.2 rounded border text-[8px]"
                          [ngClass]="{
                            'text-rose-455 border-rose-900 bg-rose-950/25': wo.priority === 'Critical', 
                            'text-amber-400 border-amber-900 bg-amber-950/25': wo.priority === 'High'
                          }">
                      {{ wo.priority }}
                    </span>
                  </div>
                  <p class="text-xs font-semibold text-slate-200 leading-tight mt-1 line-clamp-1 truncate">{{ wo.title }}</p>
                  <div class="flex justify-between items-center text-[9px] border-t border-slate-850/80 pt-1.5 mt-1.5 text-slate-500">
                    <span>{{ isPt() ? 'Maq:' : 'Equip:' }} {{ wo.equipmentId }}</span>
                    <span class="font-bold text-slate-350 uppercase font-mono">{{ wo.status }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- PANEL 4: PERFORMANCE & PERFORMANCE TRENDS -->
      @if (activePanel() === 'trends') {
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden animate-fade-in min-h-[100px]">
          <!-- Area line chart (8 columns) -->
          <div class="md:col-span-8 bg-slate-850 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-hidden">
            <div class="flex justify-between items-center border-b border-slate-800 pb-1.5 shrink-0">
              <div>
                <h3 class="text-[10px] md:text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                  {{ isPt() ? 'ÍNDICE HISTÓRICO DE COMPLIANCE DE PM' : 'ANNUAL FLEET INCIDENT FREQUENCY' }}
                </h3>
                <p class="text-[8px] text-slate-500 font-mono uppercase mt-0.5">Monthly actual occurrences vs Target baseline</p>
              </div>
              <div class="flex items-center gap-2 text-[8px] font-mono select-none">
                <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-500 rounded"></span> INCIDENTS</span>
                <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-slate-600 rounded"></span> BASELINE</span>
              </div>
            </div>

            <!-- Inline SVG chart -->
            <div class="flex-1 relative min-h-[160px]">
              <svg class="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                <line x1="50" y1="20" x2="780" y2="20" stroke="#1c1f26" stroke-dasharray="3" />
                <line x1="50" y1="130" x2="780" y2="130" stroke="#1c1f26" stroke-dasharray="3" />
                <line x1="50" y1="220" x2="780" y2="220" stroke="#2c303b" />
                <line x1="50" y1="20" x2="50" y2="220" stroke="#2c303b" />
                
                <path d="M 50 220 L 50 148 L 170 125 L 290 160 L 410 95 L 530 110 L 650 68 L 780 45 L 780 220 Z" fill="url(#panel-trends-grad)" opacity="0.1" />
                <path d="M 50 130 Q 170 135 290 120 T 530 130 T 780 110" fill="none" stroke="#484f5d" stroke-width="1.5" stroke-dasharray="4" />
                <path d="M 50 148 L 170 125 L 290 160 L 410 95 L 530 110 L 650 68 L 780 45" fill="none" stroke="#f59e0b" stroke-width="2.5" />

                <circle cx="50" cy="148" r="3" fill="#f59e0b" stroke="#000" />
                <circle cx="170" cy="125" r="3" fill="#f59e0b" stroke="#000" />
                <circle cx="290" cy="160" r="3" fill="#f59e0b" stroke="#000" />
                <circle cx="410" cy="95" r="3" fill="#f59e0b" stroke="#000" />
                <circle cx="530" cy="110" r="3" fill="#f59e0b" stroke="#000" />
                <circle cx="650" cy="68" r="3" fill="#f59e0b" stroke="#000" />
                <circle cx="780" cy="45" r="3" fill="#f59e0b" stroke="#000" />

                <defs>
                  <linearGradient id="panel-trends-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f59e0b" />
                    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-x-0 bottom-0 flex justify-between px-[5%] text-[8px] font-mono text-slate-500 pt-1 select-none">
                <span>DEC</span>
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN (CURR)</span>
              </div>
            </div>
          </div>

          <!-- Physical assets distribution (4 columns) -->
          <div class="md:col-span-4 bg-slate-850 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-hidden select-none">
            <div class="border-b border-slate-800 pb-1.5 shrink-0">
              <h3 class="text-[10px] md:text-xs font-bold font-mono text-slate-200 uppercase">
                {{ isPt() ? 'COORDENAÇÃO DE ATIVOS' : 'PHYSICAL STATES RATIO' }}
              </h3>
              <p class="text-[8px] text-slate-500 font-mono mt-0.5 uppercase">Continuous allocation factor</p>
            </div>

            <div class="flex-1 flex flex-col justify-center gap-4 py-1.5">
              <!-- Operational progress -->
              <div class="flex flex-col gap-1 text-[11px] font-mono leading-none">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded bg-emerald-500"></span> OPERATIONAL</span>
                  <span class="text-slate-200 font-bold leading-none">{{ statusCount('Operational') }} Units</span>
                </div>
                <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
                  <div class="bg-emerald-500 h-full rounded transition-all" [style.width]="statusPercent('Operational') + '%'"></div>
                </div>
              </div>

              <!-- Maintenance progress -->
              <div class="flex flex-col gap-1 text-[11px] font-mono leading-none">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded bg-amber-500"></span> WORKSHOP PM</span>
                  <span class="text-slate-200 font-bold leading-none">{{ statusCount('Under Maintenance') }} Units</span>
                </div>
                <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
                  <div class="bg-amber-500 h-full rounded transition-all" [style.width]="statusPercent('Under Maintenance') + '%'"></div>
                </div>
              </div>

              <!-- Outage progress -->
              <div class="flex flex-col gap-1 text-[11px] font-mono leading-none">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded bg-rose-600"></span> OUTAGES</span>
                  <span class="text-slate-200 font-bold leading-none">{{ statusCount('Breakdown') }} Units</span>
                </div>
                <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
                  <div class="bg-rose-600 h-full rounded transition-all" [style.width]="statusPercent('Breakdown') + '%'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- PANEL 5: ERP REPAIR LOGS & SENSOR FLAGS -->
      @if (activePanel() === 'logs') {
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden animate-fade-in min-h-[100px]">
          <!-- Historic Overhauls logs -->
          <div class="md:col-span-8 bg-slate-850 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-hidden">
            <div class="flex justify-between items-center border-b border-slate-800 pb-1.5 shrink-0">
              <div>
                <h3 class="text-[10px] md:text-xs font-bold font-mono text-slate-200 uppercase">
                  {{ isPt() ? 'REGISTROS DE EXECUÇÃO ERP' : 'ERP REPAIR DISPATCH HISTORY' }}
                </h3>
                <p class="text-[8px] text-slate-500 font-mono uppercase mt-0.5">Database status receipts synced</p>
              </div>
              <mat-icon class="text-slate-500 text-xs">history_edu</mat-icon>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 scrollbar-thin">
              @for (log of recentsLogs().slice(0, 3); track log.id) {
                <div class="p-2.5 bg-slate-900 border border-slate-850 rounded flex flex-col gap-1 hover:border-slate-800 transition select-none">
                  <div class="flex justify-between items-baseline text-xs leading-none">
                    <div class="flex items-center gap-1.5">
                      <span class="font-extrabold text-slate-200">{{ log.equipmentName }}</span>
                      <span class="text-[8px] font-mono text-slate-550 bg-slate-950 px-1 py-0.2 rounded border border-slate-850 uppercase">{{ log.equipmentId }}</span>
                    </div>
                    <span class="text-[8px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold text-stone-300"
                          [ngClass]="{
                            'bg-rose-950/40 border-rose-800/80 text-rose-300': log.type === 'Emergency',
                            'bg-sky-950/40 border-sky-800/80 text-sky-300': log.type === 'Scheduled',
                            'bg-slate-950/40 border-slate-750/80 text-secondary-350': log.type === 'Preventative'
                          }">
                      {{ log.type }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-450 leading-relaxed font-sans line-clamp-1 mt-1">{{ log.notes }}</p>
                  <div class="flex justify-between items-center text-[9px] font-mono text-slate-550 border-t border-slate-850/60 pt-1.5 mt-1 leading-none">
                    <span>Supervisor: {{ log.technician }} | {{ log.date }}</span>
                    <span class="text-amber-500 font-extrabold tracking-wider uppercase">\${{ log.cost | number }} AUD</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Active real-time tele-diagnostics stream -->
          <div class="md:col-span-4 bg-slate-850 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-hidden">
            <div class="border-b border-slate-800 pb-1.5 shrink-0">
              <h3 class="text-[10px] md:text-xs font-bold font-mono text-slate-200 uppercase">
                {{ isPt() ? 'TELEMETRIA CAN-BUS ATIVA' : 'CAN-BUS SENSOR DIRECTIVES' }}
              </h3>
              <p class="text-[8px] text-slate-500 font-mono mt-0.5 uppercase">Real-time CAN-Bus sensor signals</p>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 scrollbar-thin">
              @for (alert of alerts().slice(0, 3); track alert.id) {
                <div class="p-2 bg-slate-900 border rounded flex flex-col gap-1 hover:border-slate-800 transition select-none"
                     [class.border-slate-850]="alert.acknowledged"
                     [class.border-rose-950]="!alert.acknowledged">
                  <div class="flex justify-between items-start text-[8px] font-mono leading-none">
                    <span class="font-bold px-1.5 py-0.2 rounded"
                          [ngClass]="{'bg-rose-950/50 text-rose-400': alert.severity === 'Critical', 'bg-amber-950/50 text-amber-500': alert.severity === 'High'}">
                      {{ alert.severity }}
                    </span>
                    <span class="text-slate-550">{{ alert.time }}</span>
                  </div>
                  <p class="text-[10px] text-slate-350 leading-tight mt-1 line-clamp-2 truncate">{{ alert.message }}</p>
                  @if (!alert.acknowledged) {
                    <button (click)="ackAlert(alert.id)" class="text-[8px] font-mono bg-amber-500 hover:bg-amber-600 text-slate-950 py-1 px-1.5 rounded font-bold uppercase transition mt-1 self-end shadow-sm cursor-pointer border-0">
                      ACK
                    </button>
                  } @else {
                    <div class="text-[8px] font-mono text-emerald-500 font-bold flex items-center gap-0.5 self-end mt-1.5">
                      <mat-icon class="text-[10px] h-3 w-3 mr-0.5 flex items-center justify-center">check_circle</mat-icon> ACKNOWLEDGED
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Slate overlay dialog component for "NEW LOG" activity registration -->
    @if (showNewLogModal()) {
      <div class="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4 antialiased font-sans">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          
          <div class="p-4 bg-slate-950 border-b border-slate-850 flex justify-between items-center text-xs text-slate-300 font-mono">
            <span class="font-bold flex items-center gap-1.5"><mat-icon class="text-amber-500 text-base">engineering</mat-icon> AUTHENTICATE REPAIR CONTRACT</span>
            <button (click)="showNewLogModal.set(false)" class="text-slate-400 hover:text-slate-100 transition cursor-pointer select-none focus:outline-none border-0 p-0 bg-transparent"><mat-icon>close</mat-icon></button>
          </div>

          <div class="p-5 flex flex-col gap-4 text-xs text-slate-300">
            <!-- Equipment ID selection -->
            <div class="flex flex-col gap-1.5">
              <label for="modal-eq" class="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Target Heavy Machinery</label>
              <select id="modal-eq" [value]="newLogEqId()" (change)="onSelectEq($event)"
                      class="bg-slate-950 border border-slate-705 text-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono">
                <option value="">-- Choose Machinery ID --</option>
                @for (eq of equipments(); track eq.id) {
                  <option [value]="eq.id">{{ eq.id }} - {{ eq.name }} ({{ eq.status }})</option>
                }
              </select>
            </div>

            <!-- Technician Name & Cost -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="modal-tech" class="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Technician Name</label>
                <input id="modal-tech" type="text" [value]="newLogTech()" (input)="newLogTech.set(getInputValue($event))" placeholder="S. Vance"
                       class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="modal-cost" class="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Repair Cost (AUD)</label>
                <input id="modal-cost" type="number" [value]="newLogCost()" (input)="onInputCost($event)"
                       class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono">
              </div>
            </div>

            <!-- Overhaul type selection -->
            <div class="flex flex-col gap-1.5">
              <label for="modal-lvl" class="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Overhaul Classification</label>
              <select id="modal-lvl" [value]="newLogType()" (change)="onSelectType($event)"
                      class="bg-slate-950 border border-slate-705 text-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500">
                <option value="Scheduled">Scheduled Major Overhaul</option>
                <option value="Preventative">Preventative Maintenance Cycle</option>
                <option value="Emergency">Emergency Breakdown Overhaul</option>
              </select>
            </div>

            <!-- Technical overview notes -->
            <div class="flex flex-col gap-1.5">
              <label for="modal-notes" class="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Structural Diagnostic / Notes</label>
              <textarea id="modal-notes" rows="3" [value]="newLogNotes()" (input)="newLogNotes.set(getInputValue($event))" placeholder="Repacked wheel alignment pins, configured hydraulic pump telemetry indexes."
                        class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 h-16 resize-noneMobile"></textarea>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2.5 mt-1.5 select-none font-sans">
              <button (click)="submitNewLog()"
                      class="flex-1 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-lg text-xs transition tracking-wide text-center cursor-pointer">
                LOG TO ERP
              </button>
              <button (click)="showNewLogModal.set(false)"
                      class="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-semibold rounded-lg text-xs transition cursor-pointer">
                CANCEL
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
    
    /* Strict scrollbar styles specifically target internal element lists without polluting page layouts */
    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.4);
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 2px;
    }
  `]
})
export class Dashboard {
  private miningService = inject(MiningDataService);
  private transService = inject(TranslationService);

  public equipments = this.miningService.equipments;
  public teams = this.miningService.teams;
  public workOrders = this.miningService.workOrders;
  public kpis = this.miningService.kpis;
  public alerts = this.miningService.systemAlerts;

  // Modern 5-Panel Tactical Selector state (Replaces nested vertical tabs)
  public activePanel = signal<string>('kpis');
  
  public showNewLogModal = signal<boolean>(false);
  public showExportToast = signal<boolean>(false);

  // New Log interactive fields
  public newLogEqId = signal<string>('');
  public newLogType = signal<'Emergency' | 'Scheduled' | 'Preventative'>('Scheduled');
  public newLogTech = signal<string>('');
  public newLogCost = signal<number>(4500);
  public newLogNotes = signal<string>('');

  public t = computed(() => this.transService.translate());
  public isPt = computed(() => this.transService.activeLang() === 'pt-BR');

  // Modular 5-panel tactical layout structure
  public panels = [
    { id: 'kpis', nameKey: 'CORE KPIs', namePt: 'Métricas e Alvos' },
    { id: 'map', nameKey: 'LIVE SITE MAP', namePt: 'Mapa em Tempo Real' },
    { id: 'queues', nameKey: 'PM & WORK QUEUES', namePt: 'Fila de Operações' },
    { id: 'trends', nameKey: 'ANALYTICS TRENDS', namePt: 'Gráficos de Tendência' },
    { id: 'logs', nameKey: 'ERP DIAGNOSTICS/LOGS', namePt: 'Logs e Telemetria' }
  ];

  public currentPanelIndex = computed(() => 
    this.panels.findIndex(p => p.id === this.activePanel())
  );

  public activePanelName = computed(() => {
    const isBrazil = this.isPt();
    const activeIdx = this.currentPanelIndex();
    const panel = this.panels[activeIdx >= 0 ? activeIdx : 0];
    return isBrazil ? panel.namePt : panel.nameKey;
  });

  public prevPanel() {
    const idx = this.currentPanelIndex();
    const prevIdx = (idx - 1 + this.panels.length) % this.panels.length;
    this.activePanel.set(this.panels[prevIdx].id);
  }

  public nextPanel() {
    const idx = this.currentPanelIndex();
    const nextIdx = (idx + 1) % this.panels.length;
    this.activePanel.set(this.panels[nextIdx].id);
  }

  // Input bindings helper
  public getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  public onSelectEq(event: Event) {
    this.newLogEqId.set((event.target as HTMLSelectElement).value);
  }

  public onSelectType(event: Event) {
    this.newLogType.set((event.target as HTMLSelectElement).value as 'Emergency' | 'Scheduled' | 'Preventative');
  }

  public onInputCost(event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.newLogCost.set(isNaN(val) ? 0 : val);
  }

  public exportData() {
    this.showExportToast.set(true);
    setTimeout(() => {
      this.showExportToast.set(false);
    }, 3000);
  }

  public submitNewLog() {
    if (!this.newLogEqId() || !this.newLogTech() || !this.newLogNotes()) {
      alert(this.isPt() ? 'Certifique-se de preencher todos os campos para registrar o log com segurança!' : 'Please fill all mandatory fields to record the overhaul log safely!');
      return;
    }

    this.miningService.addMaintenanceLog({
      equipmentId: this.newLogEqId(),
      type: this.newLogType(),
      technician: this.newLogTech(),
      cost: this.newLogCost(),
      notes: this.newLogNotes()
    });

    this.showNewLogModal.set(false);
    this.newLogTech.set('');
    this.newLogNotes.set('');
  }

  public unacknowledgedAlerts = computed(() => 
    this.alerts().filter(a => !a.acknowledged)
  );

  public totalEquipment = computed(() => this.equipments().length);

  public upcomingPMs = computed(() => 
    this.equipments()
      .filter(eq => eq.status !== 'Decommissioned')
      .sort((a, b) => new Date(a.nextMaintenanceDate).getTime() - new Date(b.nextMaintenanceDate).getTime())
      .slice(0, 3)
  );

  public recentsLogs = computed(() => 
    this.miningService.maintenanceLogs()
  );

  public recentWorkOrders = computed(() => 
    this.workOrders()
  );

  public statusCount(status: string): number {
    return this.equipments().filter(eq => eq.status === status).length;
  }

  public statusPercent(status: string): number {
    const total = this.totalEquipment();
    if (total === 0) return 0;
    return Math.round((this.statusCount(status) / total) * 100);
  }

  public ackAlert(id: string) {
    this.miningService.acknowledgeAlert(id);
  }
}
