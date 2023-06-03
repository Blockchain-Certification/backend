import { DAC } from "../../../shared/database/model";
import { CHARACTERS as characters } from "./constants";
import { Gender } from '../../../shared/database/model/InfoUser';
import { Ranking } from '../../../shared/database/model/DAC';
import { DisclosedData } from "./interfaces";
export const randomKey = ()=>{
  const charactersLength = characters.length;
  let otp = '';
  
  for (let i = 0; i < charactersLength; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    otp += characters[randomIndex];
  }

  return otp;
}


export const formatSchemaDisclosedData = (dac: DAC) : DisclosedData =>{
  const disclosedData : DisclosedData =  {
    id :dac.id,
    idNumber : dac.idNumber,
    registrationNum : dac.registrationNum,
    iU: dac.iU,
    iSt: dac.iSt,
    studentName: dac.studentName,
    universityName: dac.universityName,
    departmentName: dac.departmentName,
    dateOfBirth: dac.dateOfBirth ,
    year: dac.year,
    nameCourse: dac.nameCourse,
    major: dac.major,
    nameTypeCertificate: dac.nameTypeCertificate,
    typeCertificate: dac.typeCertificate,
    levelCertificate: dac.levelCertificate,
    placeOfBirth: dac.placeOfBirth,
    nation: dac.nation,
    gender: dac.gender,
  }

  if (dac.ranking !== null) {
    disclosedData.ranking = dac.ranking;
  }

  if(dac.formOfTraining !== null) {
    disclosedData.formOfTraining = dac.formOfTraining;
  }

  if(dac.CGPA != null) {
    disclosedData.CGPA = dac.CGPA;
  }
  return disclosedData;
}