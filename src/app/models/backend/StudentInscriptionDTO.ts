import { CategorySummaryDTO } from "./CategorySummaryDTO";
import { DisciplineSummaryDTO } from "./DisciplineSummaryDTO";
import { UserDTO } from "./ExpandedUserDTO";

export interface StudentInscriptionDTO{
     student: UserDTO;
     discipline: DisciplineSummaryDTO;
     category: CategorySummaryDTO;
     createdDate: string; //yyyy-MM-dd
     updatedDate: string; //yyyy-MM-dd
}