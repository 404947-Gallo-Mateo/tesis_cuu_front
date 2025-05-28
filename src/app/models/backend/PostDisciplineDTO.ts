import { PostCategoryDTO, PutCategoryDTO } from "./CategoryDTO";


export interface PostDisciplineDTO{
    name: string;
    description: string;
    teacherIds: string[]; //List<UserDTO>
    categories: PostCategoryDTO[]; // List<PostCategoryDTO>
}

export interface PutDisciplineDTO{
    id: string; // UUID
    name: string;
    description: string;
    teacherIds: string[]; //List<UserDTO>
    categories: PutCategoryDTO[]; // List<PostCategoryDTO>
}





