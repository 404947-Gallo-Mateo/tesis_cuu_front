import { CategoryDTO } from "./CategoryDTO";
import { UserDTO } from "./ExpandedUserDTO";

export interface DisciplineDto{
    id: string; // UUID
    name: string;
    description: string;
    teachers: UserDTO[]; // List<UserDTO>
    categories: CategoryDTO[]; // List<ICategorySummary>
}