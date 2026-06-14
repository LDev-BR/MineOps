import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MiningDataService, Team, Equipment } from '../../services/mining-data.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Top Command Block -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
          <mat-icon class="text-sky-500">groups</mat-icon> {{ isPt() ? 'GESTÃO DE EQUIPES DE CAMPO' : 'CREW OPERATIONS MANAGEMENT' }}
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
          {{ isPt() ? 'Registro de Forças de Terra &bull; Alocação de Escala e Auditoria de Perfomance' : 'Ground Forces Registry &bull; Shift Allocations & Performance Auditing' }}
        </p>
      </div>

      <!-- Action Button: Register Team -->
      <button (click)="openTeamModal()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs px-4 py-2 rounded shadow transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer">
        <mat-icon class="text-sm">group_add</mat-icon> {{ isPt() ? 'IMPLANTAR NOVA EQUIPE' : 'COMMISSION NEW FIELD CREW' }}
      </button>
    </div>

    <!-- main high-density landscape view layout split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Crew Cards Listing Grid (Left Spans 7) -->
      <div class="lg:col-span-7 flex flex-col gap-4">
        
        <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>{{ isPt() ? 'Equipes Ativas de Campo: ' : 'Active Squad Sinks: ' }}<span class="text-slate-200 font-bold font-mono">{{ teams().length }} {{ isPt() ? 'Equipes' : 'Crews' }}</span></span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {{ isPt() ? 'Ciclo de Escala: A/C Ativo' : 'Shift rotation: A/C active' }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (team of teams(); track team.id) {
            <div (click)="selectTeam(team)" 
                 (keydown.enter)="selectTeam(team)"
                 role="button"
                 tabindex="0"
                 [attr.aria-label]="team.name"
                 class="bg-slate-850 rounded-xl border p-4 shadow-lg cursor-pointer transition flex flex-col gap-3 group relative select-none outline-none focus:ring-1 focus:ring-amber-500"
                 [ngClass]="{
                   'border-amber-500 ring-2 ring-amber-500/10 bg-slate-800/80': selectedTeam()?.id === team.id,
                   'border-slate-800 hover:border-slate-700': selectedTeam()?.id !== team.id
                 }">
              
              <!-- Card title details -->
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">{{ team.id }}</span>
                  <h3 class="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition mt-0.5 leading-tight">{{ team.name }}</h3>
                </div>

                <!-- Circular performance dial indicator -->
                <div class="w-8 h-8 rounded-full flex flex-col items-center justify-center font-mono font-bold text-[10px]"
                     [ngClass]="{
                       'bg-emerald-950 text-emerald-400 border border-emerald-800': team.performanceIndex >= 92,
                       'bg-amber-950 text-amber-500 border border-amber-800': team.performanceIndex < 92
                     }">
                  {{ team.performanceIndex }}%
                </div>
              </div>
              <div class="border-t border-b border-slate-800/60 py-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                <div>
                  <span class="text-slate-550 block text-[8px] uppercase">{{ isPt() ? 'Supervisor de Escala' : 'Roster Supervisor' }}</span>
                  <span class="text-slate-200 font-bold truncate block">{{ team.supervisor }}</span>
                </div>
                <div>
                  <span class="text-slate-550 block text-[8px] uppercase">{{ isPt() ? 'Equipe de Operadores' : 'Roster Headcount' }}</span>
                  <span class="text-slate-200 font-bold block">{{ team.membersCount }} {{ isPt() ? 'Operadores' : 'Operators' }}</span>
                </div>
              </div>

              <!-- footer badge for layout -->
              <div class="flex justify-between items-center text-[10px] font-mono">
                <span class="text-slate-500 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">{{ team.shift }}</span>
                <span class="text-slate-400 truncate max-w-[120px] italic flex items-center gap-0.5">
                  <mat-icon class="text-xs text-slate-600">place</mat-icon> {{ team.currentLocation }}
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Detail Card Board (Right Spans 5) -->
      <div class="lg:col-span-5 bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-6 sticky top-20">
        @if (selectedTeam(); as team) {
          
          <!-- Detail panel Header card -->
          <div class="border-b border-slate-800 pb-4">
            <span class="text-[9px] font-mono tracking-widest font-bold text-amber-500 uppercase">{{ isPt() ? 'DOSSIÊ DETALHADO DO SQUAD' : 'DETAILED SQUAD OVERVIEW DOSSIER' }}</span>
            <h2 class="text-base font-bold font-mono text-slate-100 mt-1 uppercase">{{ team.name }}</h2>
            <div class="flex flex-wrap items-center gap-2 mt-2 font-mono text-[10px]">
              <span class="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">{{ team.id }}</span>
              <span class="bg-sky-950 text-sky-450 px-2   py-0.5 rounded border border-sky-810 font-bold">{{ team.shift }}</span>
            </div>
          </div>

          <!-- Performance Audit scorecard meter -->
          <div class="flex flex-col gap-2.5">
            <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">{{ isPt() ? 'COEFICIENTES DE PERFORMANCE OPERACIONAL' : 'OPERATIONAL PERFORMANCE COEFFICIENTS' }}</h4>
            <div class="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center gap-5 relative overflow-hidden">
              <!-- circular radial gauge -->
              <div class="shrink-0 relative w-16 h-16 rounded-full border-4 border-slate-850 flex flex-col items-center justify-center font-mono font-black text-slate-100 text-base"
                   [ngClass]="{
                     'border-t-emerald-500 border-r-emerald-505': team.performanceIndex >= 90,
                     'border-t-amber-500': team.performanceIndex < 90
                   }">
                {{ team.performanceIndex }}%
                <span class="text-[7px] text-slate-550 block font-normal leading-tight mt-0.5 bg-slate-900 border border-slate-800 px-1 py-0.2 rounded">OQE INDEX</span>
              </div>
              
              <div class="flex-1 text-[11px] font-mono text-slate-400 flex flex-col gap-1.5">
                <div class="flex justify-between">
                  <span>{{ isPt() ? 'CONFORMIDADE DE SEGURANÇA:' : 'SAFETY COMPLIANCE VALUE:' }}</span>
                  <span class="text-emerald-400 font-bold">99.8% ACC</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ isPt() ? 'LATÊNCIA DE DESPACHO:' : 'DISPATCH LATENCY VALUE:' }}</span>
                  <span class="text-slate-200">1.2m {{ isPt() ? 'MÉDIA' : 'AVERAGE' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ isPt() ? 'HAULAGE TARGET FULFILLMENT:' : 'HAULAGE TARGET FULFILLMENT:' }}</span>
                  <span class="text-amber-500 font-bold">102.4% {{ isPt() ? 'SUPERADO' : 'OVERAGE' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Main responsibilities panel -->
          <div class="flex flex-col gap-2">
            <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">{{ isPt() ? 'DIRETRIZ DE MISSÃO PRINCIPAL DO TURNO' : 'CORE SHIFT MISSION DIRECTIVE' }}</h4>
            <div class="p-3.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-350 leading-relaxed font-sans italic">
              "{{ team.responsibilities }}"
            </div>
          </div>

          <!-- Assigned machinery heavy physical assets list -->
          <div class="flex flex-col gap-2.5">
            <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">{{ isPt() ? 'FROTA DE MÁQUINAS DESIGNADA' : 'ASSIGNED MACHINERY FLEET' }}</h4>
            
            <div class="flex flex-col gap-2">
              @if (team.assignedEquipmentIds.length === 0) {
                <p class="text-xs font-mono text-slate-550 italic p-3 bg-slate-900 rounded">{{ isPt() ? 'Nenhum ativo principal despachado atualmente.' : 'No major assets dispatched currently.' }}</p>
              } @else {
                @for (eq of getAssignedEquipment(team.assignedEquipmentIds); track eq.id) {
                  <div class="p-3 bg-slate-900 border border-slate-800 rounded flex justify-between items-center hover:border-slate-705 transition">
                    <div>
                      <span class="text-[11px] font-bold font-mono text-slate-250 block">{{ eq.id }}</span>
                      <span class="text-[10px] text-slate-450 font-sans block mt-0.5">{{ eq.name }} ({{ eq.model }})</span>
                    </div>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold"
                          [ngClass]="{
                            'bg-emerald-950 text-emerald-400 border border-emerald-800': eq.status === 'Operational',
                            'bg-amber-900/30 text-amber-500 border border-amber-800': eq.status === 'Under Maintenance',
                            'bg-rose-950/40 text-rose-400 border border-rose-800': eq.status === 'Breakdown'
                          }">
                      {{ eq.status }}
                    </span>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Core ground crew deployment roster roster list -->
          <div class="flex flex-col gap-2.5">
            <div class="flex justify-between items-center">
              <h4 class="text-xs font-bold font-mono tracking-wide text-slate-300 uppercase">SHIFT PERSONNEL ROSTER ({{ team.membersCount }} STAFF)</h4>
              <span class="text-[10px] font-mono text-slate-500">Supervisor: {{ team.supervisor }}</span>
            </div>

            <!-- Scrollable personnel roster list -->
            <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-slate-950 p-2.5 border border-slate-800 rounded">
              @for (name of team.members; track name) {
                <div class="p-2 bg-slate-900 rounded border border-slate-800 font-sans text-slate-300 text-[11px] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> {{ name }}
                </div>
              }
            </div>
          </div>

          <!-- Spatial Tracking coordinate details -->
          <div class="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>Grid Coordinates: {{ team.latitude }}, {{ team.longitude }}</span>
            <span class="text-slate-650">PostGIS Registered</span>
          </div>

        } @else {
          <div class="p-12 text-center text-xs text-slate-500 font-mono py-24">
            {{ isPt() ? 'Selecione uma equipe operacional ativa para exibir o dossiê completo de rastreamento.' : 'Select an active operational crew squad to display the full dossier tracking indices.' }}
          </div>
        }
      </div>

    </div>

    <!-- REGISTER TEAM POPUP MODAL DIALOG -->
    @if (teamModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          <div class="h-1 bg-amber-500"></div>

          <div class="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-slate-100">
            <h3 class="font-mono font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <mat-icon class="text-amber-500">group_add</mat-icon> Ground Crew Authorization Declaration
            </h3>
            <button (click)="closeTeamModal()" class="text-slate-400 hover:text-slate-100 transition p-1 rounded hover:bg-slate-850">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="p-5 flex flex-col gap-4 text-xs font-sans text-slate-300">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="t-id-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Squad Code ID</label>
                <input id="t-id-input" #tId type="text" placeholder="TM-06"
                       class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-650 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="t-name-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Crew / squad Display name</label>
                <input id="t-name-input" #tName type="text" placeholder="West Wall Drilling Unit B"
                       class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="t-supervisor-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Superintendent / supervisor</label>
                <input id="t-supervisor-input" #tSupervisor type="text" placeholder="Eng. Albert Wesker"
                       class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="t-shift-select" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Roster Shift Rotation</label>
                <select id="t-shift-select" #tShift class="bg-slate-950 border border-slate-705 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500">
                  <option value="A - Day Shift">A - Day Shift (06:00 - 18:00)</option>
                  <option value="B - Night Shift">B - Night Shift (18:00 - 06:00)</option>
                  <option value="C - Support Shift">C - Support Shift (As Required)</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="t-obj-textarea" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Primary Core Shift Objective / Mission Code</label>
              <textarea id="t-obj-textarea" #tObjective rows="2" placeholder="Describe main excavation areas, haulage sectors or preventative maintenance goals..."
                        class="bg-slate-950 border border-slate-705 text-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500 resize-none"></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="t-members-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Authorized Personnel Names (Separated by Commas)</label>
              <input id="t-members-input" #tMembers type="text" placeholder="Jill Valentine, Chris Redfield, Leon Kennedy, Claire Redfield"
                     class="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
            </div>

            <div class="flex gap-2.5 mt-4 justify-end">
              <button (click)="closeTeamModal()" class="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono rounded transition">
                CANCEL COMMISSION
              </button>
              <button (click)="commissionTeam(tId.value, tName.value, tSupervisor.value, tShift.value, tObjective.value, tMembers.value)"
                      class="py-2 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold rounded transition tracking-wider">
                COMMIT TEAM TO REGISTRY
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
export class TeamsManagement {
  private miningService = inject(MiningDataService);
  private transService = inject(TranslationService);
  public isPt = computed(() => this.transService.activeLang() === 'pt-BR');

  public teams = this.miningService.teams;
  public equipments = this.miningService.equipments;

  public selectedTeam = signal<Team | null>(null);

  // New team modal trigger
  public teamModalOpen = signal<boolean>(false);

  constructor() {
    // Select first team by default
    const list = this.teams();
    if (list.length > 0) {
      this.selectedTeam.set(list[0]);
    }
  }

  public selectTeam(team: Team) {
    this.selectedTeam.set(team);
  }

  public getAssignedEquipment(equipmentIds: string[]): Equipment[] {
    return this.equipments().filter(eq => equipmentIds.includes(eq.id));
  }

  // Registration modal controller
  public openTeamModal() {
    this.teamModalOpen.set(true);
  }

  public closeTeamModal() {
    this.teamModalOpen.set(false);
  }

  public commissionTeam(id: string, name: string, supervisor: string, shift: string, objective: string, membersStr: string) {
    if (!id || !name || !supervisor || !objective || !membersStr) {
      alert('Must fulfill all technical crew variables for registry authorization.');
      return;
    }

    const membersArr = membersStr.split(',').map(m => m.trim()).filter(m => m.length > 0);

    const newTeam: Team = {
      id: id.trim().toUpperCase(),
      name: name.trim(),
      supervisor: supervisor.trim(),
      membersCount: membersArr.length,
      assignedEquipmentIds: [],
      currentLocation: 'Unassigned Base',
      latitude: -23.149,
      longitude: 119.35,
      shift: shift as 'A - Day Shift' | 'B - Night Shift' | 'C - Support Shift',
      performanceIndex: 90,
      members: membersArr,
      responsibilities: objective.trim()
    };

    this.miningService.createTeam(newTeam);
    this.selectedTeam.set(newTeam);
    this.closeTeamModal();
    alert(`Ground Force Squadron ${id} commissioned and logged, shift coverage updated.`);
  }
}
