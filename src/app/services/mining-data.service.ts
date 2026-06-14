import { Injectable, signal, computed } from '@angular/core';

// Domain Interfaces
export interface TelemetryData {
  fuel: number;         // percentage
  temp: number;         // celsius
  vibration: number;    // mm/s
  hydraulicPressure: number; // bar
}

export type EquipmentType = 'Excavator' | 'Bulldozer' | 'Dump Truck' | 'Drilling Machine' | 'Loader';
export type EquipmentStatus = 'Operational' | 'Under Maintenance' | 'Standby' | 'Breakdown' | 'Decommissioned';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  type: EquipmentType;
  manufacturer: string;
  status: EquipmentStatus;
  location: string;
  latitude: number;  // for map / PostGIS visualization
  longitude: number; // for map / PostGIS visualization
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  assignedTeamId: string;
  healthScore: number; // 0-100
  operationalHours: number;
  fuelLevel: number; // 0-100
}

export interface Team {
  id: string;
  name: string;
  supervisor: string;
  membersCount: number;
  assignedEquipmentIds: string[];
  currentLocation: string;
  latitude: number;
  longitude: number;
  shift: 'A - Day Shift' | 'B - Night Shift' | 'C - Support Shift';
  performanceIndex: number; // 0-100
  members: string[];
  responsibilities: string;
}

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type WorkOrderStatus = 'Open' | 'Under Review' | 'Approved' | 'In Progress' | 'Completed';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTeamId: string;
  equipmentId: string;
  createdAt: string;
  dueDate: string;
}

export interface MiningZone {
  id: string;
  name: string;
  type: 'Excavation Pit' | 'Crushing Facility' | 'Waste Dump' | 'Maintenance Workshop' | 'Administrative Zone';
  hazardLevel: 'Low' | 'Medium' | 'High' | 'Restricted';
  coordinates: { x: number; y: number }[]; // custom local coordinate bounds
}

@Injectable({
  providedIn: 'root'
})
export class MiningDataService {
  // Master Signals (stores)
  private equipmentsSignal = signal<Equipment[]>([
    {
      id: 'EQ-EXC-101',
      name: 'Cat 6040 Hydraulic Shovel',
      model: '6040 FS',
      type: 'Excavator',
      manufacturer: 'Caterpillar',
      status: 'Operational',
      location: 'Pit Alpha - West Wall',
      latitude: -23.1420,
      longitude: 119.3450,
      lastMaintenanceDate: '2026-05-15',
      nextMaintenanceDate: '2026-06-30',
      assignedTeamId: 'TM-01',
      healthScore: 92,
      operationalHours: 14250,
      fuelLevel: 78
    },
    {
      id: 'EQ-EXC-102',
      name: 'Komatsu PC4000-11',
      model: 'PC4000-11',
      type: 'Excavator',
      manufacturer: 'Komatsu',
      status: 'Under Maintenance',
      location: 'Workshop Delta',
      latitude: -23.1480,
      longitude: 119.3520,
      lastMaintenanceDate: '2026-06-10',
      nextMaintenanceDate: '2026-06-15',
      assignedTeamId: 'TM-03',
      healthScore: 65,
      operationalHours: 18400,
      fuelLevel: 12
    },
    {
      id: 'EQ-DUM-201',
      name: 'Liebherr T 284 Haul Truck',
      model: 'T 284',
      type: 'Dump Truck',
      manufacturer: 'Liebherr',
      status: 'Operational',
      location: 'Haul Road Sector 4',
      latitude: -23.1440,
      longitude: 119.3480,
      lastMaintenanceDate: '2026-05-20',
      nextMaintenanceDate: '2026-07-02',
      assignedTeamId: 'TM-02',
      healthScore: 88,
      operationalHours: 22100,
      fuelLevel: 85
    },
    {
      id: 'EQ-DUM-202',
      name: 'Cat 797F Ultra-Class',
      model: '797F',
      type: 'Dump Truck',
      manufacturer: 'Caterpillar',
      status: 'Breakdown',
      location: 'Pit Alpha - Load Base',
      latitude: -23.1415,
      longitude: 119.3421,
      lastMaintenanceDate: '2026-04-12',
      nextMaintenanceDate: '2026-06-14',
      assignedTeamId: 'TM-02',
      healthScore: 45,
      operationalHours: 29800,
      fuelLevel: 42
    },
    {
      id: 'EQ-DUM-203',
      name: 'Cat 797F Ultra-Class II',
      model: '797F',
      type: 'Dump Truck',
      manufacturer: 'Caterpillar',
      status: 'Operational',
      location: 'Haul Road Sector 2',
      latitude: -23.1452,
      longitude: 119.3491,
      lastMaintenanceDate: '2026-05-28',
      nextMaintenanceDate: '2026-07-10',
      assignedTeamId: 'TM-01',
      healthScore: 95,
      operationalHours: 8400,
      fuelLevel: 63
    },
    {
      id: 'EQ-DRI-301',
      name: 'Sandvik DR410i Rotary Drill',
      model: 'DR410i',
      type: 'Drilling Machine',
      manufacturer: 'Sandvik',
      status: 'Operational',
      location: 'Pit Beta - Upper Bench',
      latitude: -23.1465,
      longitude: 119.3435,
      lastMaintenanceDate: '2026-06-02',
      nextMaintenanceDate: '2026-07-14',
      assignedTeamId: 'TM-04',
      healthScore: 91,
      operationalHours: 6200,
      fuelLevel: 91
    },
    {
      id: 'EQ-DRI-302',
      name: 'Pit Viper 271 Rotary Drill',
      model: 'PV-271',
      type: 'Drilling Machine',
      manufacturer: 'Epiroc',
      status: 'Standby',
      location: 'Pit Beta - Sector 3',
      latitude: -23.1471,
      longitude: 119.3441,
      lastMaintenanceDate: '2026-05-18',
      nextMaintenanceDate: '2026-06-25',
      assignedTeamId: 'TM-04',
      healthScore: 84,
      operationalHours: 11500,
      fuelLevel: 55
    },
    {
      id: 'EQ-LDR-401',
      name: 'Cat 994K Wheel Loader',
      model: '994K',
      type: 'Loader',
      manufacturer: 'Caterpillar',
      status: 'Operational',
      location: 'Crushing Plant Area A',
      latitude: -23.1492,
      longitude: 119.3512,
      lastMaintenanceDate: '2026-06-01',
      nextMaintenanceDate: '2026-07-12',
      assignedTeamId: 'TM-05',
      healthScore: 90,
      operationalHours: 9200,
      fuelLevel: 70
    },
    {
      id: 'EQ-BUL-501',
      name: 'Komatsu D375A-8 Dozer',
      model: 'D375A-8',
      type: 'Bulldozer',
      manufacturer: 'Komatsu',
      status: 'Operational',
      location: 'Waste Dump Sector C',
      latitude: -23.1510,
      longitude: 119.3551,
      lastMaintenanceDate: '2026-05-10',
      nextMaintenanceDate: '2026-06-28',
      assignedTeamId: 'TM-02',
      healthScore: 89,
      operationalHours: 13900,
      fuelLevel: 80
    }
  ]);

