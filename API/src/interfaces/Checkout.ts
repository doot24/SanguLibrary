import { ResourceType } from "./Resources";

export class Checkout {
    _id? : string;
    employee? : string;
    student? : string;
    resource? : ResourceType;
    resource_id? : string;
    dateIssued? : string;
    returnDate? : string;
}