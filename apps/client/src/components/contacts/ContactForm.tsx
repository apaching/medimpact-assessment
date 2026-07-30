import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import type { Contact } from "../../types/types";

interface ContactFormProps {
  initial?: Contact;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function ContactForm({ initial, onSubmit, onCancel, isSubmitting, error }: ContactFormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [contactNumber, setContactNumber] = useState(initial?.contactNumber ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [photo, setPhoto] = useState<File | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("firstName", firstName.trim());
    formData.set("lastName", lastName.trim());
    formData.set("contactNumber", contactNumber.trim());
    formData.set("email", email.trim());
    if (photo) formData.set("photo", photo);
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstName">
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </Field>
      </div>

      <Field label="Contact number" htmlFor="contactNumber">
        <Input id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Field label="Profile photo" htmlFor="photo">
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
        />
      </Field>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
