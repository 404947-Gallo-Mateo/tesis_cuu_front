import { Genre } from "./embeddables/Genre"
import { Role } from "./embeddables/Role"
import { FeeDTO } from "./FeeDTO"

export interface UserWithFeesDTO {
    keycloakId: string,
    role: Role,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    birthDate: string, // LocalDate
    genre: Genre,
    userFees: FeeDTO[],
    isDebtor: boolean
}