import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CompanyService } from "./company.service";

const createCompany = catchAsync(async (req: any, res: any) => {
  const result = await CompanyService.createCompany(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Company created successfully",
    data: result,
  });
});

const getAllCompanies = catchAsync(async (req: any, res: any) => {
  const result = await CompanyService.getAllCompanies();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Companies retrieved successfully",
    data: result,
  });
});

const getCompanyById = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await CompanyService.getCompanyById(id);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Company not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company retrieved successfully",
    data: result,
  });
});

const updateCompany = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await CompanyService.updateCompany(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company updated successfully",
    data: result,
  });
});

const deleteCompany = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await CompanyService.deleteCompany(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company deleted successfully",
    data: result,
  });
});

export const CompanyController = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
