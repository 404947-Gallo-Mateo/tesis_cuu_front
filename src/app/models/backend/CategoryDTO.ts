import { Schedule } from "./embeddables/Schedule";
import { AgeRange } from "./embeddables/AgeRange";

export interface CategoryDTO{
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