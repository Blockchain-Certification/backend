import { Response } from 'express';
import asyncHandler from '../../../shared/helpers/asyncHandler';
import { StudentService } from './student.service';
import {
  SuccessMsgResponse,
  SuccessResponse,
} from '../../../shared/core/apiResponse';
import { ProtectedRequest } from '../../../shared/types/app-request';
import { Types } from 'mongoose';
import { Pagination } from '../../recipientProfile/recipientProfile.service';
export class StudentController {
  private studentService: StudentService;
  constructor(StudentService: StudentService) {
    this.studentService = StudentService;
  }

  public getList = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const pagination : Pagination = (({ page , limit }) => ({
        page : parseInt(page as string),
        limit : parseInt(limit as string)
      }))(req.query);
      const {_id} = req.user; 
      const data = await this.studentService.getList(
        pagination,
       _id
      );

      return new SuccessResponse('Get list successfully', {
        success: true,
        data: data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
        },
      }).send(res);
    },
  );

  public edit = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const data = await this.studentService.edit(
      new Types.ObjectId(req.params.id),
      req.body,
    );
    return new SuccessResponse('Edit successfully', {
      success: true,
      data: data,
    }).send(res);
  });

  public delete = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    await this.studentService.delete(new Types.ObjectId(req.params.id));
    return new SuccessMsgResponse('Delete User successfully').send(res);
  });

  public detail = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await this.studentService.detail(
      new Types.ObjectId(req.params.id),
    );
    return new SuccessResponse('Get detail successfully', {
      success: true,
      data: user,
    }).send(res);
  });
}
