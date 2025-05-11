import { DisciplineSummaryDTO } from "./DisciplineSummaryDTO";
import { CategoryDTO } from "./CategoryDTO";

export interface ExpandedUserDTO {
  id: string; //UUID
  keycloakId: string;
  role: string; // enum Role
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date; // LocalDate
  genre: string; // enum Genre
  teacherDisciplines: DisciplineSummaryDTO[];
  studentCategories: CategoryDTO[];

}
