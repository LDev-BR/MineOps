import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MiningDataService, WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../services/mining-data.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Top Command Block -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
          <mat-icon class="text-amber-500">assignment</mat-icon> {{ isPt() ? 'KANBAN DE ORDENS DE SERVIÇO' : 'CONTROL KANBAN WORKFLOW' }}
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
          {{ isPt() ? 'Fluxo de Trabalho de Operações &bull; Pipeline de Manutenção Preventiva e Reparos' : 'Operations Workflow &bull; Preventative Maintenance & Repairs Pipeline (Camunda Ready)' }}
        </p>
      </div>

      <!-- Action Button: Open Work Order modal -->
      <button (click)="openCreatorModal()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs px-4 py-2 rounded shadow transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer">
        <mat-icon class="text-sm">add_task</mat-icon> {{ isPt() ? 'DECLARAR ORDEM DE SERVIÇO' : 'DECLARE WORK ORDER UNIT' }}
      </button>
    </div>

    <!-- Filters Ribbon -->
    <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
      <div class="flex items-center gap-3">
        <span>{{ isPt() ? 'Filtrar Prioridade:' : 'Filter Priority:' }}</span>
        <select [value]="priorityFilter()" (change)="onPriorityFilterChange($event)"
                class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer">
          <option value="ALL">{{ isPt() ? 'Prioridade: TODAS' : 'Priority: ALL' }}</option>
          <option value="Low">{{ isPt() ? 'Baixa' : 'Low' }}</option>
          <option value="Medium">{{ isPt() ? 'Média' : 'Medium' }}</option>
          <option value="High">{{ isPt() ? 'Alta' : 'High' }}</option>
          <option value="Critical">{{ isPt() ? 'Crítica' : 'Critical' }}</option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-rose-600"></span> {{ isPt() ? 'Alarmes Críticos' : 'Critical Alarms' }}</span>
        <span>{{ isPt() ? 'Ordens Ativas:' : 'Backlog:' }} <span class="text-slate-200 font-bold">{{ filteredWorkOrders().length }} {{ isPt() ? 'Ordens de Serviço' : 'Active Orders' }}</span></span>
      </div>
    </div>

    <!-- Core Kanban Columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto select-none">
      
      <!-- Columns loop -->
      @for (column of columns; track column) {
        <div class="bg-slate-850 rounded-xl border border-slate-800 flex flex-col min-h-[550px] shrink-0">
          
          <!-- Column Header -->
          <div class="p-3.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 rounded-t-xl">
            <span class="font-mono text-xs font-bold tracking-wider text-slate-300 uppercase">
              {{ isPt() ? (column === 'Open' ? 'Aberto' : column === 'Under Review' ? 'Em Revisão' : column === 'Approved' ? 'Aprovado' : column === 'In Progress' ? 'Em Progresso' : 'Concluído') : column }}
            </span>
            <span class="text-[10px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-708 rounded-full h-5 w-5 flex items-center justify-center">
              {{ getCountForStatus(column) }}
            </span>
          </div>

          <!-- Column Cards body -->
          <div class="flex-1 p-3 flex flex-col gap-3 max-h-[600px] overflow-y-auto bg-slate-900/60">
            @if (getOrdersForStatus(column).length === 0) {
              <div class="border border-dashed border-slate-800 text-slate-650 rounded-xl p-6 text-center text-[11px] font-mono italic my-4 py-8">
                {{ isPt() ? 'Nenhuma ordem ativa neste estágio do pipeline.' : 'No orders active in this pipeline state.' }}
              </div>
            } @else {
              @for (wo of getOrdersForStatus(column); track wo.id) {
                <!-- Individual high-density work order card -->
                <div class="bg-slate-800 border p-3.5 rounded-lg shadow flex flex-col gap-3 group relative hover:border-slate-600 transition"
                     [ngClass]="{
                       'border-l-4 border-l-rose-600 border-slate-750': wo.priority === 'Critical',
                       'border-l-4 border-l-amber-500 border-slate-750': wo.priority === 'High',
                       'border-l-4 border-l-sky-500 border-slate-750': wo.priority === 'Medium',
                       'border-l-4 border-l-slate-400 border-slate-750': wo.priority === 'Low'
                     }">
                  
                  <!-- ID, Priority & Card Controls -->
                  <div class="flex justify-between items-baseline gap-2">
                    <span class="text-[10px] font-mono font-bold text-amber-500">{{ wo.id }}</span>
                    
                    <span class="text-[8px] font-mono px-1.5 py-0.2 rounded font-black uppercase text-slate-100"
                          [ngClass]="{
                            'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse': wo.priority === 'Critical',
                            'bg-amber-950 text-amber-500 border border-amber-800': wo.priority === 'High',
                            'bg-sky-950 text-sky-400 border border-sky-800': wo.priority === 'Medium',
                            'bg-slate-900 border border-slate-700 text-slate-400': wo.priority === 'Low'
                          }">
                      {{ isPt() ? (wo.priority === 'Critical' ? 'Crítica' : wo.priority === 'High' ? 'Alta' : wo.priority === 'Medium' ? 'Média' : 'Baixa') : wo.priority }}
                    </span>
                  </div>

                  <!-- Textual payload -->
                  <div>
                    <h4 class="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition leading-snug">{{ wo.title }}</h4>
                    <p class="text-[11px] text-slate-450 line-clamp-2 mt-1 leading-normal">{{ wo.description }}</p>
                  </div>

                  <!-- Details affected machines & teams -->
                  <div class="border-t border-slate-750 pt-2.5 flex flex-col gap-1.5 text-[10px] font-mono text-slate-400">
                    <div class="flex items-center gap-1">
                      <mat-icon class="text-xs text-slate-550 h-3 w-3 leading-none">construction</mat-icon> 
                      <span>{{ isPt() ? 'Ativo' : 'Asset' }}: <span class="text-slate-300 font-bold">{{ wo.equipmentId }}</span></span>
                    </div>
                    <div class="flex items-center gap-1">
                      <mat-icon class="text-xs text-slate-550 h-3 w-3 leading-none">groups</mat-icon>
                      <span>{{ isPt() ? 'Equipe' : 'Crew' }}: <span class="text-slate-300 font-bold truncate max-w-[120px]">{{ getTeamName(wo.assignedTeamId) }}</span></span>
                    </div>
                    <div class="flex justify-between items-center border-t border-slate-755/30 pt-1.5 mt-0.5 text-slate-500">
                      <span>{{ isPt() ? 'PRAZO' : 'DUE' }}: {{ wo.dueDate }}</span>
                    </div>
                  </div>

                  <!-- accessible workflow control ribbon -->
                  <div class="flex justify-between items-center border-t border-slate-755/50 pt-2 mt-0.5">
                    <span class="text-[8px] uppercase tracking-wider font-bold text-slate-500 font-mono">{{ isPt() ? 'Mover Para' : 'Move State' }}:</span>
                    <div class="flex items-center gap-1">
                      <!-- Move back button -->
                      <button (click)="moveStatus(wo.id, column, -1)" [disabled]="column === 'Open'"
                              class="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition flex items-center cursor-pointer">
                        <mat-icon class="text-xs font-bold h-3 w-3 leading-none">arrow_back</mat-icon>
                      </button>
                      
                      <!-- Quick Status selector dropdown -->
                      <select [value]="column" (change)="onStatusSelectChange(wo.id, $event)"
                              class="bg-slate-900 border border-slate-700 text-slate-300 text-[9px] font-mono rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-500 cursor-pointer">
                        @for (col of columns; track col) {
                          <option [value]="col">{{ isPt() ? (col === 'Open' ? 'Aberto' : col === 'Under Review' ? 'Em Revisão' : col === 'Approved' ? 'Aprovado' : col === 'In Progress' ? 'Em Progresso' : 'Concluído') : col }}</option>
                        }
                      </select>

                      <!-- Move next button -->
                      <button (click)="moveStatus(wo.id, column, 1)" [disabled]="column === 'Completed'"
                              class="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition flex items-center cursor-pointer">
                        <mat-icon class="text-xs font-bold h-3 w-3 leading-none">arrow_forward</mat-icon>
                      </button>
                    </div>
                  </div>

                </div>
              }
            }
          </div>

        </div>
      }

    </div>

    <!-- CREATE WORK ORDER POPUP MODAL DIALOG -->
    @if (creatorOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          <div class="h-1 bg-amber-500"></div>

          <div class="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-slate-100">
            <h3 class="font-mono font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <mat-icon class="text-amber-500">assignment</mat-icon> {{ isPt() ? 'Declaração de Diretriz de Manutenção' : 'Maintenance Directive Declaration' }}
            </h3>
            <button (click)="closeCreatorModal()" class="text-slate-400 hover:text-slate-100 transition p-1 rounded hover:bg-slate-850 cursor-pointer">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="p-5 flex flex-col gap-4 text-xs font-sans text-slate-300">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="wo-eq-select" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">{{ isPt() ? 'Ativo Pesado Alvo' : 'Target Heavy Asset' }}</label>
                <select id="wo-eq-select" #eqSelect class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer">
                  @for (eq of equipments(); track eq.id) {
                    <option [value]="eq.id">{{ eq.id }} - {{ eq.name }}</option>
                  }
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="wo-team-select" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">{{ isPt() ? 'Equipe de Campo Despachada' : 'Dispatched Ground Unit Crew' }}</label>
                <select id="wo-team-select" #teamSelect class="bg-slate-950 border border-slate-700 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer">
                  @for (team of teams(); track team.id) {
                    <option [value]="team.id">{{ team.id }} - {{ team.name }} ({{ team.supervisor }})</option>
                  }
                </select>
              </div>

              <div class="flex flex-col gap-1.5 col-span-2">
                <label for="wo-title-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">{{ isPt() ? 'Título da Tarefa / Detalhes da Missão' : 'Task Title / Mission Details' }}</label>
                <input id="wo-title-input" #woTitle type="text" [placeholder]="isPt() ? 'ex: Recalibração do Braço Hidráulico de 250h' : '250-hr Hydraulic Arm Recalibration'"
                       class="bg-slate-950 border border-slate-705 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500">
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="wo-priority-select" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">{{ isPt() ? 'Nível de Gravidade da Prioridade' : 'Priority Level Severity' }}</label>
                <select id="wo-priority-select" #woPri class="bg-slate-950 border border-slate-750 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer">
                  <option value="Low">{{ isPt() ? 'Baixa - Preventiva' : 'Low - Preventative' }}</option>
                  <option value="Medium">{{ isPt() ? 'Média - Reparo Padrão' : 'Medium - Standard Repair' }}</option>
                  <option value="High">{{ isPt() ? 'Alta - Falha Grave' : 'High - Major Fault' }}</option>
                  <option value="Critical">{{ isPt() ? 'Crítica - Alerta de Segurança/Parada' : 'Critical - Safety/Shutdown Alert' }}</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="wo-date-input" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">{{ isPt() ? 'Prazo Limite para Resolução' : 'Target Resolution Due Date' }}</label>
                <input id="wo-date-input" #woDate type="date" value="2026-06-20"
                       class="bg-slate-950 border border-slate-750 text-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer">
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="wo-desc-textarea" class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">{{ isPt() ? 'Instruções de Trabalho Detalhadas' : 'Full Directive Work Instructions' }}</label>
              <textarea id="wo-desc-textarea" #woDesc rows="3" [placeholder]="isPt() ? 'Descreva o fluxo de ações, ferramentas necessárias e diretrizes de conformidade para revisar, soldar ou substituir...' : 'Funnels of actions, necessary tools, and compliance guidelines to repack, overhaul, weld or replace...'"
                        class="bg-slate-950 border border-slate-705 text-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500 resize-none"></textarea>
            </div>

            <div class="flex gap-2.5 mt-4 justify-end">
              <button (click)="closeCreatorModal()" class="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono rounded transition cursor-pointer">
                {{ isPt() ? 'CANCELAR DECLARAÇÃO' : 'CANCEL DECLARATION' }}
              </button>
              <button (click)="createWorkOrderUnit(woTitle.value, woDesc.value, woPri.value, eqSelect.value, teamSelect.value, woDate.value)"
                      class="py-2 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold rounded transition tracking-wide cursor-pointer">
                {{ isPt() ? 'SALVAR ORDEM NO KANBAN' : 'COMMIT DIRECTIVE TO KANBAN' }}
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
export class WorkOrdersKanban {
  private miningService = inject(MiningDataService);
  private transService = inject(TranslationService);
  public isPt = computed(() => this.transService.activeLang() === 'pt-BR');

  public workOrders = this.miningService.workOrders;
  public equipments = this.miningService.equipments;
  public teams = this.miningService.teams;

  public priorityFilter = signal<string>('ALL');
  
  // Modal controllers
  public creatorOpen = signal<boolean>(false);

  public columns: WorkOrderStatus[] = [
    'Open',
    'Under Review',
    'Approved',
    'In Progress',
    'Completed'
  ];

  public filteredWorkOrders = computed(() => {
    const list = this.workOrders();
    const priority = this.priorityFilter();

    if (priority === 'ALL') return list;
    return list.filter(wo => wo.priority === priority);
  });

  public getOrdersForStatus(status: WorkOrderStatus): WorkOrder[] {
    return this.filteredWorkOrders().filter(wo => wo.status === status);
  }

  public getCountForStatus(status: WorkOrderStatus): number {
    return this.filteredWorkOrders().filter(wo => wo.status === status).length;
  }

  public onPriorityFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.priorityFilter.set(val);
  }

  public moveStatus(workOrderId: string, currentStatus: WorkOrderStatus, delta: number) {
    const currentIdx = this.columns.indexOf(currentStatus);
    const targetIdx = currentIdx + delta;

    if (targetIdx >= 0 && targetIdx < this.columns.length) {
      const targetStatus = this.columns[targetIdx];
      this.miningService.updateWorkOrderStatus(workOrderId, targetStatus);
    }
  }

  public onStatusSelectChange(workOrderId: string, event: Event) {
    const targetStatus = (event.target as HTMLSelectElement).value as WorkOrderStatus;
    this.miningService.updateWorkOrderStatus(workOrderId, targetStatus);
  }

  public getTeamName(teamId: string): string {
    const team = this.teams().find(t => t.id === teamId);
    return team ? team.name : teamId;
  }

  // Creator Modal
  public openCreatorModal() {
    this.creatorOpen.set(true);
  }

  public closeCreatorModal() {
    this.creatorOpen.set(false);
  }

  public createWorkOrderUnit(title: string, desc: string, priority: string, eqId: string, teamId: string, dueDate: string) {
    if (!title || !desc || !dueDate) {
      alert('Must fulfill all task variables to authorize this maintenance directive.');
      return;
    }

    this.miningService.createWorkOrder({
      title: title.trim(),
      description: desc.trim(),
      priority: priority as WorkOrderPriority,
      status: 'Open',
      assignedTeamId: teamId,
      equipmentId: eqId,
      dueDate: dueDate
    });

    this.closeCreatorModal();
    alert('Directive successfully logged. Dispatched to Kanban board pipelines.');
  }
}
