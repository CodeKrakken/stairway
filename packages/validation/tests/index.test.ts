import { describe, expect, it } from "vitest";

import {
	createMaintenanceRequestSchema,
	updateMaintenanceRequestPrioritySchema,
	updateMaintenanceRequestStatusSchema,
} from "../src/index";

describe("createMaintenanceRequestSchema", () => {
	it("accepts a valid maintenance request", () => {
		expect(
			createMaintenanceRequestSchema.safeParse({
				propertyId: "property-id",
				title: "Leaking tap",
				description: "The kitchen tap is leaking.",
				priority: "medium",
			}).success,
		).toBe(true);
	});

	it("rejects missing required fields and invalid priority", () => {
		const result = createMaintenanceRequestSchema.safeParse({
			propertyId: "",
			title: "",
			description: "",
			priority: "urgent",
		});

		expect(result.success).toBe(false);
	});
});

describe("updateMaintenanceRequestStatusSchema", () => {
	it("accepts a valid status", () => {
		expect(
			updateMaintenanceRequestStatusSchema.safeParse({
				status: "in_progress",
			}).success,
		).toBe(true);
	});

	it("rejects an unsupported status", () => {
		expect(
			updateMaintenanceRequestStatusSchema.safeParse({
				status: "cancelled",
			}).success,
		).toBe(false);
	});
});

describe("updateMaintenanceRequestPrioritySchema", () => {
	it("accepts a valid priority", () => {
		expect(
			updateMaintenanceRequestPrioritySchema.safeParse({
				priority: "high",
			}).success,
		).toBe(true);
	});

	it("rejects an unsupported priority", () => {
		expect(
			updateMaintenanceRequestPrioritySchema.safeParse({
				priority: "urgent",
			}).success,
		).toBe(false);
	});
});