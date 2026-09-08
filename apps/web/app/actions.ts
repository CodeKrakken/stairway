"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
	createMaintenanceRequest,
	updateMaintenanceRequestPriority,
	updateMaintenanceRequestStatus,
} from "@/lib/maintenance-requests";

export type ActionState = {
	success: boolean;
	error: string | null;
};

const initialActionState: ActionState = {
	success: false,
	error: null,
};

function getErrorMessage(error: unknown) {
	if (error instanceof ZodError) {
		return error.issues.map((issue) => issue.message).join(" ");
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Something went wrong. Please try again.";
}

export async function createMaintenanceRequestAction(
	_previousState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	try {
		await createMaintenanceRequest({
			propertyId: formData.get("propertyId"),
			title: formData.get("title"),
			description: formData.get("description"),
			priority: formData.get("priority"),
		});
		revalidatePath("/");

		return { ...initialActionState, success: true };
	} catch (error) {
		return { ...initialActionState, error: getErrorMessage(error) };
	}
}

export async function updateMaintenanceRequestStatusAction(
	_previousState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	try {
		await updateMaintenanceRequestStatus(String(formData.get("requestId")), {
			status: formData.get("status"),
		});
		revalidatePath("/");

		return { ...initialActionState, success: true };
	} catch (error) {
		return { ...initialActionState, error: getErrorMessage(error) };
	}
}

export async function updateMaintenanceRequestPriorityAction(
	_previousState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	try {
		await updateMaintenanceRequestPriority(String(formData.get("requestId")), {
			priority: formData.get("priority"),
		});
		revalidatePath("/");

		return { ...initialActionState, success: true };
	} catch (error) {
		return { ...initialActionState, error: getErrorMessage(error) };
	}
}