import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BusinessService } from "./business.service";

const createBusiness = catchAsync(async (req: any, res: any) => {
  const result = await BusinessService.createBusiness(req.body, req.user);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message:
      result.status === "APPROVED"
        ? "Business listed and approved successfully!"
        : "Business submitted successfully and is pending review.",
    data: result,
  });
});

const getAllBusinesses = catchAsync(async (req: any, res: any) => {
  const {
    status,
    type,
    district,
    area,
    brand,
    isVerified,
    source,
    search,
    submittedBy,
  } = req.query;

  const result = await BusinessService.getAllBusinesses({
    status,
    type,
    district,
    area,
    brand,
    isVerified,
    source,
    search,
    submittedBy,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Businesses retrieved successfully",
    data: result,
  });
});

const getBusinessById = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await BusinessService.getBusinessById(id);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Business not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business retrieved successfully",
    data: result,
  });
});

const getBusinessBySlug = catchAsync(async (req: any, res: any) => {
  const { slug } = req.params;
  const result = await BusinessService.getBusinessBySlug(slug);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Business not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business retrieved successfully",
    data: result,
  });
});

const updateBusiness = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await BusinessService.updateBusiness(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business updated successfully",
    data: result,
  });
});

const approveBusiness = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const adminUserId = req.user?.id;
  const result = await BusinessService.approveBusiness(id, adminUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business approved and verified successfully",
    data: result,
  });
});

const rejectBusiness = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const adminUserId = req.user?.id;
  const { rejectionReason } = req.body;
  const result = await BusinessService.rejectBusiness(
    id,
    adminUserId,
    rejectionReason
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business request rejected",
    data: result,
  });
});

const deleteBusiness = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await BusinessService.deleteBusiness(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business deleted successfully",
    data: result,
  });
});

export const BusinessController = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  getBusinessBySlug,
  updateBusiness,
  approveBusiness,
  rejectBusiness,
  deleteBusiness,
};
