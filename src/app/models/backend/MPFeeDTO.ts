import { FeeType } from "./embeddables/FeeType";

export interface MPFeeDTO {
    feeType: FeeType,
    period: string,
    userKeycloakId: string,
    disciplineId: string // UUID
}