  private teamsSignal = signal<Team[]>([
    {
      id: 'TM-01',
      name: 'Alpha Heavy Shovel Crew',
      supervisor: 'Sarah Jenkins',
      membersCount: 8,
      assignedEquipmentIds: ['EQ-EXC-101', 'EQ-DUM-203'],
      currentLocation: 'Pit Alpha - West Wall',
      latitude: -23.1420,
      longitude: 119.3450,
      shift: 'A - Day Shift',
      performanceIndex: 94,
      members: ['Dan Cooper', 'Lucas Sterling', 'John Radebe', 'Miguel Torres', 'Kylie Minhas', 'Zack Fletcher', 'Emily Watson', 'Bruce Banner'],
      responsibilities: 'Primary excavation and loading operations in Pit Alpha high-grade zone.'
    },
    {
      id: 'TM-02',
      name: 'Alpha Haulage & Disposal Squad',
      supervisor: 'Marcus Keller',
      membersCount: 14,
      assignedEquipmentIds: ['EQ-DUM-201', 'EQ-DUM-202', 'EQ-BUL-501'],
      currentLocation: 'Haul Road Sector 4',
      latitude: -23.1440,
      longitude: 119.3480,
      shift: 'A - Day Shift',
      performanceIndex: 89,
      members: ['Steve Rogers', 'Clint Barton', 'Natasha Romanoff', 'Tony Stark', 'Wanda Maximoff', 'Pietro Maximoff', 'Sam Wilson', 'Bucky Barnes', 'Scott Lang', 'Hope Dyne', 'Peter Parker', 'Stephen Strange', 'Carol Danvers', 'TChalla'],
      responsibilities: 'Main hauling lines from Pit Alpha loader stations to Crushing Plant A and Waste Dump.'
    },
    {
      id: 'TM-03',
      name: 'Delta Maintenance Engineering',
      supervisor: 'Eng. Robert Chen',
      membersCount: 10,
      assignedEquipmentIds: ['EQ-EXC-102'],
      currentLocation: 'Workshop Delta',
      latitude: -23.1480,
      longitude: 119.3520,
      shift: 'C - Support Shift',
      performanceIndex: 96,
      members: ['Viktor Krum', 'Fleur Delacour', 'Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Neville Longbottom', 'Luna Lovegood', 'Ginny Weasley', 'Cedric Diggory', 'Cho Chang'],
      responsibilities: 'Preventative and breakdown main workshop engineering, hydraulic systems, and transmission overhauls.'
    },
    {
      id: 'TM-04',
      name: 'Beta Production Drilling Team',
      supervisor: 'Yousef Al-Fayed',
      membersCount: 6,
      assignedEquipmentIds: ['EQ-DRI-301', 'EQ-DRI-302'],
      currentLocation: 'Pit Beta - Upper Bench',
      latitude: -23.1465,
      longitude: 119.3435,
      shift: 'B - Night Shift',
      performanceIndex: 91,
      members: ['Arthur Pendragon', 'Merlin Wyllt', 'Guinevere Leodegrance', 'Lancelot Lac', 'Gawain Lot', 'Galahad Corbenic'],
      responsibilities: 'Drill and blast pattern preparations, borehole telemetry management, and rock cohesion testing.'
    },
    {
      id: 'TM-05',
      name: 'Crusher Feed & Silo Support',
      supervisor: 'Elena Rostova',
      membersCount: 8,
      assignedEquipmentIds: ['EQ-LDR-401'],
      currentLocation: 'Crushing Plant Area A',
      latitude: -23.1492,
      longitude: 119.3512,
      shift: 'A - Day Shift',
      performanceIndex: 93,
      members: ['Luke Skywalker', 'Leia Organa', 'Han Solo', 'Chewbacca', 'Lando Calrissian', 'Obi-Wan Kenobi', 'Anakin Skywalker', 'Yoda Grandmaster'],
      responsibilities: 'Managing stockpiles feeding the primary gyratory crusher, conveyor alignments, and bulk flow control.'
    }
  ]);

