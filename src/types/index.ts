export interface PipelineStation {
    num: string;
    title: string;
    desc: string;
    tag: string;
}

export interface BeforeAfterContent {
    title: string;
    desc: string;
    tags: string[];
}

export interface DeltaMetric {
    val: string;
    lbl: string;
}

export interface ProjectSpec {
    label: string;
    val: string;
}

export interface ProjectData {
    id: string;
    badge: string;
    title: string;
    subtitle: string;
    serviceOption: string;
    simType: 'gear-mesh' | 'conveyor-flow' | 'spm-gantry' | 'shaft-stress' | 'telemetry-wave' | 'vision-laser';
    telemetry: {
        speed: string;
        torque: string;
        tolerance: string;
        status: string;
    };
    pipeline: PipelineStation[];
    before: BeforeAfterContent;
    after: BeforeAfterContent;
    deltas: DeltaMetric[];
    specs: ProjectSpec[];
}

export interface ServiceData {
    id: string;
    number: string;
    name: string;
    desc: string;
    colSpan: number;
    tags: string[];
    isDark?: boolean;
    hasJellyCanvas?: boolean;
}
