import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MiningDataService } from '../../services/mining-data.service';
import { TranslationService } from '../../services/translation.service';

interface MapMarker {
  id: string;
  name: string;
  type: 'equipment' | 'team';
  status: string;
  x: number; // percentage of svg width
  y: number; // percentage of svg height
  latitude: number;
  longitude: number;
  details: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Top Command Block -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
          <mat-icon class="text-blue-500">map</mat-icon> {{ isPt() ? 'PORTAL DE INTELIGÊNCIA GEOCIENTÍFICA' : 'GEOSPATIAL INTELLIGENCE PORTAL' }}
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
          {{ isPt() ? 'Índice Espacial da Mina Ativa &bull; Integração de Telemetria Realtime PostGIS' : 'Active Mine Spatial Index &bull; Realtime PostGIS Telemetry Integration' }}
        </p>
      </div>

      <!-- Marker Filters -->
      <div class="flex flex-wrap gap-2 text-xs font-mono">
        <button (click)="filterType.set('ALL')" [class.bg-blue-600]="filterType() === 'ALL'" [class.text-white]="filterType() === 'ALL'"
                class="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition cursor-pointer">
          {{ isPt() ? 'TODOS OS MARCADORES' : 'ALL MARKERS' }}
        </button>
        <button (click)="filterType.set('equipment')" [class.bg-blue-600]="filterType() === 'equipment'" [class.text-white]="filterType() === 'equipment'"
                class="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm">construction</mat-icon> {{ isPt() ? 'MÁQUINAS' : 'MACHINERY' }}
        </button>
        <button (click)="filterType.set('team')" [class.bg-blue-600]="filterType() === 'team'" [class.text-white]="filterType() === 'team'"
                class="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm">groups</mat-icon> {{ isPt() ? 'EQUIPES DESPACHADAS' : 'DISPATCH CREWS' }}
        </button>
      </div>
    </div>

    <!-- Main Spatial Workspace Grid split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- Interactive Grid Landscape Map Element (8-spanned column) -->
      <div class="lg:col-span-8 bg-slate-850 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-lg relative min-h-[500px]">
        