  private workOrdersSignal = signal<WorkOrder[]>([
    {
      id: 'WO-2026-0801',
      title: 'Hydraulic Valve Replacement',
      description: 'Replace faulty relief valve in primary hydraulic arm. Oil contamination check required.',
      priority: 'High',
      status: 'In Progress',
      assignedTeamId: 'TM-03',
      equipmentId: 'EQ-EXC-102',
      createdAt: '2026-06-11',
      dueDate: '2026-06-15'
    },
    {
      id: 'WO-2026-0802',
      title: 'Cat 797F Transmission Breakdown Repair',
      description: 'Erratic shifting detected under load on 8% incline. Re-verify transmission solenoid blocks and clutch pressures.',
      priority: 'Critical',
      status: 'Under Review',
      assignedTeamId: 'TM-03',
      equipmentId: 'EQ-DUM-202',
      createdAt: '2026-06-13',
      dueDate: '2026-06-14'
    },
    {
      id: 'WO-2026-0803',
      title: 'Blasting Pattern Drill Pattern B3',
      description: 'Execute 45 boreholes to 12m depth on West bench. Cohesion analysis indicates abrasive hard basalt formation.',
      priority: 'Medium',
      status: 'Approved',
      assignedTeamId: 'TM-04',
      equipmentId: 'EQ-DRI-301',
      createdAt: '2026-06-12',
      dueDate: '2026-06-18'
    },
    {
      id: 'WO-2026-0804',
      title: 'Scheduled 250-Hour Lube Service',
      description: 'Standard PM checklist. Lubricate pivot joints, repack bucket pins, check final drive lubricant viscosity.',
      priority: 'Low',
      status: 'Open',
      assignedTeamId: 'TM-02',
      equipmentId: 'EQ-EXC-101',
      createdAt: '2026-06-14',
      dueDate: '2026-06-21'
    },
    {
      id: 'WO-2026-0805',
      title: 'Crusher Feeder Bucket Wear Lining Replace',
      description: 'Weld wear plates onto loader bucket interior due to accelerated abrasion from quartz ore feed.',
      priority: 'High',
      status: 'Completed',
      assignedTeamId: 'TM-03',
      equipmentId: 'EQ-LDR-401',
      createdAt: '2026-06-08',
      dueDate: '2026-06-12'
    },
    {
      id: 'WO-2026-0806',
      title: 'Dozer Underchain Tension Calibration',
      description: 'Right track reporting loose tension factor causing drive slip. Recalibrate hydraulic tension tensioner.',
      priority: 'Medium',
      status: 'Open',
      assignedTeamId: 'TM-02',
      equipmentId: 'EQ-BUL-501',
      createdAt: '2026-06-14',
      dueDate: '2026-06-19'
    }
  ]);

