import { randomUUID } from "crypto";
import { SystemPetitionTemplate } from "../interfaces/Petition";
import { SystemPetitionTemplateSchema } from "../schemas/PetitionSchema";

export const InitializeCollections = async (): Promise<void> => {
    let template : SystemPetitionTemplate = new SystemPetitionTemplate();
    template._id = "sys_checkout";
    template.text = "მსურს ამ წიგნის გატანა";
    template.title = "წიგნის გატანა";

    let sys_checkout = await SystemPetitionTemplateSchema.findById("sys_checkout")
    if(!sys_checkout)
        await new SystemPetitionTemplateSchema(template).save();
};