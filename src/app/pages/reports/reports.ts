import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../services/translation.service';

interface PerformanceReport {
  id: string;
  title: string;
  timestamp: string;
  category: string;
  author: string;
  fileSize: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Dynamic Non-blocking alert system toast banner -->
    @if (toastMsg()) {
      <div class="p-3.5 mb-4 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 flex justify-between items-center text-xs animate-fade-in shadow-xl select-none">
        <span class="flex items-center gap-2">
          <mat-icon class="text-emerald-500 text-sm">check_circle</mat-icon>
          <span class="font-medium tracking-wide">{{ toastMsg() }}</span>
        </span>
        <button (click)="toastMsg.set(null)" class="text-emerald-400 hover:text-emerald-100 transition p-1 rounded hover:bg-emerald-900/20 cursor-pointer">
          <mat-icon class="text-sm">close</mat-icon>
        </button>
      </div>
    }

    <!-- Top Command Block -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
          <mat-icon class="text-blue-500">query_stats</mat-icon> {{ isPt() ? 'RELATÓRIOS E DIRETRIZES DE ANÁLISE' : 'ANALYTICS & DIRECTIVE REPORTING' }}
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
          {{ isPt() ? 'Índice de Relatórios Corporativos &bull; Tabelas Históricas e Motores de Exportação' : 'Enterprise Reporting Index &bull; Historical Datatables & Export Engines' }}
        </p>
      </div>

      <!-- Quick Export controls -->
      <button (click)="exportAllReports()" class="bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs px-4 py-2 rounded shadow transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer">
        <mat-icon class="text-sm">cloud_download</mat-icon> {{ isPt() ? 'EXPORTAR EM LOTE (Sincronização Spring Boot)' : 'BATCH EXPORT ALL (Spring Boot Sync)' }}
      </button>
    </div>

    <!-- Live Performance Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Widget 1: Fleet availability metric -->
      <div class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
        <div class="flex justify-between items-start text-slate-400">
          <span class="text-[10px] font-bold font-mono tracking-wider uppercase">{{ isPt() ? 'MÉDIA MTBF DA FROTA' : 'MTBF FLEET AVERAGE' }}</span>
          <mat-icon class="text-blue-400 text-sm">monitor_heart</mat-icon>
        </div>
        <div class="mt-1">
          <span class="text-3xl font-black font-mono text-slate-100">184.2 <span class="text-xs text-slate-500">HRS</span></span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">
          {{ isPt() ? 'Tempo Médio Entre Falhas da frota de máquinas pesadas. Melhoria de 8.4% desde o reinício da rotação de turnos.' : 'Mean Time Between Failures for heavy machinery fleet. Improved by 8.4% since shift rotation restart.' }}
        </p>
        <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
          <div class="bg-blue-500 h-full rounded-full" style="width: 78%"></div>
        </div>
      </div>

      <!-- Widget 2: MTTR metric -->
      <div class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
        <div class="flex justify-between items-start text-slate-400">
          <span class="text-[10px] font-bold font-mono tracking-wider uppercase">{{ isPt() ? 'TAXA DE SERVIÇO MTTR' : 'MTTR SERVICE RATE' }}</span>
          <mat-icon class="text-orange-500 text-sm">timelapse</mat-icon>
        </div>
        <div class="mt-1">
          <span class="text-3xl font-black font-mono text-slate-100">2.1 <span class="text-xs text-slate-500">HRS</span></span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">
          {{ isPt() ? 'Tempo Médio de Reparo. Representa a janela média de resposta da equipe de engenharia para incidentes.' : 'Mean Time To Repair. Represents average engineering response log window for breakdown events.' }}
        </p>
        <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
          <div class="bg-orange-500 h-full rounded-full" style="width: 45%"></div>
        </div>
      </div>

      <!-- Widget 3: Overall Compliance -->
      <div class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
        <div class="flex justify-between items-start text-slate-400">
          <span class="text-[10px] font-bold font-mono tracking-wider uppercase">{{ isPt() ? 'ADERÊNCIA PM (PREVENTIVA)' : 'PM COMPLIANCE GRADE' }}</span>
          <mat-icon class="text-emerald-500 text-sm">verified_user</mat-icon>
        </div>
        <div class="mt-1">
          <span class="text-3xl font-black font-mono text-slate-100">96.8%</span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">
          {{ isPt() ? 'Manutenções preventivas concluídas rigorosamente antes do limite do SLA (Prontificado para Auditoria Keycloak).' : 'Preventative Maintenance tasks resolved before target SLA threshold limit (ready for Keycloak Audit).' }}
        </p>
        <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
          <div class="bg-emerald-500 h-full rounded-full" style="width: 96%"></div>
        </div>
      </div>

    </div>

