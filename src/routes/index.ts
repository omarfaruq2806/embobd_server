import { Router } from "express";
import { CategoryRoutes } from "../modules/category/category.routes";
import { CompanyRoutes } from "../modules/company/company.routes";
import { JobRoutes } from "../modules/job/job.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { BusinessRoutes } from "../modules/business/business.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/companies",
    route: CompanyRoutes,
  },
  {
    path: "/jobs",
    route: JobRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/businesses",
    route: BusinessRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
