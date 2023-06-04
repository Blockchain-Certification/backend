import { Types } from "mongoose";

export interface CheckUpBlockchain{
  check(id: Types.ObjectId, identity : string) : void;
}

