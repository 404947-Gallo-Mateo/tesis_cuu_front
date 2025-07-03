import { FeeDTO } from "../FeeDTO"
import { PaymentType } from "./PaymentType"

export interface PaymentProofDTO {
    userKeycloakId: string,
    paymentDate: string,
    transactionId: string, 
    paymentMethod: PaymentType, 
    paymentProofUrl: string,
    status: string, 
    payerEmail: string 
}