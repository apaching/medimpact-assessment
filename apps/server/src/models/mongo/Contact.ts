import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const contactSchema = new Schema(
  {
    ownerId: { type: Number, required: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    photo: { type: String, default: null },
  },
  { timestamps: true },
);

export type ContactDoc = HydratedDocument<InferSchemaType<typeof contactSchema>>;

export const Contact = model("Contact", contactSchema);
