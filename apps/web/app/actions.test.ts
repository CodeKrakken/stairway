import { describe, expect, it, vi } from "vitest";

import {
	createMaintenanceRequestAction,
	updateMaintenanceRequestPriorityAction,
	updateMaintenanceRequestStatusAction,
} from "./actions";
import {
	createMaintenanceRequest,
	updateMaintenanceRequestPriority,
	updateMaintenanceRequestStatus,
} from "@/lib/maintenance-requests";

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("@/lib/maintenance-requests", () => ({
	createMaintenanceRequest: vi.fn(),
	updateMaintenanceRequestPriority: vi.fn(),
	updateMaintenanceRequestStatus: vi.fn(),
}));

function formData(values: Record<string, string>) {
	const data = new FormData();

	for (const [key, value] of Object.entries(values)) {
		data.set(key, value);
	}

	return data;
}

describe("maintenance request Server Actions", () => {
	it("passes only create form fields to the create operation", async () => {
		const result = await createMaintenanceRequestAction(
			{ success: false, error: null },
			formData({
				propertyId: "property-id",
				title: "Leaking tap",
				description: "The kitchen tap is leaking.",
				priority: "high",
			}),
		);

		expect(createMaintenanceRequest).toHaveBeenCalledWith({
			propertyId: "property-id",
			title: "Leaking tap",
			description: "The kitchen tap is leaking.",
			priority: "high",
		});
		expect(result).toEqual({ success: true, error: null });
	});

	it("returns a useful error when create validation fails", async () => {
		vi.mocked(createMaintenanceRequest).mockRejectedValueOnce(
			new Error("Title is required"),
		);

		const result = await createMaintenanceRequestAction(
			{ success: false, error: null },
			formData({
				propertyId: "property-id",
				title: "",
				description: "Description",
				priority: "high",
			}),
		);

		expect(result).toEqual({ success: false, error: "Title is required" });
	});

	it("dispatches status updates to the status operation", async () => {
		await updateMaintenanceRequestStatusAction(
			{ success: false, error: null },
			formData({ requestId: "request-id", status: "resolved" }),
		);

		expect(updateMaintenanceRequestStatus).toHaveBeenCalledWith("request-id", {
			status: "resolved",
		});
	});

	it("dispatches priority updates to the priority operation", async () => {
		await updateMaintenanceRequestPriorityAction(
			{ success: false, error: null },
			formData({ requestId: "request-id", priority: "low" }),
		);

		expect(updateMaintenanceRequestPriority).toHaveBeenCalledWith("request-id", {
			priority: "low",
		});
	});
});