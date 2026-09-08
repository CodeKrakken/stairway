"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import type { Property } from "@stairway/types";

import {
	createMaintenanceRequestAction,
	updateMaintenanceRequestPriorityAction,
	updateMaintenanceRequestStatusAction,
	type ActionState,
} from "@/app/actions";
import type { MaintenanceRequestWithProperty } from "@/lib/maintenance-requests";

type MaintenanceRequestsProps = {
	properties: Pick<Property, "id" | "name">[];
	requests: MaintenanceRequestWithProperty[];
};

const initialActionState: ActionState = {
	success: false,
	error: null,
};

const priorities = ["low", "medium", "high"] as const;
const statuses = ["open", "in_progress", "resolved"] as const;

export function MaintenanceRequests({ properties, requests }: MaintenanceRequestsProps) {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);
	const [createState, createAction, isCreating] = useActionState(
		createMaintenanceRequestAction,
		initialActionState,
	);
	const [statusState, statusAction, isUpdatingStatus] = useActionState(
		updateMaintenanceRequestStatusAction,
		initialActionState,
	);
	const [priorityState, priorityAction, isUpdatingPriority] = useActionState(
		updateMaintenanceRequestPriorityAction,
		initialActionState,
	);

	useEffect(() => {
		if (createState.success) {
			formRef.current?.reset();
			router.refresh();
		}
	}, [createState.success, router]);

	useEffect(() => {
		if (statusState.success || priorityState.success) {
			router.refresh();
		}
	}, [priorityState.success, router, statusState.success]);

	return (
		<section>
			<h2>Maintenance requests</h2>

			<form ref={formRef} action={createAction}>
				<h3>New request</h3>
				<label>
					Property
					<select name="propertyId" required defaultValue="">
						<option value="" disabled>
						Select a property
						</option>
						{properties.map((property) => (
							<option key={property.id} value={property.id}>
								{property.name}
							</option>
						))}
					</select>
				</label>
				<label>
					Title
					<input name="title" required />
				</label>
				<label>
					Description
					<textarea name="description" required />
				</label>
				<label>
					Priority
					<select name="priority" defaultValue="medium">
						{priorities.map((priority) => (
							<option key={priority} value={priority}>
								{priority}
							</option>
						))}
					</select>
				</label>
				<button type="submit" disabled={isCreating || properties.length === 0}>
					{isCreating ? "Creating..." : "Create request"}
				</button>
				{createState.error ? <p role="alert">{createState.error}</p> : null}
			</form>

			{requests.length === 0 ? (
				<p>No maintenance requests yet.</p>
			) : (
				<ul>
					{requests.map((request) => (
						<li key={request.id}>
							<h3>{request.title}</h3>
							<p>{request.property.name}</p>
							<p>{request.description}</p>
							<p>Created {new Date(request.createdAt).toLocaleDateString()}</p>
							<form action={statusAction}>
								<input type="hidden" name="requestId" value={request.id} />
								<label>
									Status
									<select name="status" defaultValue={request.status}>
										{statuses.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
								</label>
								<button type="submit" disabled={isUpdatingStatus}>
									{isUpdatingStatus ? "Saving..." : "Save status"}
								</button>
							</form>
							<form action={priorityAction}>
								<input type="hidden" name="requestId" value={request.id} />
								<label>
									Priority
									<select name="priority" defaultValue={request.priority}>
										{priorities.map((priority) => (
											<option key={priority} value={priority}>
												{priority}
											</option>
										))}
									</select>
								</label>
								<button type="submit" disabled={isUpdatingPriority}>
									{isUpdatingPriority ? "Saving..." : "Save priority"}
								</button>
							</form>
						</li>
					))}
				</ul>
			)}
			{statusState.error ? <p role="alert">{statusState.error}</p> : null}
			{priorityState.error ? <p role="alert">{priorityState.error}</p> : null}
		</section>
	);
}