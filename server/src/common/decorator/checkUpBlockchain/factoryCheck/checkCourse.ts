import { CheckUpBlockchain } from "../checkUpBlockchain";
import { GraduationCourseRepository } from "../../../../shared/database/repository";
import { BadRequestError } from "../../../../shared/core/apiError";
import { Types } from "mongoose";
import { getAllCertificatesByCourse } from "../../../../shared/fabric/callFuncChainCode";
import { GraduationCourse } from "../../../../shared/database/model";

export class CheckCourse implements CheckUpBlockchain{
  private courseRepository = new GraduationCourseRepository();

  async check(id: Types.ObjectId, identity : string) {
      const course : GraduationCourse | null = await this.courseRepository.findById(id);
      if(!course) throw new BadRequestError(`Course not found`);
      const listCourse = await getAllCertificatesByCourse(course.name, identity);
      if(listCourse.length > 0) throw new BadRequestError(`Course have up to blockchain`);
  }
}