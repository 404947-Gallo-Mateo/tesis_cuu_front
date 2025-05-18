import { DisciplineSummaryDTO } from "./DisciplineSummaryDTO";
import { CategoryDTO } from "./CategoryDTO";

export interface ExpandedUserDTO {
  keycloakId: string;
  role: string; // enum Role
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string; // LocalDate formato dd-MM-yyyy
  genre: string; // enum Genre
  teacherDisciplines: DisciplineSummaryDTO[];
  studentCategories: CategoryDTO[];
}

export interface UserDTO {
  keycloakId: string;
  role: string; // enum Role
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string; // LocalDate formato dd-MM-yyyy
  genre: string; // enum Genre
  teacherDisciplines: DisciplineSummaryDTO[];
}