    <!-- Main Reports Dashboard split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Query / Export Center selector -->
      <div class="lg:col-span-5 bg-slate-850 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-bold font-mono text-slate-200 tracking-wider uppercase">{{ isPt() ? 'GERADOR DE DIRETRIZES SOB DEMANDA' : 'ON-DEMAND DIRECTIVE GENERATOR' }}</h3>
          <p class="text-[10px] text-slate-400 font-mono uppercase mt-0.5">{{ isPt() ? 'Gere manifestos CSV ou JSON de alta densidade no padrão integrado' : 'Generate high-density CSV or JSON manifests' }}</p>
        </div>

        <div class="flex flex-col gap-3 font-mono text-xs">
          <div class="flex flex-col gap-1.5">
            <label for="rep-target-select" class="text-[10px] font-bold text-slate-400 uppercase">{{ isPt() ? 'Escopo Alvo da Análise' : 'Analysis Target Frame' }}</label>
            <select id="rep-target-select" #repTarget class="bg-slate-950 border border-slate-705 text-slate-200 rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-500">
              <option value="fleet">{{ isPt() ? 'Disponibilidade Operacional da Frota de Ativos' : 'All Heavy Assets Operational Availability' }}</option>
              <option value="wo">{{ isPt() ? 'Fluxos e Limites de SLA das Ordens de Serviço' : 'Completed & Active Work Order SLA Pipelines' }}</option>
              <option value="crews">{{ isPt() ? 'Índice de Produtividade de Equipes de Campo' : 'Socio-Technical Squad Performance Index' }}</option>
              <option value="alarms">{{ isPt() ? 'Alertas de Seguranças e Histórico de Alarme de Sistema' : 'System Diagnostic & Alarm Failure History' }}</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="rep-scope-select" class="text-[10px] font-bold text-slate-400 uppercase">{{ isPt() ? 'Filtro Temporal' : 'Temporal Scope' }}</label>
            <select id="rep-scope-select" #repScope class="bg-slate-950 border border-slate-705 text-slate-200 rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-500">
              <option value="shift">{{ isPt() ? 'Turno Ativo Corrente (Fração-A)' : 'Current Active Shift (A-Day)' }}</option>
              <option value="daily">{{ isPt() ? 'Sumário das Operações de 24 Horas' : '24-Hour Operations Summary' }}</option>
              <option value="weekly">{{ isPt() ? 'Métricas de Controle Semanal (7 Dias)' : 'Weekly Operational Baseline (7 Days)' }}</option>
              <option value="monthly">{{ isPt() ? 'Revisão Mensal Regulatória e SLA' : 'Monthly Compliance Review' }}</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="rep-format-select" class="text-[10px] font-bold text-slate-400 uppercase">{{ isPt() ? 'Formato do Manifesto de Exportação' : 'Export Manifest Format' }}</label>
            <select id="rep-format-select" #repFormat class="bg-slate-950 border border-slate-705 text-slate-200 rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-500">
              <option value="CSV">{{ isPt() ? 'Valores Separados por Ponto-e-Vírgula CSV (.csv)' : 'Semicolon-Delimited CSV (.csv)' }}</option>
              <option value="JSON">{{ isPt() ? 'Nó Estruturado Normalized PostgreSQL JSON (.json)' : 'PostgreSQL Normalized JSON (.json)' }}</option>
              <option value="XML">{{ isPt() ? 'Estrutura XML de Compliance Camunda BPMN (.xml)' : 'Camunda BPMN Compliant XML (.xml)' }}</option>
            </select>
          </div>

          <button (click)="generateCustomReportDirect(repTarget.value, repScope.value, repFormat.value)"
                  class="mt-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded transition shadow tracking-wider text-[11px] cursor-pointer uppercase font-mono">
            {{ isPt() ? 'COMPILAR E BAIXAR DIRETRIZES' : 'COMPILE & DOWNLOAD DIRECTIVE DATA' }}
          </button>
        </div>
      </div>

