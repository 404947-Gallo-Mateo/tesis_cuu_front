import { FeeType } from "./embeddables/FeeType"
import { PaymentProofDTO } from "./embeddables/PaymentProofDTO"
import { UserDTO } from "./ExpandedUserDTO"

export interface FeeDTO {
    feeType: FeeType,
    amount: number, //BigDecimal
    dueDate: string, //LocalDate
    isDue: boolean,
    period: string, //YearMonth 
    user:  UserDTO,
    userKeycloakId: string,
    payerEmail: string, 
    disciplineId: string, //UUID 
    categoryId: string, // UUID
    disciplineName: string,
    categoryName: string,
    paid: boolean,
    paymentProof: PaymentProofDTO,
    createdAt: string, // LocalDateTime
    description: string
}