import { ProjectData } from '../types';

export const projectsCatalog: Record<string, ProjectData> = {
    'rotary-drive': {
        id: 'rotary-drive',
        badge: 'Precision Kinematics',
        title: 'Rotary Drive Assembly',
        subtitle: 'High-torque cyclic drive system engineered for zero-backlash rotational stability, preloaded bearing raceways, and dynamic balancing.',
        serviceOption: '01 — Engineering Design & Development',
        simType: 'gear-mesh',
        telemetry: {
            speed: '1420 RPM',
            torque: '480 Nm Peak',
            tolerance: '±0.012 mm Runout',
            status: 'CONVERGED // ZERO FLUTTER'
        },
        pipeline: [
            { num: '01', title: 'Kinematic Solid CAD', desc: 'Parametric involute gear tooth modeling and dynamic clearance optimization.', tag: 'ISO 2768-m' },
            { num: '02', title: 'Dynamic Load FEA', desc: 'Von Mises contact stress solver under 1,850 Nm cyclic shock torque.', tag: 'Stress < 185 MPa' },
            { num: '03', title: 'Bearing Integration', desc: 'Dual-tapered roller bearing calculation for maximum axial & radial rigidity.', tag: 'L10h > 45,000 hrs' },
            { num: '04', title: 'Production DFM Prints', desc: '2D manufacturing prints with true-position GD&T for multi-axis CNC.', tag: 'Zero-Rework Ready' }
        ],
        before: {
            title: 'Legacy Workshop Layout',
            desc: 'Off-the-shelf spur gear arrangement with manual shimming, excessive tooth play, and accelerated raceway wear under sudden reversing loads.',
            tags: ['Backlash: ±0.35 mm', 'Manual Shim Fitting', '8.4% Assembly Scrap', 'High Audible Vibration']
        },
        after: {
            title: 'Cadbeaver Engineered System',
            desc: 'Custom-profiled precision helical gear mesh with hardened 4140 alloy, self-aligning pilot sleeves, and verified micron-level tooth clearance.',
            tags: ['Backlash: ±0.012 mm', 'Zero-Shim Self-Centering', '0.0% Assembly Scrap', 'Silent Dynamic Mesh']
        },
        deltas: [
            { val: '-72%', lbl: 'Backlash Play' },
            { val: '+45%', lbl: 'Dynamic Load Peak' },
            { val: '45k hrs', lbl: 'Bearing L10 Rating' },
            { val: '0.0%', lbl: 'Shopfloor Rework' }
        ],
        specs: [
            { label: 'Nominal Operating Speed', val: '1,420 RPM' },
            { label: 'Peak Dynamic Torque', val: '480 Nm (1,850 Nm Shock)' },
            { label: 'Total Radial Runout', val: '±0.012 mm' },
            { label: 'Base Material Grade', val: 'Alloy Steel 4140 Hardened (HRC 50-54)' },
            { label: 'Lubrication Enclosure', val: 'IP66 Dual Viton Rotary Lip Seals' },
            { label: 'Engineering Deliverables', val: '2D GD&T DXF, 3D STEP Assembly, DFM Dossier' }
        ]
    },
    'bulk-conveyor': {
        id: 'bulk-conveyor',
        badge: 'Heavy Material Handling',
        title: 'Bulk Conveyor System',
        subtitle: 'High-throughput continuous screw conveyor engineered for abrasive bulk handling with zero trough jamming and progressive pitch feed.',
        serviceOption: '05 — Material Handling & Industrial Equipment',
        simType: 'conveyor-flow',
        telemetry: {
            speed: '85 RPM Shaft',
            torque: '620 Nm Continuous',
            tolerance: '45 Ton / hr Rate',
            status: 'UNIFORM VOLUMETRIC FLOW'
        },
        pipeline: [
            { num: '01', title: 'Volumetric Pitch Modeling', desc: 'Progressive pitch flight geometry preventing hopper compaction and bridging.', tag: 'Variable 180-260mm' },
            { num: '02', title: 'Torsional Deflection Solver', desc: 'Heavy-wall tubular shaft calculation to restrict span deflection under 1.8 mm.', tag: 'Deflection < L/1000' },
            { num: '03', title: 'Wear-Resistant Hardfacing', desc: 'Flight edge cladding specification with anti-friction UHMW trough liner bedding.', tag: 'Hardness 450 BHN' },
            { num: '04', title: 'Fabrication Detail Prints', desc: 'Modular flanged trough drawings with standardized drive mount interface.', tag: 'Field Bolt Assembly' }
        ],
        before: {
            title: 'Standard Uniform Pitch Conveyor',
            desc: 'Frequent material bridging at feed inlet, motor thermal trip-outs, and flight abrasion wear requiring replacement every 5 months.',
            tags: ['Inlet Clogging Delays', 'High Motor Draw: 18.2A', 'Flight Life: 5 Months', '4.2% Spill Leakage']
        },
        after: {
            title: 'Cadbeaver Progressive Lead System',
            desc: 'Graduated pitch flighting with optimized feed throat clearance, reducing inlet compaction torque and tripling flight operating life.',
            tags: ['Continuous Non-Clog Feed', 'Motor Draw: 11.4A (-37%)', 'Flight Life: 18+ Months', 'Zero Trough Spillage']
        },
        deltas: [
            { val: '+38%', lbl: 'Bulk Throughput' },
            { val: '-37%', lbl: 'Motor Power Draw' },
            { val: '3.6x', lbl: 'Flight Wear Lifespan' },
            { val: '0 Jam', lbl: 'Choke Failures' }
        ],
        specs: [
            { label: 'Continuous Throughput', val: '45.0 Metric Tons / hr' },
            { label: 'Shaft Outer Diameter', val: 'Ø114 mm Schedule 80 Seamless' },
            { label: 'Flight Edge Metallurgy', val: 'Abrasion-Resistant Alloy 450' },
            { label: 'Drive Reducer Ratio', val: '18.4:1 Helical-Bevel' },
            { label: 'Hanger Bearing Type', val: 'Self-Lubricating Synthetic Insert' },
            { label: 'Engineering Deliverables', val: 'Full Fabrication DXF, BOM, Motor Sizing Calc' }
        ]
    },
    'spm-machine': {
        id: 'spm-machine',
        badge: 'Special Purpose Machine',
        title: 'SPM Machine Framework',
        subtitle: 'High-speed automated assembly workstation with synchronized multi-axis gantry and sub-second parts transfer.',
        serviceOption: '06 — Custom Engineering Solutions',
        simType: 'spm-gantry',
        telemetry: {
            speed: '1,200 Parts / hr',
            torque: '3-Axis Gantry Cycle',
            tolerance: 'Repeatability: ±0.015mm',
            status: 'SYNCHRONIZED CAM & SERVO'
        },
        pipeline: [
            { num: '01', title: 'Dynamic Kinematic Gantry', desc: 'Multi-axis pick-and-place mechanism with optimized S-curve velocity profiles.', tag: 'Acc: 2.2 m/s²' },
            { num: '02', title: 'Vibration & Resonance FEA', desc: 'Rigid structural tubular frame maintaining modal frequency far above operational RPM.', tag: '1st Mode > 68 Hz' },
            { num: '03', title: 'Pneumatic Nest Fixturing', desc: 'Rapid clamping pneumatic tooling nests with integrated proximity sensor feedback.', tag: 'Clamp Time < 0.15s' },
            { num: '04', title: 'Turnkey Machine Docs', desc: 'Complete bill of materials, pneumatic schematics, and precision fabrication prints.', tag: 'CE / OSHA Compliant' }
        ],
        before: {
            title: 'Multi-Station Manual Transfer',
            desc: 'Operator-dependent manual loading stations resulting in irregular cycle times, operator strain, and 6.2% assembly variance defects.',
            tags: ['Cycle: 8.4s / Part', 'Manual Operator Strain', '6.2% Defect Variance', 'Frequent Micro-Stops']
        },
        after: {
            title: 'Cadbeaver Automated SPM Station',
            desc: 'Single compact footprint automated workstation running continuous 2.4s cycles with pneumatic verification at every stage.',
            tags: ['Cycle: 2.4s / Part (-71%)', 'Fully Hands-Free Automation', '0.04% Variance Margin', '99.4% Machine Uptime']
        },
        deltas: [
            { val: '-71%', lbl: 'Part Cycle Time' },
            { val: '1,200', lbl: 'Parts / hr Output' },
            { val: '±0.015', lbl: 'Gantry Repeatability' },
            { val: '99.4%', lbl: 'Operational OEE' }
        ],
        specs: [
            { label: 'Station Cycle Output', val: '1,200 Units / hr (2.4s per cycle)' },
            { label: 'Gantry Axes Travel', val: 'X: 650mm | Y: 400mm | Z: 180mm' },
            { label: 'Positioning Repeatability', val: '±0.015 mm Linear' },
            { label: 'Structural Base Frame', val: 'Stress-Relieved Heavy Tubular Steel' },
            { label: 'Sensor Integration', val: 'Optical Gate + Inductive Nest Proxies' },
            { label: 'Engineering Deliverables', val: 'Complete 3D Assembly, Pneumatic Schematic, 2D DFM' }
        ]
    },
    'torque-shaft': {
        id: 'torque-shaft',
        badge: 'Reverse Engineering & FEA',
        title: 'Torque Shaft Optimization',
        subtitle: 'Reverse engineering, 3D point-cloud reconstruction, and non-linear torsional stress redistribution for heavy turbine drives.',
        serviceOption: '03 — Engineering & Technical Services',
        simType: 'shaft-stress',
        telemetry: {
            speed: '3600 RPM Rated',
            torque: '2400 Nm Cyclic Load',
            tolerance: 'Fillet Stress -55%',
            status: 'VON MISES NOMINAL < 140 MPa'
        },
        pipeline: [
            { num: '01', title: 'High-Precision Digitization', desc: 'Geometric capture of legacy splines and keyway transitions.', tag: 'Accuracy ±0.005mm' },
            { num: '02', title: 'Stress Concentration FEA', desc: 'Finite element mesh refinement at shoulder fillets to pinpoint cyclic fatigue notch factors.', tag: 'Kt Reduced 1.8 -> 1.15' },
            { num: '03', title: 'Parametric Fillet Re-profile', desc: 'Compound elliptic shoulder radius profile distributing shear stress uniformly.', tag: 'Fatigue Limit +85%' },
            { num: '04', title: 'Precision CNC Turning Specs', desc: 'Blueprint specifying induction hardening depth and ground finish criteria.', tag: 'Ra 0.4 µm Bearing Seat' }
        ],
        before: {
            title: 'Legacy Worn Shaft Component',
            desc: 'Sharp step shoulder transitions caused premature micro-fracturing and catastrophic fatigue shearing under startup torque spikes.',
            tags: ['Notch Stress: 310 MPa', 'Micro-Crack Propagation', 'Shaft Failure at 1,400 hrs', 'Unknown Metallurgy']
        },
        after: {
            title: 'Cadbeaver Optimized Geometry',
            desc: 'Redesigned elliptic relief transitions with specialized case-hardening profile, dropping peak notch stress safely below fatigue threshold.',
            tags: ['Peak Stress: 138 MPa (-55%)', 'Infinite Life Cycle Curve', 'Case Hardened HRC 58-62', 'Complete Material Spec']
        },
        deltas: [
            { val: '-55%', lbl: 'Peak Notch Stress' },
            { val: '+180%', lbl: 'Fatigue Cycle Life' },
            { val: 'Ra 0.4', lbl: 'Ground Finish Micro' },
            { val: 'Zero', lbl: 'Startup Fractures' }
        ],
        specs: [
            { label: 'Shaft Envelope Dimensions', val: 'Ø95 mm x 840 mm Length' },
            { label: 'Continuous Torque Rating', val: '2,400 Nm (3,600 RPM)' },
            { label: 'Peak Shock Factor', val: '2.5x Service Factor' },
            { label: 'Metallurgical Standard', val: 'Alloy 4340 Vacuum Degassed' },
            { label: 'Heat Treatment', val: 'Deep Nitrided / Case Hardened 0.8mm' },
            { label: 'Engineering Deliverables', val: 'Full GD&T Shop Prints, FEA Simulation Report' }
        ]
    },
    'telemetry-dashboard': {
        id: 'telemetry-dashboard',
        badge: 'Custom Industrial Software',
        title: 'Operations & Telemetry Dashboard',
        subtitle: 'Microsecond machine telemetry data pipeline, distributed cycle analytics, and real-time operator control interface.',
        serviceOption: '07 — Custom Industrial Software & Dashboards',
        simType: 'telemetry-wave',
        telemetry: {
            speed: '400 Hz Sampling',
            torque: 'Zero Buffer Lag',
            tolerance: 'Latency < 8ms',
            status: 'REAL-TIME MQTT BROKER'
        },
        pipeline: [
            { num: '01', title: 'Hardware Bus Ingestion', desc: 'Data driver capturing industrial PLC signals, encoder pulses, and temperature sensors.', tag: 'Sub-millisecond Edge' },
            { num: '02', title: 'Telemetry Pipeline Broker', desc: 'High-throughput time-series streaming engine with automated compression and failover.', tag: '10,000 pts/sec' },
            { num: '03', title: 'Aesthetic Web Dashboard', desc: 'Custom responsive machine dashboard with live oscilloscopes and cycle heatmaps.', tag: 'Zero Software Bloat' },
            { num: '04', title: 'Predictive Threshold Alerts', desc: 'Automated notification engine alerting plant supervisors to thermal rise and cycle drift.', tag: 'Instant SMS / Email' }
        ],
        before: {
            title: 'Disconnected Manual Shift Logs',
            desc: 'Operators manually filled handwritten logbooks, machine heating spikes went undetected for hours, and micro-stops were untracked.',
            tags: ['Delayed Fault Discovery', 'Handwritten Log Inaccuracies', '18% Untracked Downtime', 'No Predictive Visibility']
        },
        after: {
            title: 'Cadbeaver Real-Time Telemetry',
            desc: 'Instant visual insight across every operational metric, sub-second anomaly highlighting, and automated shift performance summaries.',
            tags: ['Real-time 8ms Telemetry', 'Automated Shift Metrics', 'Zero Data Loss Logging', 'Immediate Thermal Alerts']
        },
        deltas: [
            { val: '<8ms', lbl: 'Telemetry Latency' },
            { val: '+28%', lbl: 'Operational OEE' },
            { val: '100%', lbl: 'Cycle Visibility' },
            { val: '0 min', lbl: 'Manual Logging' }
        ],
        specs: [
            { label: 'Telemetry Ingestion Rate', val: '10,000 Samples / sec' },
            { label: 'Pipeline Response Latency', val: '< 8 milliseconds' },
            { label: 'Interface Architecture', val: 'High-Performance Web Client (Zero Plugins)' },
            { label: 'Data Retention Storage', val: 'Encrypted Compressed Time-Series DB' },
            { label: 'Alert Dispatch Channels', val: 'Instant Webhook, Telegram, SMS & Email' },
            { label: 'Engineering Deliverables', val: 'Custom Software Codebase, API Schema, User Manual' }
        ]
    },
    'vision-scanner': {
        id: 'vision-scanner',
        badge: 'Edge AI & Computer Vision',
        title: 'Vision Quality & Defect Scanner',
        subtitle: 'Sub-millimeter automated optical classification, real-time dimensional contour verification, and zero-latency defect rejection.',
        serviceOption: '08 — AI Automation & Intelligent Systems',
        simType: 'vision-laser',
        telemetry: {
            speed: '120 Parts / min',
            torque: 'Neural Edge Inference',
            tolerance: 'Accuracy: 99.85%',
            status: 'MICRO-DEFECT IDENTIFIED: 0.02mm'
        },
        pipeline: [
            { num: '01', title: 'Illumination & Optics Geometry', desc: 'Telecentric lens setup eliminating optical parallax distortion across manufactured parts.', tag: 'Telecentric 0.05x' },
            { num: '02', title: 'Edge Neural Classifier', desc: 'Lightweight deep vision model detecting surface fissures, burrs, pitting, and thread errors in 12ms.', tag: '12ms / Frame' },
            { num: '03', title: 'Sub-Pixel Dimension Metric', desc: 'Algorithmic contour measurement verifying critical diameters against CAD drawing tolerances.', tag: 'Precision ±0.008mm' },
            { num: '04', title: 'High-Speed Reject Pneumatic', desc: 'Synchronized air-blast ejector triggering rejection of out-of-spec workpieces without line stoppage.', tag: '100% Sort Rate' }
        ],
        before: {
            title: 'Manual Visual Inspection Table',
            desc: 'Human inspectors fatigued after hours of eye strain, micro-cracks under 0.1mm slipped through undetected, resulting in customer returns.',
            tags: ['Fatigue Error Rate: 4.8%', 'Inspection Speed: 15 / min', 'Missed Sub-mm Flaws', 'High Quality Disputes']
        },
        after: {
            title: 'Cadbeaver Autonomous Optical AI',
            desc: 'Continuous 120 parts/min automated scanner with 99.85% defect capture rate and instant pass/fail data logging to plant database.',
            tags: ['Defect Accuracy: 99.85%', 'Inspection Speed: 120 / min', 'Sub-Pixel Micro Catch', '100% Traceability Audit']
        },
        deltas: [
            { val: '99.85%', lbl: 'Defect Detection' },
            { val: '8x', lbl: 'Inspection Throughput' },
            { val: '±0.008', lbl: 'Sub-pixel Precision mm' },
            { val: '0.0%', lbl: 'Customer Returns' }
        ],
        specs: [
            { label: 'Inspection Throughput', val: '120 Units / min Continuous' },
            { label: 'Optical Resolution', val: '5.0 Megapixel Telecentric Setup' },
            { label: 'Defect Detection Threshold', val: '0.02 mm Surface Fissures' },
            { label: 'Inference Latency', val: '12 milliseconds / Part' },
            { label: 'Sorting Mechanism', val: 'Synchronized High-Speed Solenoid Jet' },
            { label: 'Engineering Deliverables', val: 'AI Inspection Engine, Optical Enclosure, 2D Integration Prints' }
        ]
    }
};

export const projectsMap = projectsCatalog;
export const projectsList: ProjectData[] = Object.values(projectsCatalog);