      <!-- Generated / Stored PDF/CSV catalog -->
      <div class="lg:col-span-7 bg-slate-850 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h3 class="text-xs font-bold font-mono text-slate-200 tracking-wider uppercase">{{ isPt() ? 'ÍNDICE DE CONTROLE DOCUMENTAL HISTÓRICO' : 'HISTORIC DOCUMENT CONTROL INDEX' }}</h3>
          <p class="text-[10px] text-slate-400 font-mono uppercase mt-0.5">{{ isPt() ? 'Logs de arquivos regulatórios emitidos em conformidade fiscal' : 'Stored reports and regulatory compliance logs' }}</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/60 select-none">
                <th class="p-3">Ref Code</th>
                <th class="p-3">{{ isPt() ? 'Detalhes do Relatório' : 'Report Details' }}</th>
                <th class="p-3">{{ isPt() ? 'Segmento' : 'Segment' }}</th>
                <th class="p-3">{{ isPt() ? 'Data de Geração' : 'Generated Date' }}</th>
                <th class="p-3 text-right">{{ isPt() ? 'Ações' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 bg-slate-950/20">
              @for (rep of listReports(); track rep.id) {
                <tr class="hover:bg-slate-900/60 transition group">
                  <td class="p-3 font-mono font-bold text-blue-400">{{ rep.id }}</td>
                  <td class="p-3">
                    <span class="font-bold text-slate-200 block group-hover:text-blue-400 transition">{{ rep.title }}</span>
                    <span class="text-[10px] text-slate-450 mt-0.5">{{ isPt() ? 'Tamanho real:' : 'Fitted size:' }} {{ rep.fileSize }} &bull; {{ isPt() ? 'Autor:' : 'Author:' }} {{ rep.author }}</span>
                  </td>
                  <td class="p-3 font-mono text-xs text-slate-350">{{ rep.category }}</td>
                  <td class="p-3 font-mono text-slate-450">{{ rep.timestamp }}</td>
                  <td class="p-3 text-right">
                    <button (click)="downloadGenericReportFile(rep)" class="p-1.5 bg-slate-900 hover:bg-slate-805 text-blue-400 hover:text-blue-300 border border-slate-755 rounded transition cursor-pointer">
                      <mat-icon class="text-sm">download</mat-icon>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
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
export class ReportsPage {
  private transService = inject(TranslationService);
  public isPt = computed(() => this.transService.activeLang() === 'pt-BR');

  public toastMsg = signal<string | null>(null);

  public listReports = computed<PerformanceReport[]>(() => {
    return [
      {
        id: 'REP-2026-06-14',
        title: this.isPt() ? 'Análise do Fator de Carga de Escavadeira no Sítio Alfa' : 'Site Alpha Excavator Load Factor Analysis',
        category: this.isPt() ? 'Telemetria de Máquinas' : 'Machinery Telemetry',
        timestamp: '2026-06-14 06:12',
        author: 'E. J. Morrison',
        fileSize: '1.24 MB'
      },
      {
        id: 'REP-2026-06-12',
        title: this.isPt() ? 'Logs de Estratégia de Risco de Rotação de Turno em Pilbara' : 'Pilbara Shift Rotation Risk Strategy Logs',
        category: this.isPt() ? 'Auditoria de Conformidade' : 'Compliance Audit',
        timestamp: '2026-06-12 18:45',
        author: 'H. Thompson',
        fileSize: '840 KB'
      },
      {
        id: 'REP-2026-06-10',
        title: this.isPt() ? 'Índices de Desgaste de Pneus e Temperatura do Braço Hidráulico' : 'Tire Wear & Hydraulic Arm Heat Indexes',
        category: this.isPt() ? 'Saúde da Frota' : 'Fleet Health',
        timestamp: '2026-06-10 11:20',
        author: 'S. Vance',
        fileSize: '2.56 MB'
      },
      {
        id: 'REP-2026-06-07',
        title: this.isPt() ? 'Coordenadas PostGIS de Bancada de Extração Georreferenciada' : 'Geospatial Extraction Bench PostGIS Coordinates',
        category: this.isPt() ? 'Mapa Espacial da Mina' : 'Mine Spatial Map',
        timestamp: '2026-06-07 09:30',
        author: 'M. Chen (GIS)',
        fileSize: '4.82 MB'
      }
    ];
  });

  public showToast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => {
      if (this.toastMsg() === msg) {
        this.toastMsg.set(null);
      }
    }, 4500);
  }

  public downloadGenericReportFile(rep: PerformanceReport) {
    const msg = this.isPt()
      ? `O relatório unificado [${rep.id}] foi obtido da nuvem com sucesso. Tamanho: ${rep.fileSize}.`
      : `File document [${rep.id}] is successfully pulled from storage stack. Download size: ${rep.fileSize}.`;
    this.showToast(msg);
  }

  public generateCustomReportDirect(target: string, scope: string, format: string) {
    const msg = this.isPt()
      ? `Pipeline de relatório autorizado. Download direto gerado no formato ${format} compatível com o schema PostgreSQL.`
      : `Report pipeline authorized. Direct download query generated format ${format} matching Spring Boot schema.`;
    this.showToast(msg);
  }

  public exportAllReports() {
    const msg = this.isPt()
      ? "Processando pacote de exportação unificado com logs históricos (PostGIS, Camunda BPM, auditoria Keycloak). Pronto para o Spring Boot."
      : "Processing master export zip of historical logs (PostGIS datasets, Camunda BPM, keycloak schema records). Ready for Spring Boot sync.";
    this.showToast(msg);
  }
}
