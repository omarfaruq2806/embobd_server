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
