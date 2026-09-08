import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import {
	createMaintenanceRequest,
	listMaintenanceRequests,
	updateMaintenanceRequestPriority,
	updateMaintenanceRequestStatus,
} from "./maintenance-requests";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/supabase/user";

vi.mock("@/lib/supabase/server", () => ({
	createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/user", () => ({
	getAuthenticatedUser: vi.fn(),
}));

const authenticatedUser = {
	authUser: { id: "auth-user-id" } as SupabaseUser,
	applicationUser: {
		id: "application-user-id",
		organisationId: "organisation-id",
		name: "Alex Morgan",
		email: "alex@example.com",
		role: "admin" as const,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
	organisationId: "organisation-id",
};

const requestRow = {
	id: "request-id",
	organisation_id: "organisation-id",
	property_id: "property-id",
	created_by_id: "application-user-id",
	title: "Leaking tap",
	description: "The kitchen tap is leaking.",
	status: "open",
	priority: "medium",
	created_at: "2026-01-01T00:00:00.000Z",
	updated_at: "2026-01-01T00:00:00.000Z",
};

function createQuery(result: { data: unknown; error: Error | null }) {
	const query = {
		select: vi.fn(),
		insert: vi.fn(),
		update: vi.fn(),
		eq: vi.fn(),
		order: vi.fn(),
		single: vi.fn(),
	};

	query.select.mockReturnValue(query);
	query.insert.mockReturnValue(query);
	query.update.mockReturnValue(query);
	query.eq.mockReturnValue(query);
	query.order.mockResolvedValue(result);
	query.single.mockResolvedValue(result);

	return query;
}

describe("maintenance request operations", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getAuthenticatedUser).mockResolvedValue(authenticatedUser);
	});

	it("lists requests with property information", async () => {
		const query = createQuery({
			data: [{ ...requestRow, property: { id: "property-id", name: "Maple Court" } }],
			error: null,
		});
		vi.mocked(createClient).mockResolvedValue({
			from: vi.fn().mockReturnValue(query),
		} as never);

		const result = await listMaintenanceRequests();

		expect(query.select).toHaveBeenCalledWith(expect.stringContaining("property:properties"));
		expect(result[0]?.property.name).toBe("Maple Court");
	});

	it("validates and inserts only trusted identity fields", async () => {
		const query = createQuery({ data: requestRow, error: null });
		vi.mocked(createClient).mockResolvedValue({
			from: vi.fn().mockReturnValue(query),
		} as never);

		await createMaintenanceRequest({
			propertyId: "property-id",
			title: "Leaking tap",
			description: "The kitchen tap is leaking.",
			priority: "high",
			organisationId: "spoofed-organisation-id",
			createdById: "spoofed-user-id",
		});

		expect(query.insert).toHaveBeenCalledWith({
			organisation_id: "organisation-id",
			property_id: "property-id",
			created_by_id: "application-user-id",
			title: "Leaking tap",
			description: "The kitchen tap is leaking.",
			priority: "high",
		});
	});

	it("rejects invalid create input before contacting Supabase", async () => {
		await expect(
			createMaintenanceRequest({
				propertyId: "",
				title: "",
				description: "",
				priority: "urgent",
			}),
		).rejects.toThrow();

		expect(createClient).not.toHaveBeenCalled();
	});

	it("rejects unauthenticated users before listing requests", async () => {
		vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

		await expect(listMaintenanceRequests()).rejects.toThrow(
			"Authentication required",
		);
		expect(createClient).not.toHaveBeenCalled();
	});

	it("validates and updates only status", async () => {
		const query = createQuery({ data: requestRow, error: null });
		vi.mocked(createClient).mockResolvedValue({
			from: vi.fn().mockReturnValue(query),
		} as never);

		await updateMaintenanceRequestStatus("request-id", { status: "resolved" });

		expect(query.update).toHaveBeenCalledWith({ status: "resolved" });
		expect(query.eq).toHaveBeenCalledWith("id", "request-id");
	});

	it("rejects an invalid status before contacting Supabase", async () => {
		await expect(
			updateMaintenanceRequestStatus("request-id", { status: "cancelled" }),
		).rejects.toThrow();
		expect(createClient).not.toHaveBeenCalled();
	});

	it("validates and updates only priority", async () => {
		const query = createQuery({ data: requestRow, error: null });
		vi.mocked(createClient).mockResolvedValue({
			from: vi.fn().mockReturnValue(query),
		} as never);

		await updateMaintenanceRequestPriority("request-id", { priority: "low" });

		expect(query.update).toHaveBeenCalledWith({ priority: "low" });
		expect(query.eq).toHaveBeenCalledWith("id", "request-id");
	});

	it("rejects an invalid priority before contacting Supabase", async () => {
		await expect(
			updateMaintenanceRequestPriority("request-id", { priority: "urgent" }),
		).rejects.toThrow();
		expect(createClient).not.toHaveBeenCalled();
	});
});