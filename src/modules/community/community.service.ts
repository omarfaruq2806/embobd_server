import prisma from "../../config/prisma";

// Helper function to create a clean URL-friendly slug
const generatePostSlug = async (title: any) => {
  const baseSlug = String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug || "post";
  let count = 1;

  // Ensure slug uniqueness
  while (true) {
    const existing = await prisma.communityPost.findUnique({
      where: { slug },
    });
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

// Helper function to clean and normalize tags array
const normalizeTags = (tags: any) => {
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t: any) => t.trim())
      .filter(Boolean);
  }
  if (Array.isArray(tags)) {
    return tags
      .map((t: any) => String(t).trim())
      .filter(Boolean);
  }
  return [];
};

// Helper function to auto-extract a brief excerpt if none is provided
const generateExcerpt = (content: any, length = 160) => {
  if (!content) return "";
  const cleanText = String(content)
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/(\r\n|\n|\r)/gm, " ") // Replace line breaks with spaces
    .replace(/#+\s/g, "") // Strip markdown headings
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Strip markdown links
    .replace(/[*_~`]/g, "") // Strip formatting chars
    .trim();
  return cleanText.length > length ? `${cleanText.substring(0, length)}...` : cleanText;
};

const createPost = async (data: any, user: any) => {
  if (!user || !user.id) {
    throw new Error("Authentication required! You must be logged in to create a community post.");
  }

  if (!data.title || !data.title.trim()) {
    throw new Error("Post title is required.");
  }

  if (!data.content || !data.content.trim()) {
    throw new Error("Post content is required.");
  }

  // Generate unique slug if not provided
  if (!data.slug || !data.slug.trim()) {
    data.slug = await generatePostSlug(data.title);
  } else {
    data.slug = await generatePostSlug(data.slug);
  }

  // Auto-generate excerpt if empty
  if (!data.excerpt || !data.excerpt.trim()) {
    data.excerpt = generateExcerpt(data.content);
  }

  // Clean tags
  data.tags = normalizeTags(data.tags);

  // Set default category
  data.category = data.category?.trim() || "General";

  // Associate author
  data.authorId = user.id;

  // Set status: Auto-approve for ADMIN and MODERATOR, PENDING for others
  if (user.role === "ADMIN" || user.role === "MODERATOR") {
    data.status = data.status || "APPROVED";
    if (data.status === "APPROVED") {
      data.approvedBy = user.id;
      data.approvedAt = new Date();
    }
  } else {
    data.status = "PENDING";
  }

  const result = await prisma.communityPost.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          profile: {
            select: {
              title: true,
              avatar: true,
            },
          },
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllPosts = async (filters: any = {}, user: any = null) => {
  const where: any = {};

  const isAdminOrMod = user?.role === "ADMIN" || user?.role === "MODERATOR";

  // Status Filter: Public users only see APPROVED posts
  if (filters.status && filters.status !== "ALL") {
    if (isAdminOrMod) {
      where.status = filters.status;
    } else {
      where.status = "APPROVED";
    }
  } else if (!isAdminOrMod) {
    where.status = "APPROVED";
  }

  // Category Filter
  if (filters.category && filters.category !== "ALL" && filters.category !== "All Categories") {
    where.category = {
      equals: filters.category,
      mode: "insensitive",
    };
  }

  // Author Filter
  if (filters.authorId) {
    where.authorId = filters.authorId;
  }

  // Tag Filter (PostgreSQL string array contains)
  if (filters.tag && filters.tag !== "ALL") {
    where.tags = {
      has: String(filters.tag).trim(),
    };
  }

  // isPinned Filter
  if (filters.isPinned !== undefined && filters.isPinned !== "ALL") {
    where.isPinned = filters.isPinned === true || filters.isPinned === "true";
  }

  // Search Filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.trim();
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { excerpt: { contains: searchTerm, mode: "insensitive" } },
      { content: { contains: searchTerm, mode: "insensitive" } },
      { category: { contains: searchTerm, mode: "insensitive" } },
      { tags: { has: searchTerm } },
    ];
  }

  // Pagination
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 12));
  const skip = (page - 1) * limit;

  // Sorting
  let orderBy: any[] = [];
  if (filters.sortBy === "most_viewed" || filters.sortBy === "trending") {
    orderBy = [{ isPinned: "desc" }, { views: "desc" }, { createdAt: "desc" }];
  } else if (filters.sortBy === "oldest") {
    orderBy = [{ isPinned: "desc" }, { createdAt: "asc" }];
  } else {
    // Default: latest
    orderBy = [{ isPinned: "desc" }, { createdAt: "desc" }];
  }

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            profile: {
              select: {
                title: true,
                avatar: true,
              },
            },
          },
        },
        approvedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.communityPost.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: posts,
  };
};

const getPostByIdOrSlug = async (idOrSlug: any, incrementView = true) => {
  // First check if it matches a unique slug or ID
  const post = await prisma.communityPost.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          profile: {
            select: {
              title: true,
              avatar: true,
              bio: true,
              skills: true,
            },
          },
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  // Real-time atomic increment of views count
  if (incrementView) {
    prisma.communityPost
      .update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
      .catch((err: any) => {
        console.error("Failed to increment community post view count:", err);
      });

    post.views += 1;
  }

  return post;
};

const getMyPosts = async (userId: any, query: any = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  const where: any = { authorId: userId };

  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        approvedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.communityPost.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: posts,
  };
};

const updatePost = async (id: any, data: any, user: any) => {
  if (!user || !user.id) {
    throw new Error("Authentication required.");
  }

  const existingPost = await prisma.communityPost.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw new Error("Community post not found.");
  }

  const isAuthor = existingPost.authorId === user.id;
  const isAdminOrMod = user.role === "ADMIN" || user.role === "MODERATOR";

  if (!isAuthor && !isAdminOrMod) {
    throw new Error("Forbidden! You are not authorized to edit this post.");
  }

  const updateData: any = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) {
    updateData.content = data.content;
    if (!data.excerpt) {
      updateData.excerpt = generateExcerpt(data.content);
    }
  }
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = normalizeTags(data.tags);

  if (isAdminOrMod) {
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned;
    if (data.status !== undefined) updateData.status = data.status;
  }

  const result = await prisma.communityPost.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const approvePost = async (id: any, adminUserId?: any) => {
  const result = await prisma.communityPost.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedBy: adminUserId || null,
      approvedAt: new Date(),
      rejectionReason: null,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const rejectPost = async (id: any, adminUserId?: any, rejectionReason?: any) => {
  const result = await prisma.communityPost.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedBy: adminUserId || null,
      rejectionReason: rejectionReason || "Post does not comply with community guidelines.",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const deletePost = async (id: any, user: any) => {
  if (!user || !user.id) {
    throw new Error("Authentication required.");
  }

  const existingPost = await prisma.communityPost.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw new Error("Community post not found.");
  }

  const isAuthor = existingPost.authorId === user.id;
  const isAdminOrMod = user.role === "ADMIN" || user.role === "MODERATOR";

  if (!isAuthor && !isAdminOrMod) {
    throw new Error("Forbidden! You are not authorized to delete this post.");
  }

  const result = await prisma.communityPost.delete({
    where: { id },
  });

  return result;
};

const getCommunityCategories = async () => {
  const categories = await prisma.communityPost.groupBy({
    by: ["category"],
    where: {
      status: "APPROVED",
    },
    _count: {
      _all: true,
    },
    orderBy: {
      _count: {
        category: "desc",
      },
    },
  });

  return categories.map((c: any) => ({
    name: c.category,
    count: c._count._all,
  }));
};

const getPopularTags = async () => {
  const posts = await prisma.communityPost.findMany({
    where: {
      status: "APPROVED",
    },
    select: {
      tags: true,
    },
  });

  const tagCounts: any = {};

  posts.forEach((post: any) => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach((tag: any) => {
        const cleanTag = String(tag).trim();
        if (cleanTag) {
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
        }
      });
    }
  });

  const sortedTags = Object.entries(tagCounts)
    .map(([tag, count]: any) => ({ tag, count }))
    .sort((a: any, b: any) => b.count - a.count);

  return sortedTags;
};

export const CommunityService = {
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
