import { blogPostRouter, masterDataRouter, templateRouter, userManagementRouter } from "./api";

export const router = [...templateRouter, ...userManagementRouter, ...masterDataRouter, ...blogPostRouter];
