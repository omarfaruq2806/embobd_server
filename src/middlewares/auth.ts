import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth";
import { catchAsync } from "../utils/catchAsync";

// লগইন করা ইউজারের সেশন চেক করার মিডলওয়্যার
export const requireAuth = catchAsync(async (req: any, res: any, next: any) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "You are not authorized! Please sign in.",
    });
  }

  // রিকোয়েস্টে ইউজার অবজেক্ট যুক্ত করে দেওয়া হলো
  req.user = session.user;
  req.session = session.session;

  next();
});

// নির্দিষ্ট রোল বা রোলসমূহের অনুমতি চেক করার মিডলওয়্যার
export const requireRole = (...allowedRoles: string[]) => {
  return catchAsync(async (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "You are not authenticated! Please sign in first.",
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Forbidden! Access denied for role: ${userRole}. Required role: ${allowedRoles.join(" or ")}.`,
      });
    }

    next();
  });
};

// অপশনাল সেশন চেক করার মিডলওয়্যার (যদি লগইন করা থাকে তবে ইউজার অবজেক্ট যুক্ত করবে, না থাকলেও রিকোয়েস্ট ব্লক করবে না)
export const optionalAuth = catchAsync(async (req: any, res: any, next: any) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session) {
      req.user = session.user;
      req.session = session.session;
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
});


