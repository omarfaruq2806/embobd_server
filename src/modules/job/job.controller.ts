import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JobService } from "./job.service";

const createJob = catchAsync(async (req: any, res: any) => {
  const result = await JobService.createJob(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: any, res: any) => {
  const result = await JobService.getAllJobs();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs retrieved successfully",
    data: result,
  });
});

const getJobById = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await JobService.getJobById(id);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Job not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job retrieved successfully",
    data: result,
  });
});

const updateJob = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await JobService.updateJob(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job updated successfully",
    data: result,
  });
});

const deleteJob = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await JobService.deleteJob(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job deleted successfully",
    data: result,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
