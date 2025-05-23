import { CategoryDTO } from "./CategoryDTO";
import { UserDTO } from "./ExpandedUserDTO";

export interface PostDisciplineDTO{
    name: string;
    description: string;
    teachers: UserDTO[]; //List<UserDTO>
    categories: CategoryDTO[]; // List<PostCategoryDTO>
}