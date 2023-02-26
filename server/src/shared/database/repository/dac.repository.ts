import { DAC,DACModel } from "../model";
export class DACRepository{
    public async findByTypeCert(name : string) : Promise<DAC| null>
    {
        return  DACModel.findOne({typeCertificate:name});
    }
}