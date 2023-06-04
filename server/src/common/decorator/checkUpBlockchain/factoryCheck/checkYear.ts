import { CheckUpBlockchain } from "../checkUpBlockchain";
import { BadRequestError } from "../../../../shared/core/apiError";
import { Types } from "mongoose";
import { GraduationYear } from "../../../../shared/database/model";
import { GraduationYearRepository } from "../../../../shared/database/repository";
import { getAllCertificatesByYear } from "../../../../shared/fabric/callFuncChainCode";

export class CheckYear implements CheckUpBlockchain{
  private graduationYearRepository   = new GraduationYearRepository();

  async check(id: Types.ObjectId, identity : string) {
      const graduationYear : GraduationYear | null = await this.graduationYearRepository.findById(id);
      if(!graduationYear) throw new BadRequestError(`graduation year not found`);
      const listDAC = await getAllCertificatesByYear(graduationYear.year, identity);
      if(listDAC.length > 0) throw new BadRequestError(`Graduation Year have up to blockchain`);
  }
}