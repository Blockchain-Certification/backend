import {
  DACRepository,
  InfoUserRepository,
  UserRepository,
  GraduationCourseRepository,
  GraduationYearRepository,
  CertificateTypeRepository,
} from '../../shared/database/repository';
import { DAC, Role } from '../../shared/database/model';
import { hasDuplicateAndMusDuplicateIU } from './utils';
import { BadRequestError } from '../../shared/core/apiError';
import { Types } from 'mongoose';
import { FormOfTraining, Ranking } from '../../shared/database/model/DAC';
import { Type } from '../../shared/database/model/CertificateType';

export interface Pagination {
  page: number;
  limit: number;
}

export interface dataDACUpdate {
  year: string;
  nameCourse: string;
  major: string;
  ranking: Ranking;
  formOfTraining: FormOfTraining;
  CPGA: string;
}
export default class RecipentProfileService {
  private dacRepository: DACRepository;
  private infoUserRepository: InfoUserRepository;
  private userRepository: UserRepository;
  private graduationCourseRepository: GraduationCourseRepository;
  private graduationYearRepository: GraduationYearRepository;
  private certificateTypeRepository: CertificateTypeRepository;
  constructor(
    dacRepository: DACRepository,
    infoUserRepository: InfoUserRepository,
    userRepository: UserRepository,
    graduationCourseRepository: GraduationCourseRepository,
    graduationYearRepository: GraduationYearRepository,
    certificateTypeRepository: CertificateTypeRepository,
  ) {
    this.dacRepository = dacRepository;
    this.infoUserRepository = infoUserRepository;
    this.userRepository = userRepository;
    this.graduationCourseRepository = graduationCourseRepository;
    this.graduationYearRepository = graduationYearRepository;
    this.certificateTypeRepository = certificateTypeRepository;
  }

  public async getList(
    pagination: Pagination,
    id: string,
  ): Promise<DAC[] | null> {
    return await this.dacRepository.findByIUniAndPagination(pagination, id);
  }

  public async update(idDAC: Types.ObjectId, body: any): Promise<void> {
    const dac = await this.detail(idDAC);
    
    switch (true) {
      case Boolean(dac?.dispensingStatus):
        throw new BadRequestError('Data up to blockchain, cannot update');
      case !dac?.registrationNum && body.idNumber:
        throw new BadRequestError('Not input field registration number');
      case !dac?.registrationNum:
        await this.checkExistedCourseAndYear(body.year, body.nameCourse);
        break;
      case Boolean(dac?.idNumber):
        throw new BadRequestError('idNumber existed');
    }

    await this.dacRepository.update(idDAC, body);
  }

  public async detail(id: Types.ObjectId): Promise<DAC | null> {
    return await this.dacRepository.findById(id);
  }

  public async registrationNum(
    id: Types.ObjectId,
    registrationNum: string,
  ): Promise<void> {
    const dac = await this.detail(id);
    if (dac?.registrationNum)
      throw new BadRequestError('Registration number have existed');
    await this.dacRepository.update(id, registrationNum);
  }

  public async create(listDAC: DAC[]): Promise<void> {
    if (hasDuplicateAndMusDuplicateIU(listDAC))
      throw new BadRequestError(
        'Have duplicate data in list or must iU duplicate',
      );
    if (!listDAC.length) throw new BadRequestError('Not data in list');

    for (let i = 0; i < listDAC.length; i++) {
      const dac = listDAC[i];
      await this.isValid(dac, Role.UNIVERSITY);
      await this.isValid(dac);
    }
    const promises = [];
    await Promise.all(
      listDAC.map(async (dac: DAC) => {
        dac.dateOfIssuing = null;
        dac.typeCertificate = null;
        dac.idNumber = null;
        dac.registrationNum = null;
        dac.dispensingStatus = false;
        promises.push(this.dacRepository.create(dac));
      }),
    ).catch((err) => {
      throw new BadRequestError(err);
    });
  }

  private async isValid(dac: DAC, role: Role = Role.STUDENT): Promise<void> {
    const entityValidate = (({
      studentName,
      universityName,
      iU,
      iSt,
      placeOfBirth,
      nation,
      dateOfBirth,
      gender,
      year,
      nameCourse,
    }: DAC) => ({
      name: role === Role.STUDENT ? studentName : universityName,
      identity: role === Role.STUDENT ? iSt : iU,
      placeOfBirth,
      nation,
      dateOfBirth,
      gender,
      year,
      nameCourse,
    }))(dac);
    const infoUser = await this.infoUserRepository.findByIdentity(
      entityValidate.identity,
    );
    if (!infoUser)
      throw new BadRequestError(`Invalid identity ${entityValidate.identity}`);

    const dateBirthInfo = new Date(
      infoUser.dateOfBirth || new Date(),
    ).getTime();
    const dateBirthEntity = new Date(
      entityValidate.dateOfBirth || '',
    ).getTime();
    if (
      role === Role.STUDENT &&
      (infoUser.name !== entityValidate.name ||
        infoUser.identity !== entityValidate.identity ||
        infoUser.address !== entityValidate.placeOfBirth ||
        infoUser.gender !== entityValidate.gender ||
        dateBirthInfo !== dateBirthEntity)
    ) {
      throw new BadRequestError(
        `Invalid infoUser not match at ${entityValidate.identity}`,
      );
    }

    const isValidOfRole = await this.userRepository.isValidRole(
      infoUser.identity,
      role,
    );
    if (!isValidOfRole)
      throw new BadRequestError(
        `Invalid identifier: ${infoUser.identity} not of role ${role}`,
      );

    await this.checkExistedCourseAndYear(
      entityValidate.year || '',
      entityValidate.nameCourse || '',
    );
  }

  private async checkExistedCourseAndYear(
    year: string,
    nameCourse: string,
  ): Promise<void> {
    const isExistedYear = await this.graduationYearRepository.findByYear(year);
    if (!isExistedYear)
      throw new BadRequestError(`Not match graduation year ${year}`);

    const isExistedCourse = await this.graduationCourseRepository.findByCourse(
      nameCourse,
    );
    console.log(isExistedCourse);
    if (!isExistedCourse)
      throw new BadRequestError(`Not match graduation course ${nameCourse}`);
  }
}