        <!-- Header status panel -->
        <div class="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <span class="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ isPt() ? 'SENSOR BÚSSOLA DA BACIA DE PILBARA ATIVO' : 'PILBARA BASIN SENSOR COMPASS ACTIVE' }}
          </span>
          <span class="text-[10px] font-mono text-slate-500">{{ isPt() ? 'RESOLUÇÃO 0.5 METRACT / CAMADAS VETORIAIS' : 'RESOLUTION 0.5 METRACT / VECTOR-LAYERS' }}</span>
        </div>

        <!-- The Canvas SVG Interactive Map Interface -->
        <div class="flex-1 map-grid relative min-h-[420px] select-none overflow-hidden cursor-crosshair">
          
          <!-- Tactical grid overlay graphics lines -->
          <svg class="absolute inset-0 w-full h-full opacity-35 pointer-events-none">
            <!-- Outlined main quarry border coordinates -->
            <path d="M120 80 L350 40 L580 120 L720 280 L480 380 L180 340 Z" fill="rgba(59,130,246,0.03)" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="5 5" />
            <!-- Inner extraction bench indices -->
            <path d="M160 120 Q320 80 480 160 T680 250" fill="none" stroke="#1E3A8A" stroke-width="1" />
            <path d="M200 180 Q340 140 460 220 T620 310" fill="none" stroke="#1E293B" stroke-width="1" />
            
            <!-- Safe transit runway corridors -->
            <line x1="180" y1="340" x2="350" y2="40" stroke="#10B981" stroke-width="1" stroke-dasharray="3" opacity="0.4" />
          </svg>

          <!-- Standard radar sweeps simulation representation -->
          <div class="absolute inset-0 pointer-events-none opacity-20">
            <div class="absolute w-[600px] h-[600px] border border-blue-500/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" style="animation-duration: 4s"></div>
            <div class="absolute w-[300px] h-[300px] border border-blue-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" style="animation-duration: 8s"></div>
          </div>

          <!-- Dynamic SVG markers -->
          @for (m of filteredMarkers(); track m.id) {
            <div [style.left.%]="m.x" [style.top.%]="m.y"
                 (click)="selectMarker(m)"
                 (keydown.enter)="selectMarker(m)"
                 role="button"
                 tabindex="0"
                 [attr.aria-label]="m.name"
                 class="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition duration-300 group cursor-pointer">
              
              <!-- Indicator ripple/dot -->
              <div class="relative flex items-center justify-center">
                <!-- Outer ripple depending on status -->
                <span class="absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping"
                      [ngClass]="{
                        'bg-emerald-500/40': m.status === 'Operational' || m.status === 'Active',
                        'bg-amber-500/40': m.status === 'Under Maintenance' || m.status === 'Standby',
                        'bg-rose-500/40': m.status === 'Breakdown' || m.status === 'Idle'
                      }"></span>

                <!-- Bullet point -->
                <div class="w-4.5 h-4.5 rounded-full border border-white flex items-center justify-center shadow-md relative"
                     [ngClass]="{
                       'bg-emerald-500': m.status === 'Operational' || m.status === 'Active',
                       'bg-amber-500': m.status === 'Under Maintenance' || m.status === 'Standby',
                       'bg-rose-600': m.status === 'Breakdown' || m.status === 'Idle'
                     }">
                  <mat-icon class="text-[9px] h-3 w-3 leading-none text-slate-100 flex items-center justify-center font-bold">
                    {{ m.type === 'equipment' ? 'construction' : 'groups' }}
                  </mat-icon>
                </div>
              </div>

              <!-- Tooltip text snippet shown on slight hover -->
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-slate-200 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-30 shadow-xl">
                <span class="font-bold text-slate-100">{{ m.id }}</span>: {{ m.name }}
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Detail Panel (4-spanned column) -->
      <div class="lg:col-span-4 flex flex-col gap-5">
        
        <!-- Live Inspector Card -->
        <div class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div class="border-b border-slate-800 pb-3">
            <h3 class="text-xs font-bold font-mono text-slate-200 tracking-wider">{{ isPt() ? 'INSPETOR GEORREFERENCIADO' : 'GEOSPATIAL INSPECTOR' }}</h3>
            <p class="text-[10px] text-slate-400 font-mono uppercase mt-0.5">{{ isPt() ? 'Coordenadas físicas e parâmetros de nós' : 'Physical node coordinates & parameters' }}</p>
          </div>

          @if (selected(); as m) {
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide bg-blue-950 border border-blue-900 px-2 py-0.5 rounded">
                  {{ m.id }}
                </span>
                <span class="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-bold"
                      [ngClass]="{
                        'bg-emerald-950 text-emerald-400 border border-emerald-800': m.status === 'Operational' || m.status === 'Active',
                        'bg-amber-950 text-amber-500 border border-amber-800': m.status === 'Under Maintenance' || m.status === 'Standby',
                        'bg-rose-950 text-rose-450 border border-rose-800': m.status === 'Breakdown'
                      }">
                  {{ m.status }}
                </span>
              </div>

              <div>
                <h4 class="text-sm font-bold text-slate-200">{{ m.name }}</h4>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">{{ m.details }}</p>
              </div>

              <div class="p-3 bg-slate-900 border border-slate-750 rounded font-mono text-xs flex flex-col gap-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">{{ isPt() ? 'POSIÇÃO DA GRADE:' : 'GRID POSITION:' }}</span>
                  <span class="text-slate-300 font-bold">ALPHA-SEC-{{ m.id.slice(-2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">LATITUDE:</span>
                  <span class="text-slate-300 text-xs font-bold font-mono">{{ m.latitude | number:'1.6-6' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">LONGITUDE:</span>
                  <span class="text-slate-300 text-xs font-bold font-mono">{{ m.longitude | number:'1.6-6' }}</span>
                </div>
              </div>

              <div class="p-3 bg-slate-950 rounded border border-slate-800 flex items-center gap-1.5 text-[9px] text-slate-450 uppercase font-mono">
                <mat-icon class="text-blue-500 text-sm">wifi_tethering</mat-icon>
                {{ isPt() ? 'Sincronização: Tempo Real &bull; Último Sinal: 1s Atrás' : 'Telemetry Sync: Realtime &bull; Last Signal: 1s Ago' }}
              </div>
            </div>
          } @else {
            <div class="border border-dashed border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 italic py-16">
              <mat-icon class="text-slate-600 block text-3xl mb-1">location_searching</mat-icon>
              {{ isPt() ? 'Selecione um marcador de máquina ou equipe no mapa para inspecionar as coordenadas em tempo real.' : 'Select a machinery or team marker on the spatial index to inspect realtime coordinates.' }}
            </div>
          }
        </div>

        <!-- Coordinates listing index -->
        <div class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col gap-3 max-h-[300px]">
          <h3 class="text-xs font-bold font-mono text-slate-200 tracking-wider">{{ isPt() ? 'ÍNDICE DE LISTAGEM DE COORDENADAS' : 'INDEX COORD LISTINGS' }}</h3>
          <div class="overflow-y-auto divide-y divide-slate-800 flex-1 pr-1">
            @for (m of filteredMarkers(); track m.id) {
              <div (click)="selectMarker(m)"
                   (keydown.enter)="selectMarker(m)"
                   role="button"
                   tabindex="0"
                   class="py-2 flex justify-between items-center cursor-pointer hover:bg-slate-900/40 px-2 rounded -mx-2 transition"
                   [class.bg-slate-900]="selected()?.id === m.id">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-300">{{ m.id }}</span>
                  <span class="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">{{ m.name }}</span>
                </div>
                <span class="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-750">
                  {{ m.latitude | number:'1.3-3' }}, {{ m.longitude | number:'1.3-3' }}
                </span>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }
  `]
})
export class MapPage {
  private miningService = inject(MiningDataService);
  private transService = inject(TranslationService);
  public isPt = computed(() => this.transService.activeLang() === 'pt-BR');

  public equipments = this.miningService.equipments;
  public teams = this.miningService.teams;

  public filterType = signal<'ALL' | 'equipment' | 'team'>('ALL');
  public selected = signal<MapMarker | null>(null);

  // Generate responsive markers from equipments and teams
  public markers = computed<MapMarker[]>(() => {
    const list: MapMarker[] = [];
    
    // Equipments markers mapped to relative percentages
    this.equipments().forEach((eq) => {
      // Map based on deterministic coordinates in Pilbara
      const latMin = -23.160;
      const latMax = -23.140;
      const lngMin = 119.330;
      const lngMax = 119.370;

      // Calculate simple grid percentage positioning
      const yRel = Math.round(((eq.latitude - latMax) / (latMin - latMax)) * 100);
      const xRel = Math.round(((eq.longitude - lngMin) / (lngMax - lngMin)) * 100);

      list.push({
        id: eq.id,
        name: eq.name,
        type: 'equipment',
        status: eq.status,
        x: Math.max(10, Math.min(xRel, 90)),
        y: Math.max(10, Math.min(yRel, 90)),
        latitude: eq.latitude,
        longitude: eq.longitude,
        details: this.isPt()
          ? `Ativo pesado modelo ${eq.manufacturer} ${eq.model}. Última manutenção realizada em ${eq.lastMaintenanceDate}.`
          : `${eq.manufacturer} ${eq.model} model heavy-duty asset. Last maintained on ${eq.lastMaintenanceDate}.`
      });
    });

    // Teams markers
    this.teams().forEach((t) => {
      const latMin = -23.160;
      const latMax = -23.140;
      const lngMin = 119.330;
      const lngMax = 119.370;

      const yRel = Math.round(((t.latitude - latMax) / (latMin - latMax)) * 100);
      const xRel = Math.round(((t.longitude - lngMin) / (lngMax - lngMin)) * 100);

      list.push({
        id: t.id,
        name: t.name,
        type: 'team',
        status: 'Active',
        x: Math.max(10, Math.min(xRel, 90)),
        y: Math.max(10, Math.min(yRel, 90)),
        latitude: t.latitude,
        longitude: t.longitude,
        details: this.isPt()
          ? `Equipe operacional enviada de ${t.members.length} membros supervisionada por ${t.supervisor}.`
          : `Dispatched operational squad crew of ${t.members.length} members overseen by supervisor ${t.supervisor}.`
      });
    });

    return list;
  });

  public filteredMarkers = computed(() => {
    const type = this.filterType();
    const list = this.markers();
    if (type === 'ALL') return list;
    return list.filter(m => m.type === type);
  });

  public selectMarker(m: MapMarker) {
    this.selected.set(m);
  }
}
