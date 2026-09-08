import { z } from "zod";

import type {
	MaintenanceRequestPriority,
	MaintenanceRequestStatus,
} from "@stairway/types";

const maintenanceRequestPriorities = ["low", "medium", "high"] as const satisfies readonly MaintenanceRequestPriority[];
const maintenanceRequestStatuses = ["open", "in_progress", "resolved"] as const satisfies readonly MaintenanceRequestStatus[];

export const createMaintenanceRequestSchema = z.object({
	propertyId: z.string().min(1),
	title: z.string().min(1),
	description: z.string().min(1),
	priority: z.enum(maintenanceRequestPriorities),
});

export const updateMaintenanceRequestStatusSchema = z.object({
	status: z.enum(maintenanceRequestStatuses),
});

export const updateMaintenanceRequestPrioritySchema = z.object({
	priority: z.enum(maintenanceRequestPriorities),
});