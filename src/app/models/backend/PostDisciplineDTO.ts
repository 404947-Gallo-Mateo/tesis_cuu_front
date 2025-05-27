import { CategoryDTO } from "./CategoryDTO";
import { AgeRange } from "./embeddables/AgeRange";
import { Schedule } from "./embeddables/Schedule";
import { UserDTO } from "./ExpandedUserDTO";

export interface PostDisciplineDTO{
    name: string;
    description: string;
    teacherIds: string[]; //List<UserDTO>
    categories: PostCategoryDTO[]; // List<PostCategoryDTO>
}

export interface PostCategoryDTO{
    name: string;
    description: string;
    monthlyFee: number; // BigDecimal
    disciplineId: string; //UUID
    disciplineName: string;
    availableSpaces: number; // Long
    ageRange: AgeRange;
    schedules: Schedule[];
    allowedGenre: string; // enum Genre
}

export interface PutDisciplineDTO{
    id: string; // UUID
    name: string;
    description: string;
    teacherIds: string[]; //List<UserDTO>
    categories: PutCategoryDTO[]; // List<PostCategoryDTO>
}

export interface PutCategoryDTO{
    id: string; //UUID
    name: string;
    description: string;
    monthlyFee: number; // BigDecimal
    disciplineId: string; //UUID
    disciplineName: string;
    availableSpaces: number; // Long
    ageRange: AgeRange;
    schedules: Schedule[];
    allowedGenre: string; // enum Genre
}



