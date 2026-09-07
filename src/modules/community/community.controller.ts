import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommunityService } from "./community.service";

const createPost = catchAsync(async (req: any, res: any) => {
  const result = await CommunityService.createPost(req.body, req.user);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message:
      result.status === "APPROVED"
        ? "Community post published successfully!"
        : "Community post submitted successfully and is pending moderator review.",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: any, res: any) => {
  const {
    status,
    category,
    tag,
    authorId,
    search,
    isPinned,
    sortBy,
    page,
    limit,
  } = req.query;

  const result = await CommunityService.getAllPosts(
    {
      status,
      category,
      tag,
      authorId,
      search,
      isPinned,
      sortBy,
      page,
      limit,
    },
    req.user
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPostByIdOrSlug = catchAsync(async (req: any, res: any) => {
  const { idOrSlug } = req.params;
  const result = await CommunityService.getPostByIdOrSlug(idOrSlug, true);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Community post not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community post retrieved successfully",
    data: result,
  });
});

const getMyPosts = catchAsync(async (req: any, res: any) => {
  const userId = req.user?.id;
  const result = await CommunityService.getMyPosts(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your community posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updatePost = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await CommunityService.updatePost(id, req.body, req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community post updated successfully",
    data: result,
  });
});

const approvePost = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const adminUserId = req.user?.id;
  const result = await CommunityService.approvePost(id, adminUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community post approved and published successfully",
    data: result,
  });
});

const rejectPost = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const adminUserId = req.user?.id;
  const { rejectionReason } = req.body;
  const result = await CommunityService.rejectPost(
    id,
    adminUserId,
    rejectionReason
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community post rejected",
    data: result,
  });
});

const deletePost = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await CommunityService.deletePost(id, req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community post deleted successfully",
    data: result,
  });
});

const getCommunityCategories = catchAsync(async (req: any, res: any) => {
  const result = await CommunityService.getCommunityCategories();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Community categories retrieved successfully",
    data: result,
  });
});

const getPopularTags = catchAsync(async (req: any, res: any) => {
  const result = await CommunityService.getPopularTags();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Popular tags retrieved successfully",
    data: result,
  });
});

export const CommunityController = {
  createPost,
  getAllPosts,
  getPostByIdOrSlug,
  getMyPosts,
  updatePost,
  approvePost,
  rejectPost,
  deletePost,
  getCommunityCategories,
  getPopularTags,
};
