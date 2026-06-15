import { Injectable, signal, computed } from '@angular/core';

export type LangType = 'pt-BR' | 'en-US';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public activeLang = signal<LangType>('en-US');

  constructor() {
    this.detectSystemLanguage();
  }

  private detectSystemLanguage() {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      let saved: LangType | null = null;
      if (typeof localStorage !== 'undefined') {
        saved = localStorage.getItem('mineops_lang') as LangType;
      }
      if (saved === 'pt-BR' || saved === 'en-US') {
        this.activeLang.set(saved);
        return;
      }
      const sysLang = navigator.language || '';
      if (sysLang.toLowerCase().startsWith('pt')) {
        this.activeLang.set('pt-BR');
      } else {
        this.activeLang.set('en-US');
      }
    }
  }

  public setLanguage(lang: LangType) {
    this.activeLang.set(lang);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('mineops_lang', lang);
    }
  }

  // Reactive computed translating helper
  public translate = computed(() => {
    const lang = this.activeLang();
    return (key: string, section = 'common'): string => {
      const dictionary = DICTIONARY[lang] || DICTIONARY['en-US'];
      const sect = dictionary[section];
      if (!sect) return key;
      return sect[key] !== undefined ? sect[key] : key;
    };
  });
}

const DICTIONARY: Record<LangType, Record<string, Record<string, string>>> = {
  'en-US': {
    'common': {
      'MINEOPS': 'MINEOPS',
      'PROTOTYPE': 'PROTOTYPE v2.1',
      'SHIFT': 'SHIFT',
      'SHIFT_A': 'A - Day Shift',
      'ACKNOWLEDGE': 'ACKNOWLEDGE',
      'ACKNOWLEDGED': 'ACKNOWLEDGED',
      'CLOSE_PANEL': 'CLOSE PANEL',
      'SYS_SETTINGS': 'System Settings',
      'LOGOUT': 'Terminate Session',
      'MAIN_PORTAL': 'MAIN PORTAL',
      'FIELD_OPS': 'FIELD OPERATIONS',
      'GEOSPATIAL_SYS': 'GEOSPATIAL SYSTEMS',
      'ANALYTICAL_INDEX': 'ANALYTICAL INDEX',
      'ERP_SYNC': 'ERP STACK: ACTIVE CONNECTED',
      'DASHBOARD': 'Operational Dashboard',
      'FLEET': 'Heavy Fleet Assets',
      'TEAMS': 'Crew Operations',
      'KANBAN': 'Control Kanban',
      'SPATIAL_INDEX': 'Mine Spatial Index',
      'REPORTS': 'Operational Reports',
      'CRITICAL_DIRECTIVES': 'CRITICAL SYSTEM DIRECTIVES',
      'OPS_WARNING': '● Operations Warning',
      'NO_ALERTS': 'No active alerts. Operations running normal.',
      'SETTINGS': 'Settings',
      'LANGUAGE': 'Language',
      'THEME': 'Theme',
      'DARK': 'Dark Theme',
      'LIGHT': 'Light Theme',
      'SYSTEM': 'Use System Theme',
      'SAVE_CONFIG': 'SAVE CONFIGURATION'
    },
    'dashboard': {
      'TITLE': 'OPERATIONAL DASHBOARD',
      'SUBTITLE': 'Operations Intel Portal • Site Alpha: Pilbara Regional Basin',
      'REALTIME': 'REALTIME MONITORING STATE',
      'ALARMS_HEADER': 'UNRESOLVED MASTER ALARMS',
      'CRITICAL_COUNT': 'CRITICAL',
      'DISPATCH_MAINT': 'DISPATCH MAINTENANCE RESPONSE',
      
      'KPI_ACTIVE_FLEET': 'Active Fleet',
      'KPI_ACTIVE_FLEET_SUB': 'OPERATIONAL STATUS DIRECT',
      'KPI_WORKSHOP': 'IN WORKSHOP',
      'KPI_WORKSHOP_SUB': 'PREVENTATIVE PM ACTIVE',
      'KPI_DOWN': 'FLEET DOWN',
      'KPI_DOWN_SUB': 'RECOVERY FORCE ALERT',
      'KPI_CREWS': 'Crews Active',
      'KPI_CREWS_SUB': 'SHIFT rotation cycle A',
      'KPI_WOS': 'Active WOs',
      'KPI_WOS_SUB': 'PENDING CAMUNDA DISPATCH',
      'KPI_PRODUCTIVITY': 'Productivity',

      'CHART_TITLE': 'HISTORIC MAINTENANCE COMPLIANCE INDEX',
      'CHART_SUBTITLE': 'PM Target Threshold vs Actual Completion (Tons handled / Downtime Hr)',
      'CHART_ACTUAL': 'Actual Output',
      'CHART_TARGET': 'Baseline Target',

      'RECENT_WORKSHOP': 'RECENT EVENT WORKSHOP LOGS',
      'UPCOMING_PM': 'UPCOMING SCHEDULED MAINTENANCE',
      'UPCOMING_PM_SUB': 'Scheduled preventative inspections',
      
      'EQUIP_STATUS_DIST': 'EQUIPMENT STATUS DISTRIBUTION',
      'EQUIP_STATUS_SUB': 'Physical assets state allocations',
      'ACTIVE_OEE': 'ACTIVE OEE: 91.4% OVERALL POTENTIAL',
      
      'ACTIVE_PRIORITY': 'ACTIVE ORDERS BY SEGMENT PRIORITY',
      'ACTIVE_PRIORITY_SUB': 'Open repairs & scheduled interventions',
      'BACKLOG': 'Work Order Backlog:',
      'ORDER_FILES': 'ORDER FILES',

      'LIVE_WORK_ORDERS': 'LIVE RECENT ACTIVE WORK ORDERS',
      'LIVE_WORK_ORDERS_SUB': 'Work order pipelines active on core machines',
      'GO_KANBAN': 'GO TO KANBAN CONTROL BOARD',

      'ORDER_ID': 'Order ID',
      'DETAILS': 'Work Order Details',
      'ASSET': 'Affected Asset',
      'CREW': 'Dispatched Crew',
      'DATE': 'Schedule Date',
      'SEVERITY': 'Severity',
      'STATE': 'Workflow State'
    },
    'equipment': {
      'TITLE': 'HEAVY FLEET ASSETS',
      'SUBTITLE': 'Equipment Fleet Registry • Realtime PostGIS Telemetry & Dispatch Control',
      'SEACH_PLACEHOLDER': 'Search assets by ID, name, or model...',
      'FILTER_ALL': 'ALL DEPLOYMENTS',
      'FILTER_OPERATIONAL': 'OPERATIONAL',
      'FILTER_MAINTENANCE': 'IN REPAIR',
      'FILTER_STANDBY': 'STANDBY/READY',
      'FILTER_BREAKDOWN': 'CRITICAL OUTAGE',
      'HEALTH_SCORE': 'Health Score',
      'INTELLIGENCE_METRIC': 'INTELLIGENCE telemetry',
      'LAST_MAINT': 'Last PM Date',
      'COORDINATED_CREW': 'COORDINATED GROUND PERSONNEL',
      'SUPERVISOR': 'Supervisor',
      'DISPATCH': 'DISPATCH CREW RESPONSE',
      'FUEL_LVL': 'Fuel Level',
      'TEMP': 'Engine Temp',
      'HOURS': 'Logged Hours'
    },
    'teams': {
      'TITLE': 'CREW OPERATIONS',
      'SUBTITLE': 'Socio-Technical Squad Index • Real-time Location Pinpointing',
      'SEARCH_PLACEHOLDER': 'Search teams by name or supervisor...',
      'MEMBERS': 'Members',
      'ACTIVE_JOBS': 'Active Assigned Jobs',
      'LOCATION': 'Location Coordinat',
      'ADD_TEAM': 'DEPLOY NEW SQUAD',
      'EDIT_TEAM': 'UPDATE SQUAD DETAILS',
      'DELETE_TEAM': 'RECALL SQUAD',
      'NAME': 'Squad Name',
      'SUPERVISOR_LBL': 'Supervisor Name',
      'MEMBERS_COUNT': 'Staff Members Count',
      'LOC_LAT': 'Latitude Coords (WGS84)',
      'LOC_LNG': 'Longitude Coords (WGS84)'
    },
    'workOrders': {
      'TITLE': 'KANBAN WORK ORDER CONTROL',
      'SUBTITLE': 'Camunda BPM Orchestration • Dispatch Pipe & SLA Monitoring',
      'NEW_ORDER': 'INITIATE WORK DIRECTIVE',
      'DESCRIPTION': 'Detailed Instructions',
      'PRIORITY': 'Priority Severity',
      'AFFECTED': 'Affected Machinery Asset',
      'ASSIGNED': 'Assigned Service Squad',
      'EDIT_ORDER': 'UPDATE WORK DIRECTIVE',
      'ARCHIVE_ORDER': 'ARCHIVE SCHEME',
      'DRAG_INSTR': 'Drag and drop cards across benches to update status'
    },
    'map': {
      'TITLE': 'GEOSPATIAL INTELLIGENCE PORTAL',
      'SUBTITLE': 'Active Mine Spatial Index • Realtime PostGIS Telemetry Integration',
      'FILTER_ALL': 'ALL MARKERS',
      'FILTER_MACHINES': 'MACHINERY',
      'FILTER_CREWS': 'DISPATCH CREWS',
      'COMPASS_ACTIVE': 'PILBARA BASIN SENSOR COMPASS ACTIVE',
      'RESOLUTION': 'RESOLUTION 0.5 METRACT / VECTOR-LAYERS',
      'INSPECTOR': 'GEOSPATIAL INSPECTOR',
      'INSPECTOR_SUB': 'Physical node coordinates & parameters',
      'LATITUDE': 'LATITUDE',
      'LONGITUDE': 'LONGITUDE',
      'GRID_POS': 'GRID POSITION',
      'TELEMETRY': 'Telemetry Sync: Realtime • Last Signal: 1s Ago',
      'INDEX_LIST': 'INDEX COORD LISTINGS',
      'SELECT_PROMPT': 'Select a machinery or team marker on the spatial index to inspect realtime coordinates.'
    },
    'reports': {
      'TITLE': 'ANALYTICS & DIRECTIVE REPORTING',
      'SUBTITLE': 'Enterprise Reporting Index • Historical Datatables & Export Engines',
      'BATCH_EXPORT': 'BATCH EXPORT ALL (Spring Boot Sync)',
      'MTBF': 'MTBF FLEET AVERAGE',
      'MTTR': 'MTTR SERVICE RATE',
      'COMPLIANCE': 'PM COMPLIANCE GRADE',
      'GENERATOR': 'ON-DEMAND DIRECTIVE GENERATOR',
      'GENERATOR_SUB': 'Generate high-density CSV or JSON manifests',
      'TARGET_LABEL': 'Analysis Target Frame',
      'SCOPE_LABEL': 'Temporal Scope',
      'FORMAT_LABEL': 'Export Manifest Format',
      'COMPILE_BTN': 'COMPILE & DOWNLOAD DIRECTIVE DATA',
      'HISTORIC_INDEX': 'HISTORIC DOCUMENT CONTROL INDEX',
      'HISTORIC_SUB': 'Stored reports and regulatory compliance logs',
      'REF_CODE': 'Ref Code',
      'DETAILS_COL': 'Report Details',
      'SEGMENT_COL': 'Segment',
      'DATE_COL': 'Generated Date',
      'ACTIONS_COL': 'Actions'
    },
    'settings': {
      'TITLE': 'USER & CONFIGURATION PANEL',
      'SUBTITLE': 'Configure operational interface defaults, language schemas, and active viewport themes',
      'PROFILE_SECTION': 'OPERATOR PROFILE',
      'FULL_NAME': 'Full Operator Name',
      'EMAIL_ADDRESS': 'Operational Email (Keycloak)',
      'ROLE_LBL': 'Assigned Corporate Role',
      'LOCALE_SECTION': 'LOCALE & INTERFACE SCHEMA',
      'LANG_LBL': 'Interface Display Language',
      'THEME_SECTION': 'AESTHETIC THEME PREFERENCE',
      'THEME_DESC': 'System default uses W3C Media queries to sync to OS preference (Dark/Light)',
      'SAVE_SUCCESS': 'System settings saved successfully. Language & visual theme updated.',
      'RESET_BTN': 'RESET INTERFACE',
      'PORTUGUESE': 'Portuguese (Brasil)',
      'ENGLISH': 'English (United States)'
    }
  },
  'pt-BR': {
    'common': {
      'MINEOPS': 'MINEOPS',
      'PROTOTYPE': 'PROTÓTIPO v2.1',
      'SHIFT': 'TURNO',
      'SHIFT_A': 'A - Turno Diurno',
      'ACKNOWLEDGE': 'RECONHECER',
      'ACKNOWLEDGED': 'RECONHECIDO',
      'CLOSE_PANEL': 'FECHAR PAINEL',
      'SYS_SETTINGS': 'Configurações do Sistema',
      'LOGOUT': 'Encerrar Sessão',
      'MAIN_PORTAL': 'PORTAL PRINCIPAL',
      'FIELD_OPS': 'OPERAÇÕES DE CAMPO',
      'GEOSPATIAL_SYS': 'SISTEMAS GEOSPACIAIS',
      'ANALYTICAL_INDEX': 'ÍNDICE ANALÍTICO',
      'ERP_SYNC': 'SISTEMA ERP: ATIVO E CONECTADO',
      'DASHBOARD': 'Painel de Controle',
      'FLEET': 'Ativos da Frota Pesada',
      'TEAMS': 'Equipes de Campo',
      'KANBAN': 'Quadro Kanban',
      'SPATIAL_INDEX': 'Índice Espacial da Mina',
      'REPORTS': 'Relatórios Operacionais',
      'CRITICAL_DIRECTIVES': 'DIRETIVAS CRÍTICAS DO SISTEMA',
      'OPS_WARNING': '● Alerta de Operação',
      'NO_ALERTS': 'Nenhum alerta ativo. Operações normais.',
      'SETTINGS': 'Configurações',
      'LANGUAGE': 'Idioma',
      'THEME': 'Tema',
      'DARK': 'Tema Escuro',
      'LIGHT': 'Tema Claro',
      'SYSTEM': 'Usar Tema do Sistema',
      'SAVE_CONFIG': 'SALVAR CONFIGURAÇÃO'
    },
    'dashboard': {
      'TITLE': 'PAINEL OPERACIONAL',
      'SUBTITLE': 'Portal de Inteligência de Operações • Unidade Alpha: Bacia Regional de Pilbara',
      'REALTIME': 'ESTADO DE MONITORAMENTO EM TEMPO REAL',
      'ALARMS_HEADER': 'ALARMES MESTRES NÃO RESOLVIDOS',
      'CRITICAL_COUNT': 'CRÍTICOS',
      'DISPATCH_MAINT': 'DESPACHAR RESPOSTA DE MANUTENÇÃO',
      
      'KPI_ACTIVE_FLEET': 'Frota Ativa',
      'KPI_ACTIVE_FLEET_SUB': 'STATUS OPERACIONAL DIRETO',
      'KPI_WORKSHOP': 'NA OFICINA',
      'KPI_WORKSHOP_SUB': 'MANUTENÇÃO PREVENTIVA ATIVA',
      'KPI_DOWN': 'FROTA INATIVA',
      'KPI_DOWN_SUB': 'ALERTA DE FORÇA DE RECUPERAÇÃO',
      'KPI_CREWS': 'Equipes Ativas',
      'KPI_CREWS_SUB': 'Ciclo de escala de turno A',
      'KPI_WOS': 'Ordens Ativas',
      'KPI_WOS_SUB': 'DESPACHO CAMUNDA PENDENTE',
      'KPI_PRODUCTIVITY': 'Produtividade',

      'CHART_TITLE': 'ÍNDICE HISTÓRICO DE CONFORMIDADE DE MANUTENÇÃO',
      'CHART_SUBTITLE': 'Meta PM vs Conclusão Real (Toneladas movimentadas / Hora parada)',
      'CHART_ACTUAL': 'Produção Real',
      'CHART_TARGET': 'Meta Base',

      'RECENT_WORKSHOP': 'REGISTROS RECENTES DE OFICINA',
      'UPCOMING_PM': 'PRÓXIMAS MANUTENÇÕES AGENDADAS',
      'UPCOMING_PM_SUB': 'Inspeções preventivas agendadas',
      
      'EQUIP_STATUS_DIST': 'DISTRIBUIÇÃO DE STATUS DA FROTA',
      'EQUIP_STATUS_SUB': 'Alocação de estado de ativos físicos',
      'ACTIVE_OEE': 'OEE ATIVO: 91.4% DO POTENCIAL GERAL',
      
      'ACTIVE_PRIORITY': 'ORDENS ATIVAS POR PRIORIDADE DO SEGMENTO',
      'ACTIVE_PRIORITY_SUB': 'Reparos abertos & intervenções agendadas',
      'BACKLOG': 'Fila de Ordens de Trabalho:',
      'ORDER_FILES': 'ORDENS DE SERVIÇO',

      'LIVE_WORK_ORDERS': 'ORDENS DE SERVIÇO RECENTES EM TEMPO REAL',
      'LIVE_WORK_ORDERS_SUB': 'Pipelines de ordens de serviço ativas nas máquinas principais',
      'GO_KANBAN': 'IR PARA O PAINEL KANBAN',

      'ORDER_ID': 'ID da Ordem',
      'DETAILS': 'Detalhes da Ordem de Serviço',
      'ASSET': 'Ativo Afetado',
      'CREW': 'Equipe Despachada',
      'DATE': 'Data Agendada',
      'SEVERITY': 'Severidade',
      'STATE': 'Estado do Fluxo'
    },
    'equipment': {
      'TITLE': 'ATIVOS DA FROTA PESADA',
      'SUBTITLE': 'Registro da Frota de Equipamentos • Telemetria PostGIS e Controle de Despacho',
      'SEACH_PLACEHOLDER': 'Buscar ativos por ID, nome ou modelo...',
      'FILTER_ALL': 'TODAS IMPLANTAÇÕES',
      'FILTER_OPERATIONAL': 'OPERACIONAL',
      'FILTER_MAINTENANCE': 'EM MANUTENÇÃO',
      'FILTER_STANDBY': 'STANDBY/PRONTIDÃO',
      'FILTER_BREAKDOWN': 'PARADA CRÍTICA',
      'HEALTH_SCORE': 'Pontuação de Saúde',
      'INTELLIGENCE_METRIC': 'Telemetria INTELIGÊNCIA',
      'LAST_MAINT': 'Última Revisão Preventiva',
      'COORDINATED_CREW': 'PESSOAL DE TERRA COORDENADO',
      'SUPERVISOR': 'Supervisor',
      'DISPATCH': 'SOLICITAR RETORNO DA EQUIPE',
      'FUEL_LVL': 'Nível de Combustível',
      'TEMP': 'Temp. Motor',
      'HOURS': 'Horas Logadas'
    },
    'teams': {
      'TITLE': 'EQUIPES DE CAMPO',
      'SUBTITLE': 'Índice de Equipes de Campo • Geolocalização em Tempo Real',
      'SEARCH_PLACEHOLDER': 'Buscar equipes por nome ou supervisor...',
      'MEMBERS': 'Membros',
      'ACTIVE_JOBS': 'Trabalhos Ativos Atribuídos',
      'LOCATION': 'Coordenadas Geográficas',
      'ADD_TEAM': 'IMPLANTAR NOVA EQUIPE',
      'EDIT_TEAM': 'ATUALIZAR DETALHES DA EQUIPE',
      'DELETE_TEAM': 'RECOLHER EQUIPE',
      'NAME': 'Nome da Equipe',
      'SUPERVISOR_LBL': 'Nome do Supervisor',
      'MEMBERS_COUNT': 'Quantidade de Integrantes',
      'LOC_LAT': 'Latitude (WGS84)',
      'LOC_LNG': 'Longitude (WGS84)'
    },
    'workOrders': {
      'TITLE': 'CONTROLE DE ORDENS DE SERVIÇO',
      'SUBTITLE': 'Orquestração de Processos Camunda • SLA e Pipelines de Atendimento',
      'NEW_ORDER': 'INICIAR DIRETIVA DE TRABALHO',
      'DESCRIPTION': 'Instruções Detalhadas',
      'PRIORITY': 'Prioridade de Severidade',
      'AFFECTED': 'Ativo Pesado Coprodutor',
      'ASSIGNED': 'Equipe de Serviço Designada',
      'EDIT_ORDER': 'ATUALIZAR ORDEM DE SERVIÇO',
      'ARCHIVE_ORDER': 'ARQUIVAR ORDEM',
      'DRAG_INSTR': 'Arraste e solte os cards entre colunas para atualizar o status'
    },
    'map': {
      'TITLE': 'PORTAL DE INTELIGÊNCIA GEOCIENTÍFICA',
      'SUBTITLE': 'Índice Espacial Ativo & Telemetria PostGIS em Tempo Real',
      'FILTER_ALL': 'TODOS OS MARCADORES',
      'FILTER_MACHINES': 'MÁQUINAS E ATIVOS',
      'FILTER_CREWS': 'SQUAD DE CAMPO',
      'COMPASS_ACTIVE': 'BÚSSOLA DE SENSORES ATIVA NA BACIA DE PILBARA',
      'RESOLUTION': 'RECONHECIMENTO: RES. VECTOR-LAYERS DE 0.5 METRACT',
      'INSPECTOR': 'INSPETOR GEOSPAACIAL',
      'INSPECTOR_SUB': 'Coordenadas e atributos reais do nó geográfico',
      'LATITUDE': 'LATITUDE',
      'LONGITUDE': 'LONGITUDE',
      'GRID_POS': 'POSIÇÃO DA GRADE',
      'TELEMETRY': 'Sincronizador: Tempo Real • Último Sinal: 1s Atrás',
      'INDEX_LIST': 'COORDENADAS DO MARCADOR',
      'SELECT_PROMPT': 'Selecione um ativo ou marcador de equipe para ver as coordenadas georreferenciadas.'
    },
    'reports': {
      'TITLE': 'RELATÓRIOS E COMPLIANCE',
      'SUBTITLE': 'Índice de Relatórios Corporativos • Histórico de Atividades & Bancos PostgreSQL',
      'BATCH_EXPORT': 'EXPORTAÇÃO EM LOTE COMPLETO (Sinc. Spring Boot)',
      'MTBF': 'TEMPO MÉDIO ENTRE FALHAS (MTBF)',
      'MTTR': 'TEMPO MÉDIO DE REPARO (MTTR)',
      'COMPLIANCE': 'GRAU DE COMPLIANCE PREVENTIVO',
      'GENERATOR': 'GERADOR DE DIRETIVAS SOB DEMANDA',
      'GENERATOR_SUB': 'Gerar manifestos CSV, XML ou JSON altamente estruturados',
      'TARGET_LABEL': 'Alvo de Análise',
      'SCOPE_LABEL': 'Abrangência Temporal',
      'FORMAT_LABEL': 'Formato de Exportação',
      'COMPILE_BTN': 'COMPILAR E GERAR DOWNLOAD DA DIRETIVA',
      'HISTORIC_INDEX': 'DOCUMENTAÇÃO HISTÓRICA DO PROJETO',
      'HISTORIC_SUB': 'Relatórios armazenados e auditorias regulatórias',
      'REF_CODE': 'Cód. Ref',
      'DETAILS_COL': 'Detalhes do Relatório',
      'SEGMENT_COL': 'Categoria',
      'DATE_COL': 'Data de Geração',
      'ACTIONS_COL': 'Ações'
    },
    'settings': {
      'TITLE': 'CONFIGURAÇÕES DA PLATAFORMA',
      'SUBTITLE': 'Gerencie as preferências visuais, idiomas, temas e dados de perfil de operador',
      'PROFILE_SECTION': 'PERFIL DO OPERADOR',
      'FULL_NAME': 'Nome do Operador',
      'EMAIL_ADDRESS': 'E-mail Corporativo (Autenticação Keycloak)',
      'ROLE_LBL': 'Cargo de Atribuição Corporativo',
      'LOCALE_SECTION': 'DIRETRIZ DE LOCALIZAÇÃO',
      'LANG_LBL': 'Idioma de Exibição da Interface',
      'THEME_SECTION': 'PREFERÊNCIA DE TEMA VISUAL',
      'THEME_DESC': 'O tema do sistema utiliza Media Queries W3C em tempo real para sincronizar com seu OS',
      'SAVE_SUCCESS': 'Configurações salvas. Idioma e tema visual atualizados com sucesso.',
      'RESET_BTN': 'RESETAR CONFIGURAÇÕES',
      'PORTUGUESE': 'Português (Brasil)',
      'ENGLISH': 'English (United States)'
    }
  }
};
