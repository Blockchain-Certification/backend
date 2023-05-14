import { CHARACTERS as characters } from "./constants";
export const randomKey = ()=>{
  const charactersLength = characters.length;
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    otp += characters[randomIndex];
  }

  return otp;
}