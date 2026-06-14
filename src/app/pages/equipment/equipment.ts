import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MiningDataService, Equipment, EquipmentType, EquipmentStatus } from '../../services/mining-data.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-equipment',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- header section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
          <mat-icon class="text-amber-500">construction</mat-icon> {{ isPt() ? 'ATIVOS DA FROTA PESADA' : 'HEAVY FLEET ASSETS' }}
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
          {{ isPt() ? 'Registro de Ativos &bull; Telemetria da Frota em Tempo Real' : 'Enterprise Asset Registry &bull; Realtime Fleet Telemetry Logs' }}
        </p>
      </div>

      <!-- Action Button: Register Asset -->
      <button (click)="openRegistrationModal()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs px-4 py-2 rounded shadow transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer">
        <mat-icon class="text-sm">add_box</mat-icon> {{ isPt() ? 'REGISTRAR MÁQUINA PESADA' : 'REGISTER HEAVY MACHINERY' }}
      </button>
    </div>

    <!-- main split container -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start relative">
      
      <!-- List & Table Column (Spans 12 or 8 depending on detail drawer state) -->
      <div [ngClass]="{'xl:col-span-8': selectedEquipment(), 'xl:col-span-12': !selectedEquipment()}" 
           class="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden shadow-lg transition-all duration-300">
        
        <!-- Filter and Search ribbon -->
        <div class="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Text Search input -->
          <div class="relative flex-1 max-w-md">
            <input [value]="searchQuery()" (input)="onSearchChange($event)" type="text" [placeholder]="isPt() ? 'Buscar por identificador, nome, modelo, local...' : 'Search by asset identifier, name, model, locations...'"
                   class="w-full bg-slate-950 border border-slate-700 rounded pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono">
            <mat-icon class="absolute left-3 top-2.5 text-slate-550 text-sm">search</mat-icon>
            @if (searchQuery()) {
              <button (click)="clearSearch()" class="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            }
          </div>

          <!-- Type and Status filters Dropdowns -->
          <div class="flex flex-wrap items-center gap-2.5">
            <select [value]="typeFilter()" (change)="onTypeFilterChange($event)"
                    class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer">
              <option value="ALL">{{ isPt() ? 'Frota: TODOS OS TIPOS' : 'Fleet: ALL TYPES' }}</option>
              <option value="Excavator">{{ isPt() ? 'Escavadeiras' : 'Excavators' }}</option>
              <option value="Dump Truck">{{ isPt() ? 'Caminhões Basculantes' : 'Dump Trucks' }}</option>
              <option value="Drilling Machine">{{ isPt() ? 'Perfuratrizes' : 'Rotary Drills' }}</option>
              <option value="Loader">{{ isPt() ? 'Pá Carregadeiras' : 'Wheel Loaders' }}</option>
              <option value="Bulldozer">{{ isPt() ? 'Tratores de Esteira' : 'Bulldozers' }}</option>
            </select>

            <select [value]="statusFilter()" (change)="onStatusFilterChange($event)"
                    class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer">
              <option value="ALL">{{ isPt() ? 'Status: TODOS' : 'Status: ALL VALUES' }}</option>
              <option value="Operational">{{ isPt() ? 'Operacional' : 'Operational' }}</option>
              <option value="Under Maintenance">{{ isPt() ? 'Em Manutenção' : 'Under Maintenance' }}</option>
              <option value="Standby">{{ isPt() ? 'Standby' : 'Standby' }}</option>
              <option value="Breakdown">{{ isPt() ? 'Parado (Falha/Pane)' : 'Breakdown' }}</option>
            </select>

            <!-- Reset Filters -->
            @if (hasActiveFilters()) {
              <button (click)="resetFilters()" class="text-xs font-mono text-amber-500 hover:text-amber-400 font-bold px-2 py-2 transition flex items-center gap-1 cursor-pointer">
                <mat-icon class="text-sm">filter_alt_off</mat-icon> {{ isPt() ? 'LIMPAR' : 'RESET' }}
              </button>
            }
          </div>
        </div>

        <!-- Density tabular database -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/60">
                <th class="p-3 w-12 text-center">{{ isPt() ? 'Saúde' : 'Health' }}</th>
                <th class="p-3 cursor-pointer hover:bg-slate-800 transition" (click)="toggleSort('id')">
                  {{ isPt() ? 'Cód. Ativo' : 'Asset ID' }} <span class="text-[9px] text-slate-500 font-bold">@if (sortBy() === 'id') { {{ sortAsc() ? '▲' : '▼' }} }</span>
                </th>
                <th class="p-3 cursor-pointer hover:bg-slate-800 transition" (click)="toggleSort('name')">
                  {{ isPt() ? 'Detalhes da Máquina' : 'Machine Details' }} <span class="text-[9px] text-slate-500 font-bold">@if (sortBy() === 'name') { {{ sortAsc() ? '▲' : '▼' }} }</span>
                </th>
                <th class="p-3">{{ isPt() ? 'Fabricante' : 'Manufacturer' }}</th>
                <th class="p-3">{{ isPt() ? 'Localização Atual' : 'Current Location' }}</th>
                <th class="p-3 cursor-pointer hover:bg-slate-800 transition text-center" (click)="toggleSort('hours')">
                  {{ isPt() ? 'Horas Acumuladas' : 'Hours Logged' }} <span class="text-[9px] text-slate-500 font-bold">@if (sortBy() === 'hours') { {{ sortAsc() ? '▲' : '▼' }} }</span>
                </th>
                <th class="p-3">{{ isPt() ? 'Próxima P.M.' : 'Next Scheduled PM' }}</th>
                <th class="p-3 text-right">{{ isPt() ? 'Estado Operacional' : 'Operational State' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 bg-slate-950/20">
              @if (paginatedEquipments().length === 0) {
                <tr>
                  <td colspan="8" class="p-8 text-center text-slate-500 font-mono py-12">
                    {{ isPt() ? 'Nenhum ativo localizado sob os filtros de pesquisa atuais.' : 'No registry rows match searching constraints.' }}
                  </td>
                </tr>
              } @else {
                @for (eq of paginatedEquipments(); track eq.id) {
                  <tr (click)="selectEquipment(eq)" 
                      class="hover:bg-slate-900/80 cursor-pointer transition"
                      [ngClass]="{'bg-slate-800 text-slate-100 border-l-2 border-amber-500': selectedEquipment()?.id === eq.id}">
                    <!-- Custom Health Radial index icon -->
                    <td class="p-3 text-center">
                      <div class="w-7 h-7 rounded-sm flex items-center justify-center font-mono font-bold text-[10px] shadow-sm"
                           [ngClass]="{
                             'bg-emerald-950 text-emerald-400 border border-emerald-800': eq.healthScore >= 90,
                             'bg-amber-950/80 text-amber-500 border border-amber-800': eq.healthScore < 90 && eq.healthScore >= 70,
                             'bg-rose-950 text-rose-500 border border-rose-800': eq.healthScore < 70
                           }">
                        {{ eq.healthScore }}%
                      </div>
                    </td>
                    <td class="p-3 font-mono font-bold text-slate-300">{{ eq.id }}</td>
                    <td class="p-3">
                      <span class="font-bold text-slate-200 block">{{ eq.name }}</span>
                      <span class="text-[10px] text-slate-450 block font-mono">{{ eq.model }} &bull; {{ eq.type }}</span>
                    </td>
                    <td class="p-3 text-slate-350 font-sans">{{ eq.manufacturer }}</td>
                    <td class="p-3 font-mono text-[11px] text-slate-400 flex items-center gap-1 mt-1.5">
                      <mat-icon class="text-xs text-slate-550 h-3 w-3 leading-none">place</mat-icon> {{ eq.location }}
                    </td>
                    <td class="p-3 text-center font-mono font-medium text-slate-300">
                      {{ eq.operationalHours | number }}
                    </td>
                    <td class="p-3 font-mono text-[11px] text-slate-400">{{ eq.nextMaintenanceDate }}</td>
                    <td class="p-3 text-right">
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase text-slate-100"
                            [ngClass]="{
                              'bg-emerald-600': eq.status === 'Operational',
                              'bg-amber-505 text-slate-950': eq.status === 'Under Maintenance',
                              'bg-indigo-600': eq.status === 'Standby',
                              'bg-rose-600': eq.status === 'Breakdown',
                              'bg-slate-700': eq.status === 'Decommissioned'
                            }">
                        {{ eq.status }}
                      </span>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Custom high-density pagination dashboard -->
        <div class="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-450 select-none">
          <div>
            {{ isPt() ? 'Exibindo' : 'Showing' }} <span class="text-slate-250 font-bold">{{ startRecord() }}</span>-<span class="text-slate-250 font-bold">{{ endRecord() }}</span> 
            {{ isPt() ? 'de' : 'of' }} <span class="text-slate-250 font-bold">{{ filteredEquipments().length }}</span> {{ isPt() ? 'registros' : 'records' }}
          </div>
          <div class="flex items-center gap-2">
            <button (click)="prevPage()" [disabled]="currentPage() === 1" 
                    class="p-1 px-2.5 bg-slate-950 rounded border border-slate-705 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:hover:text-slate-400 transition flex items-center cursor-pointer">
              <mat-icon class="text-[15px] h-4 w-4">keyboard_arrow_left</mat-icon>
            </button>
            <span class="text-slate-350 py-1">{{ isPt() ? 'PÁGINA' : 'PAGE' }} {{ currentPage() }} {{ isPt() ? 'DE' : 'OF' }} {{ totalPages() || 1 }}</span>
            <button (click)="nextPage()" [disabled]="currentPage() === totalPages() || totalPages() === 0" 
                    class="p-1 px-2.5 bg-slate-950 rounded border border-slate-705 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:hover:text-slate-400 transition flex items-center cursor-pointer">
              <mat-icon class="text-[15px] h-4 w-4">keyboard_arrow_right</mat-icon>
            </button>
          </div>
        </div>

      </div>

      <!-- Detail Slide-Over / Static Panel Column (Spans 4) -->
      @if (selectedEquipment(); as eq) {
        <div class="xl:col-span-4 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col gap-5 sticky top-20">
          
          <!-- Drawer Header stripe -->
          <div class="h-1.5 w-full"
               [ngClass]="{
                 'bg-emerald-500': eq.status === 'Operational',
                 'bg-amber-500': eq.status === 'Under Maintenance',
                 'bg-indigo-500': eq.status === 'Standby',
                 'bg-rose-600': eq.status === 'Breakdown'
               }"></div>

          <!-- Drawer title details -->
          <div class="px-5 pt-1.5 flex justify-between items-start">
            <div>
              <p class="text-[10px] font-mono text-slate-400 font-bold tracking-wider uppercase">{{ isPt() ? 'DOSSIÊ DE REGISTRO DO ATIVO' : 'MACHINERY ARCHIVE DOSSIER' }}</p>
              <h2 class="text-base font-bold font-mono text-slate-100 flex items-center gap-1.5 mt-0.5">
                {{ eq.id }}
              </h2>
              <p class="text-xs text-slate-350 font-medium">{{ eq.name }}</p>
            </div>
            <button (click)="closeDetails()" class="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition cursor-pointer">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Panel core properties content -->
          <div class="px-5 pb-5 flex flex-col gap-5 text-xs">
            
            <!-- Quick Command State Controls -->
            <div class="p-3 bg-slate-900 border border-slate-700 rounded-lg flex flex-col gap-2">
              <span class="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block font-bold">{{ isPt() ? 'DIRETIVA ADMINISTRATIVA: FORÇAR ESTADO' : 'ADMIN DIRECTIVE: OVERRIDE STATE' }}</span>
              <div class="flex gap-1.5">
                <button (click)="changeAssetStatus(eq.id, 'Operational')" 
                        class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-[9px] font-mono font-bold uppercase transition hover:border-emerald-500 text-emerald-400 cursor-pointer"
                        [class.bg-emerald-950]="eq.status === 'Operational'">
                  {{ isPt() ? 'Disponível' : 'Operate' }}
                </button>
                <button (click)="changeAssetStatus(eq.id, 'Under Maintenance')" 
                        class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-[9px] font-mono font-bold uppercase transition hover:border-amber-500 text-amber-400 cursor-pointer"
                        [class.bg-amber-950]="eq.status === 'Under Maintenance'">
                  {{ isPt() ? 'Oficina' : 'Workshop' }}
                </button>
                <button (click)="changeAssetStatus(eq.id, 'Breakdown')" 
                        class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-[9px] font-mono font-bold uppercase transition hover:border-rose-500 text-rose-500 cursor-pointer"
                        [class.bg-rose-950]="eq.status === 'Breakdown'">
                  {{ isPt() ? 'Falha' : 'Breakdown' }}
                </button>
              </div>
            </div>

            <!-- Technical attributes grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-900/60 p-2.5 rounded border border-slate-750 font-mono">
                <span class="text-slate-500 block text-[9px] uppercase font-bold">FLEET TYPE</span>
                <span class="text-slate-200 block text-[11px] font-bold mt-0.5">{{ eq.type }}</span>
              </div>
              <div class="bg-slate-900/60 p-2.5 rounded border border-slate-750 font-mono">
                <span class="text-slate-500 block text-[9px] uppercase font-bold">MANUFACTURER</span>
                <span class="text-slate-200 block text-[11px] font-bold mt-0.5">{{ eq.manufacturer }}</span>
              </div>
              <div class="bg-slate-900/60 p-2.5 rounded border border-slate-750 font-mono">
                <span class="text-slate-500 block text-[9px] uppercase font-bold">MODEL VALUE</span>
                <span class="text-slate-200 block text-[11px] font-bold mt-0.5">{{ eq.model }}</span>
              </div>
              <div class="bg-slate-900/60 p-2.5 rounded border border-slate-750 font-mono">
                <span class="text-slate-500 block text-[9px] uppercase font-bold">HEALTH FACTOR</span>
                <span class="font-bold block text-[11px] mt-0.5"
                      [ngClass]="{'text-emerald-455': eq.healthScore >= 90, 'text-amber-500': eq.healthScore < 90 && eq.healthScore >= 70, 'text-rose-500': eq.healthScore < 70}">
                  {{ eq.healthScore }}% COEFFICIENT
                </span>
              </div>
            </div>

            <!-- Operational Telemetry Indicators section -->
            <div class="flex flex-col gap-2.5 border-t border-slate-700 pt-3.5">
              <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">REAL-TIME FIELD TELEMETRY</h4>
              
              <!-- Simulated Health / Fuel gauge panel -->
              <div class="bg-slate-950 p-3 rounded border border-slate-800 flex flex-col gap-3 font-mono">
                
                <!-- fuel bar -->
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between text-[10px] text-slate-450">
                    <span>HYDROCARBON FUEL CELL LEVEL</span>
                    <span class="font-bold tracking-wider" [class.text-amber-400]="eq.fuelLevel < 35">{{ eq.fuelLevel }}%</span>
                  </div>
                  <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full rounded-full transition-all duration-500" [style.width]="eq.fuelLevel + '%'"></div>
                  </div>
                </div>

                <!-- temperature vibration meters -->
                <div class="grid grid-cols-2 gap-3 text-[10px] text-slate-400">
                  <div class="border-l-2 border-slate-700 pl-2">
                    <span class="text-slate-550 block text-[8px] uppercase">Engine Temp</span>
                    <span class="text-slate-200 font-bold text-xs" [class.text-rose-400]="tempSim(eq.status) > 105">{{ tempSim(eq.status) }}&deg;C</span>
                  </div>
                  <div class="border-l-2 border-slate-700 pl-2">
                    <span class="text-slate-550 block text-[8px] uppercase">Vibrations</span>
                    <span class="text-slate-200 font-bold text-xs" [class.text-rose-400]="vibSim(eq.status) > 12">{{ vibSim(eq.status) }} mm/s</span>
                  </div>
                </div>

              </div>
            </div>

            <!-- Maintenance Scheduling Timeline -->
            <div class="flex flex-col gap-2 border-t border-slate-700 pt-3.5">
              <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">MAINTENANCE SCHEDULING SYSTEM</h4>
              <div class="p-3 bg-slate-900/40 border border-slate-750 rounded">
                <div class="flex justify-between border-b border-slate-750 pb-1.5 mb-1.5 font-mono text-[11px] text-slate-400">
                  <span>LAST COMPLETION REPORT:</span>
                  <span class="text-slate-200 font-bold">{{ eq.lastMaintenanceDate }}</span>
                </div>
                <div class="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>NEXT TIER DIRECTIVE:</span>
                  <span class="text-amber-500 font-bold animate-pulse">{{ eq.nextMaintenanceDate }}</span>
                </div>
              </div>
            </div>

            <!-- Geospatial layout simulation target -->
            <div class="flex flex-col gap-2 border-t border-slate-700 pt-3.5">
              <div class="flex justify-between items-center">
                <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">GEOSPATIAL COORDINATES (PostGIS Ready)</h4>
                <span class="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-black">● LOCATED</span>
              </div>
              <div class="p-3 bg-slate-950 font-mono text-[10px] text-slate-450 border border-slate-800 rounded flex flex-col gap-1 relative overflow-hidden">
                <div>LATITUDE: <span class="text-slate-200 font-bold ml-1">{{ eq.latitude | number:'1.6-6' }}</span></div>
                <div>LONGITUDE: <span class="text-slate-200 font-bold ml-1">{{ eq.longitude | number:'1.6-6' }}</span></div>
                <div class="text-[8px] text-slate-600 uppercase mt-1 border-t border-slate-850 pt-1">GRID INDEX: SECTION ELEY-A-6</div>
                
                <!-- Graphic mock compass/radar -->
                <div class="absolute right-3 top-3 w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center animate-spin" style="animation-duration: 20s">
                  <div class="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <!-- Dispatched field crews supervisor details -->
            @if (getTeamForEquipment(eq.assignedTeamId); as crew) {
              <div class="flex flex-col gap-2 border-t border-slate-700 pt-3.5">
                <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">COORDINATED GROUND PERSONNEL</h4>
                <div class="p-3 bg-slate-900 border border-slate-750 rounded flex gap-3 items-center">
                  <div class="w-9 h-9 rounded bg-slate-850 border border-slate-700 flex items-center justify-center text-slate-300">
                    <mat-icon>groups</mat-icon>
                  </div>
                  <div>
                    <p class="font-bold text-slate-250 text-xs">{{ crew.name }}</p>
                    <p class="text-[10px] text-slate-450 font-mono uppercase mt-0.5">Supervisor: <span class="text-amber-500 font-bold">{{ crew.supervisor }}</span></p>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
      }

    </div>

    <!-- REGISTER ASSET POPUP MODAL DIALOG -->
    @if (modalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          <div class="h-1 bg-amber-500"></div>
          
          <div class="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-slate-100">
            <h3 class="font-mono font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <mat-icon class="text-amber-500">add_to_photos</mat-icon> Machinery Entry Declaration
            </h3>
            <button (click)="closeRegistrationModal()" class="text-slate-400 hover:text-slate-100 transition p-1 rounded hover:bg-slate-800">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="p-5 flex flex-col gap-4 text-xs font-sans text-slate-300">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="eq-id-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Unique Asset ID Code</label>
                <input id="eq-id-input" #newId type="text" placeholder="EQ-EXC-215" 
                       class="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-650 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="eq-name-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Machinery Display Name</label>
                <input id="eq-name-input" #newName type="text" placeholder="Caterpillar High Capacity Exc"
                       class="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="eq-model-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Technical Model Identifier</label>
                <input id="eq-model-input" #newModel type="text" placeholder="6060 FS"
                       class="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-650 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="eq-type-select" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Fleet Core Type</label>
                <select id="eq-type-select" #newType class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500">
                  <option value="Excavator">Excavators</option>
                  <option value="Dump Truck">Dump Trucks</option>
                  <option value="Drilling Machine">Rotary Drills</option>
                  <option value="Loader">Wheel Loaders</option>
                  <option value="Bulldozer">Bulldozers</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="eq-manuf-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Manufacturer Corporation</label>
                <input id="eq-manuf-input" #newManuf type="text" placeholder="Caterpillar"
                       class="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="eq-team-select" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Dispatched Ground Unit Supervisor</label>
                <select id="eq-team-select" #newTeam class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500">
                  <option value="TM-01">Alpha Heavy Shovel Crew (Sarah Jenkins)</option>
                  <option value="TM-02">Alpha Haulage Crew (Marcus Keller)</option>
                  <option value="TM-03">Delta Maintenance (Robert Chen)</option>
                  <option value="TM-04">Beta Drills (Yousef Al-Fayed)</option>
                  <option value="TM-05">Crusherfeed Crew (Elena Rostova)</option>
                </select>
              </div>
            </div>
            
            <div class="flex flex-col gap-1.5">
              <label for="eq-loc-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Geospatial Operational Placement Place</label>
              <input id="eq-loc-input" #newLoc type="text" placeholder="Pit Alpha - East Bench Tier 4"
                     class="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
            </div>

            <div class="flex gap-2.5 mt-4 justify-end">
              <button (click)="closeRegistrationModal()" class="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono rounded transition">
                CANCEL DECLARATION
              </button>
              <button (click)="registerMachinery(newId.value, newName.value, newModel.value, newType.value, newManuf.value, newLoc.value, newTeam.value)" 
                      class="py-2 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold rounded transition tracking-wider">
                COMMIT TO FLEET REGISTER
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
      gap: 1.5rem;
      width: 100%;
    }
  `]
})
export class EquipmentManagement {
  private miningService = inject(MiningDataService);
  private transService = inject(TranslationService);

  public isPt = computed(() => this.transService.activeLang() === 'pt-BR');
  public equipments = this.miningService.equipments;
  public teams = this.miningService.teams;

  // Search and Filter States using Signals
  public searchQuery = signal<string>('');
  public typeFilter = signal<string>('ALL');
  public statusFilter = signal<string>('ALL');

  // Sorting columns state
  public sortBy = signal<string>('id');
  public sortAsc = signal<boolean>(true);

  // Pagination states
  public currentPage = signal<number>(1);
  public recordsPerPage = 6;

  // Selected details target
  public selectedEquipment = signal<Equipment | null>(null);

  // Registration modal controller
  public modalOpen = signal<boolean>(false);

  // Computations
  public hasActiveFilters = computed(() => 
    this.searchQuery() !== '' || this.typeFilter() !== 'ALL' || this.statusFilter() !== 'ALL'
  );

  public filteredEquipments = computed(() => {
    let list = this.equipments();
    const query = this.searchQuery().toLowerCase().trim();
    const typeF = this.typeFilter();
    const statusF = this.statusFilter();

    if (query) {
      list = list.filter(eq => 
        eq.id.toLowerCase().includes(query) ||
        eq.name.toLowerCase().includes(query) ||
        eq.model.toLowerCase().includes(query) ||
        eq.location.toLowerCase().includes(query)
      );
    }

    if (typeF !== 'ALL') {
      list = list.filter(eq => eq.type === typeF);
    }

    if (statusF !== 'ALL') {
      list = list.filter(eq => eq.status === statusF);
    }

    // Sort list
    const factor = this.sortAsc() ? 1 : -1;
    const criterion = this.sortBy();

    list = [...list].sort((a, b) => {
      if (criterion === 'id') {
        return a.id.localeCompare(b.id) * factor;
      }
      if (criterion === 'name') {
        return a.name.localeCompare(b.name) * factor;
      }
      if (criterion === 'hours') {
        return (a.operationalHours - b.operationalHours) * factor;
      }
      return 0;
    });

    return list;
  });

  public paginatedEquipments = computed(() => {
    const list = this.filteredEquipments();
    const startIdx = (this.currentPage() - 1) * this.recordsPerPage;
    return list.slice(startIdx, startIdx + this.recordsPerPage);
  });

  public totalPages = computed(() => 
    Math.ceil(this.filteredEquipments().length / this.recordsPerPage)
  );

  public startRecord = computed(() => {
    if (this.filteredEquipments().length === 0) return 0;
    return (this.currentPage() - 1) * this.recordsPerPage + 1;
  });

  public endRecord = computed(() => {
    const total = this.filteredEquipments().length;
    const target = this.currentPage() * this.recordsPerPage;
    return target > total ? total : target;
  });

  // Action methods
  public onSearchChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.currentPage.set(1); // reset page
  }

  public onTypeFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.typeFilter.set(val);
    this.currentPage.set(1);
  }

  public onStatusFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(val);
    this.currentPage.set(1);
  }

  public resetFilters() {
    this.searchQuery.set('');
    this.typeFilter.set('ALL');
    this.statusFilter.set('ALL');
    this.currentPage.set(1);
  }

  public clearSearch() {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  public toggleSort(field: string) {
    if (this.sortBy() === field) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortBy.set(field);
      this.sortAsc.set(true);
    }
    this.currentPage.set(1);
  }

  public selectEquipment(eq: Equipment) {
    this.selectedEquipment.set(eq);
  }

  public closeDetails() {
    this.selectedEquipment.set(null);
  }

  public changeAssetStatus(id: string, status: EquipmentStatus) {
    this.miningService.updateEquipmentStatus(id, status);
    // Refresh local signal detail if selected
    const curr = this.selectedEquipment();
    if (curr && curr.id === id) {
      const fresh = this.equipments().find(e => e.id === id);
      if (fresh) {
        this.selectedEquipment.set(fresh);
      }
    }
  }

  public getTeamForEquipment(teamId: string) {
    return this.teams().find(t => t.id === teamId);
  }

  // Next Page prev Page
  public prevPage() {
    this.currentPage.update(p => Math.max(1, p - 1));
  }

  public nextPage() {
    this.currentPage.update(p => Math.min(this.totalPages(), p + 1));
  }

  // Registration modal triggers
  public openRegistrationModal() {
    this.modalOpen.set(true);
  }

  public closeRegistrationModal() {
    this.modalOpen.set(false);
  }

  public registerMachinery(id: string, name: string, model: string, type: string, manuf: string, loc: string, teamId: string) {
    if (!id || !name || !model || !manuf || !loc) {
      alert('Must fulfill all technical machinery fields for regulatory registration compliance.');
      return;
    }

    this.miningService.createEquipment({
      id: id.trim().toUpperCase(),
      name: name.trim(),
      model: model.trim(),
      type: type as EquipmentType,
      manufacturer: manuf.trim(),
      status: 'Standby',
      location: loc.trim(),
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      nextMaintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTeamId: teamId
    });

    this.closeRegistrationModal();
    alert(`Machinery ${id} logged to operational state database.`);
  }

  // Simulated telemetry engines
  public tempSim(status: string): number {
    if (status === 'Operational') return Math.round(92 + Math.random() * 8);
    if (status === 'Breakdown') return 126;
    if (status === 'Under Maintenance') return 40;
    return 20; // Ambient temperature on standby
  }

  public vibSim(status: string): number {
    if (status === 'Operational') return parseFloat((4.2 + Math.random() * 2).toFixed(1));
    if (status === 'Breakdown') return 18.4;
    if (status === 'Under Maintenance') return 0.5;
    return 0.1;
  }
}
