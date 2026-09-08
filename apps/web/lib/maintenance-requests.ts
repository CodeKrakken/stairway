import type {
	MaintenanceRequest,
	MaintenanceRequestPriority,
	MaintenanceRequestStatus,
	Property,
} from "@stairway/types";
import {
	createMaintenanceRequestSchema,
	updateMaintenanceRequestPrioritySchema,
	updateMaintenanceRequestStatusSchema,
} from "@stairway/validation";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/supabase/user";

type MaintenanceRequestRow = {
	id: string;
	organisation_id: string;
	property_id: string;
	created_by_id: string;
	title: string;
	description: string;
	status: MaintenanceRequestStatus;
	priority: MaintenanceRequestPriority;
	created_at: string;
	updated_at: string;
};

type MaintenanceRequestWithPropertyRow = MaintenanceRequestRow & {
	property: Pick<Property, "id" | "name"> | Pick<Property, "id" | "name">[];
};

export type MaintenanceRequestWithProperty = MaintenanceRequest & {
	property: Pick<Property, "id" | "name">;
};

const maintenanceRequestSelect =
	"id, organisation_id, property_id, created_by_id, title, description, status, priority, created_at, updated_at";

function requireAuthenticatedUser(
	user: Awaited<ReturnType<typeof getAuthenticatedUser>>,
) {
	if (!user) {
		throw new Error("Authentication required");
	}

	return user;
}

function mapMaintenanceRequest(row: MaintenanceRequestRow): MaintenanceRequest {
	return {
		id: row.id,
		organisationId: row.organisation_id,
		propertyId: row.property_id,
		createdById: row.created_by_id,
		title: row.title,
		description: row.description,
		status: row.status,
		priority: row.priority,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

export async function listMaintenanceRequests(): Promise<MaintenanceRequestWithProperty[]> {
	requireAuthenticatedUser(await getAuthenticatedUser());
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("maintenance_requests")
		.select(`${maintenanceRequestSelect}, property:properties ( id, name )`)
		.order("created_at", { ascending: false });

	if (error) {
		throw error;
	}

	return (data ?? []).map((row) => {
		const typedRow = row as unknown as MaintenanceRequestWithPropertyRow;
		const property = Array.isArray(typedRow.property)
			? typedRow.property[0]
			: typedRow.property;

		if (!property) {
			throw new Error("Maintenance request property was not found");
		}

		return {
			...mapMaintenanceRequest(typedRow),
			property,
		};
	});
}

export async function createMaintenanceRequest(input: unknown): Promise<MaintenanceRequest> {
	const validatedInput = createMaintenanceRequestSchema.parse(input);
	const user = requireAuthenticatedUser(await getAuthenticatedUser());
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("maintenance_requests")
		.insert({
			organisation_id: user.organisationId,
			property_id: validatedInput.propertyId,
			created_by_id: user.applicationUser.id,
			title: validatedInput.title,
			description: validatedInput.description,
			priority: validatedInput.priority,
		})
		.select(maintenanceRequestSelect)
		.single();

	if (error) {
		throw error;
	}

	return mapMaintenanceRequest(data as MaintenanceRequestRow);
}

export async function updateMaintenanceRequestStatus(
	requestId: string,
	input: unknown,
): Promise<MaintenanceRequest> {
	const validatedInput = updateMaintenanceRequestStatusSchema.parse(input);
	requireAuthenticatedUser(await getAuthenticatedUser());
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("maintenance_requests")
		.update({ status: validatedInput.status })
		.eq("id", requestId)
		.select(maintenanceRequestSelect)
		.single();

	if (error) {
		throw error;
	}

	return mapMaintenanceRequest(data as MaintenanceRequestRow);
}

export async function updateMaintenanceRequestPriority(
	requestId: string,
	input: unknown,
): Promise<MaintenanceRequest> {
	const validatedInput = updateMaintenanceRequestPrioritySchema.parse(input);
	requireAuthenticatedUser(await getAuthenticatedUser());
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("maintenance_requests")
		.update({ priority: validatedInput.priority })
		.eq("id", requestId)
		.select(maintenanceRequestSelect)
		.single();

	if (error) {
		throw error;
	}

	return mapMaintenanceRequest(data as MaintenanceRequestRow);
}