import { badRequest } from "./errors.js";

export function validateSchema(schema, payload) {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    const message = parsed.error.issues.map(issue => issue.message).join("; ");
    throw badRequest(message);
  }

  return parsed.data;
}