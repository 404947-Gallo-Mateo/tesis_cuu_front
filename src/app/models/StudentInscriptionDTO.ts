import { CategorySummaryDTO } from "./backend/CategorySummaryDTO";
import { DisciplineSummaryDTO } from "./backend/DisciplineSummaryDTO";
import { UserDTO } from "./backend/ExpandedUserDTO";

export interface StudentInscriptionDTO{
     student: UserDTO;
     discipline: DisciplineSummaryDTO;
     category: CategorySummaryDTO;
     createdDate: string; //yyyy-MM-dd
     updatedDate: string; //yyyy-MM-dd
}