export type Id = string;

export type IsoDateString = string;

export type UserRole = "admin" | "member";

export type MaintenanceRequestStatus =
	| "open"
	| "in_progress"
	| "resolved";

export type MaintenanceRequestPriority = "low" | "medium" | "high";

export interface Organisation {
	id: Id;
	name: string;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface User {
	id: Id;
	organisationId: Id;
	name: string;
	email: string;
	role: UserRole;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface Property {
	id: Id;
	organisationId: Id;
	name: string;
	address: string;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface MaintenanceRequest {
	id: Id;
	organisationId: Id;
	propertyId: Id;
	createdById: Id;
	title: string;
	description: string;
	status: MaintenanceRequestStatus;
	priority: MaintenanceRequestPriority;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}