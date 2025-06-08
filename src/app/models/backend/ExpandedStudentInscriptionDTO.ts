import { CategorySummaryDTO } from "./CategorySummaryDTO";
import { DisciplineSummaryDTO } from "./DisciplineSummaryDTO";
import { UserDTO } from "./ExpandedUserDTO";
import { FeeDTO } from "./FeeDTO";

export interface ExpandedStudentInscriptionDTO {
    student: UserDTO,
    discipline: DisciplineSummaryDTO,
    category: CategorySummaryDTO,
    createdDate: string, //yyyy-MM-dd
    updatedDate: string, //yyyy-MM-dd
    inscriptionFees: FeeDTO[],
    isDebtor: boolean
}