  // Operational Zones
  private zonesSignal = signal<MiningZone[]>([
    {
      id: 'ZN-01',
      name: 'Pit Alpha High-Grade Pit',
      type: 'Excavation Pit',
      hazardLevel: 'High',
      coordinates: [{ x: 50, y: 120 }, { x: 350, y: 150 }, { x: 420, y: 480 }, { x: 120, y: 390 }]
    },
    {
      id: 'ZN-02',
      name: 'Pit Beta South Pit',
      type: 'Excavation Pit',
      hazardLevel: 'Medium',
      coordinates: [{ x: 500, y: 250 }, { x: 750, y: 200 }, { x: 780, y: 420 }, { x: 620, y: 490 }]
    },
    {
      id: 'ZN-03',
      name: 'Primary Gyratory Crusher B2',
      type: 'Crushing Facility',
      hazardLevel: 'Restricted',
      coordinates: [{ x: 820, y: 550 }, { x: 990, y: 550 }, { x: 990, y: 680 }, { x: 820, y: 680 }]
    },
    {
      id: 'ZN-04',
      name: 'Maintenance Workshop Delta',
      type: 'Maintenance Workshop',
      hazardLevel: 'Medium',
      coordinates: [{ x: 450, y: 700 }, { x: 700, y: 700 }, { x: 700, y: 880 }, { x: 450, y: 880 }]
    },
    {
      id: 'ZN-05',
      name: 'Waste Rock Dump Sector C',
      type: 'Waste Dump',
      hazardLevel: 'Low',
      coordinates: [{ x: 1100, y: 100 }, { x: 1450, y: 120 }, { x: 1400, y: 480 }, { x: 1050, y: 400 }]
    }
  ]);

  // Recent maintenance events for logs/dashboard
  private maintenanceLogsSignal = signal<{
    id: string;
    equipmentId: string;
    equipmentName: string;
    date: string;
    type: 'Emergency' | 'Scheduled' | 'Preventative';
    technician: string;
    cost: number;
    notes: string;
  }[]>([
    {
      id: 'ML-991',
      equipmentId: 'EQ-LDR-401',
      equipmentName: 'Cat 994K Wheel Loader',
      date: '2026-06-12',
      type: 'Preventative',
      technician: 'K. Kowalski',
      cost: 4500,
      notes: 'Repacked loader arm pins, replaced internal filter seals and hydraulic oil.'
    },
    {
      id: 'ML-992',
      equipmentId: 'EQ-EXC-101',
      equipmentName: 'Cat 6040 Hydraulic Shovel',
      date: '2026-06-05',
      type: 'Scheduled',
      technician: 'S. Vance',
      cost: 12500,
      notes: '2500-hour major structure structural integrity stress inspection, crack telemetry testing of crawler track frames.'
    },
    {
      id: 'ML-993',
      equipmentId: 'EQ-DUM-202',
      equipmentName: 'Cat 797F Ultra-Class',
      date: '2026-05-22',
      type: 'Emergency',
      technician: 'A. Patel',
      cost: 29000,
      notes: 'Emergency recovery field overhaul: Blown cylinder gasket in Cylinder #4 sub-assembly. Retested compression.'
    }
  ]);

  // Read-only Exposed Signals
  public equipments = computed(() => this.equipmentsSignal());
  public teams = computed(() => this.teamsSignal());
  public workOrders = computed(() => this.workOrdersSignal());
  public zones = computed(() => this.zonesSignal());
  public maintenanceLogs = computed(() => this.maintenanceLogsSignal());

  // Alerts Signal for live feel
  public systemAlerts = signal<{
    id: string;
    equipmentId: string;
    equipmentName: string;
    time: string;
    severity: 'High' | 'Medium' | 'Critical';
    message: string;
    acknowledged: boolean;
  }[]>([
    {
      id: 'AL-101',
      equipmentId: 'EQ-DUM-202',
      equipmentName: 'Cat 797F Ultra-Class',
      time: '08:12',
      severity: 'Critical',
      message: 'Transmission hydraulic temperature exceeds maximum operating limit (138°C). Slip factor detected.',
      acknowledged: false
    },
    {
      id: 'AL-102',
      equipmentId: 'EQ-LDR-401',
      equipmentName: 'Cat 994K Wheel Loader',
      time: '07:44',
      severity: 'Medium',
      message: 'Hydraulic oil filter differential back-pressure threshold reached. Maintenance scheduled soon.',
      acknowledged: false
    },
    {
      id: 'AL-103',
      equipmentId: 'EQ-EXC-102',
      equipmentName: 'Komatsu PC4000-11',
      time: '06:15',
      severity: 'High',
      message: 'Main pump vibration telemetry sensor reporting 14.2 mm/s (Warning threshold: 10.0 mm/s). Run diagnostics.',
      acknowledged: true
    }
  ]);

