import { Os, Overview, Process, Realtime } from '@/db/schemas/fusion.type'

export class CreateFusionDto {
    overview?: Overview
    os?: Os
    realtime?: Realtime
    full_process?: Process[]
}