  // Operations CRUD
  public updateEquipmentStatus(id: string, status: EquipmentStatus) {
    this.equipmentsSignal.update(list =>
      list.map(eq => eq.id === id ? { ...eq, status, healthScore: this.getHealthScoreForStatus(status, eq.healthScore) } : eq)
    );
  }

  private getHealthScoreForStatus(status: EquipmentStatus, currentScore: number): number {
    switch (status) {
      case 'Breakdown': return 35;
      case 'Under Maintenance': return Math.min(65, currentScore);
      case 'Operational': return Math.max(85, currentScore);
      case 'Standby': return currentScore;
      default: return currentScore;
    }
  }

  public updateWorkOrderStatus(id: string, status: WorkOrderStatus) {
    this.workOrdersSignal.update(list =>
      list.map(wo => wo.id === id ? { ...wo, status } : wo)
    );
  }

  public createWorkOrder(wo: Omit<WorkOrder, 'id' | 'createdAt'>) {
    const newId = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newWo: WorkOrder = {
      ...wo,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.workOrdersSignal.update(list => [...list, newWo]);
  }

  public editWorkOrder(id: string, updated: Partial<WorkOrder>) {
    this.workOrdersSignal.update(list =>
      list.map(wo => wo.id === id ? { ...wo, ...updated } : wo)
    );
  }

  public createEquipment(eq: Omit<Equipment, 'healthScore' | 'operationalHours' | 'fuelLevel' | 'latitude' | 'longitude'>) {
    const newEq: Equipment = {
      ...eq,
      healthScore: 100,
      operationalHours: 0,
      fuelLevel: 100,
      latitude: -23.14 + (Math.random() - 0.5) * 0.02,
      longitude: 119.34 + (Math.random() - 0.5) * 0.02
    };
    this.equipmentsSignal.update(list => [...list, newEq]);
  }

  public createTeam(team: Team) {
    this.teamsSignal.update(list => [...list, team]);
  }

  public addMaintenanceLog(log: { equipmentId: string; type: 'Emergency' | 'Scheduled' | 'Preventative'; technician: string; cost: number; notes: string }) {
    const eq = this.equipmentsSignal().find(e => e.id === log.equipmentId);
    const newLog = {
      id: `ML-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: log.equipmentId,
      equipmentName: eq ? eq.name : 'Unknown Equipment',
      date: new Date().toISOString().split('T')[0],
      type: log.type,
      technician: log.technician,
      cost: log.cost,
      notes: log.notes
    };
    this.maintenanceLogsSignal.update(list => [newLog, ...list]);
    
    // Auto-schedule under maintenance if Emergency overhaul
    if (log.type === 'Emergency' && eq) {
      this.updateEquipmentStatus(log.equipmentId, 'Under Maintenance');
    }
  }

  public acknowledgeAlert(id: string) {
    this.systemAlerts.update(alerts =>
      alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    );
  }

  // Dashboard calculations using Signals/computed state
  public kpis = computed(() => {
    const list = this.equipmentsSignal();
    const active = list.filter(eq => eq.status === 'Operational').length;
    const maintenance = list.filter(eq => eq.status === 'Under Maintenance').length;
    const breakdown = list.filter(eq => eq.status === 'Breakdown').length;
    const standby = list.filter(eq => eq.status === 'Standby').length;
    
    const teamsList = this.teamsSignal();
    const activeTeams = teamsList.length;

    const wOrders = this.workOrdersSignal();
    const openWo = wOrders.filter(wo => wo.status !== 'Completed').length;
    const criticalAlerts = this.systemAlerts().filter(a => !a.acknowledged).length;

    // Operational productivity factor calculations
    // Sum health scores / count
    const avgHealth = Math.round(list.reduce((acc, current) => acc + current.healthScore, 0) / list.length);
    
    // Theoretical maximum haul capacity (Tons/hr) minus losses for breakdowns
    const productivityRate = Math.round(avgHealth * 0.9 + (active / list.length) * 10);

    return {
      activeEquipment: active,
      underMaintenance: maintenance,
      breakdownEquipment: breakdown,
      standbyEquipment: standby,
      activeTeams,
      openWorkOrders: openWo,
      criticalAlerts,
      productivityRate: Math.min(100, productivityRate)
    };
  });
}
