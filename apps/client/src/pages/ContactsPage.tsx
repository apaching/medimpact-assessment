import { useState } from "react";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { ContactCard } from "../components/contacts/ContactCard";
import { ContactForm } from "../components/contacts/ContactForm";
import { useContacts } from "../hooks/contacts/useContacts";
import { useCreateContact } from "../hooks/contacts/useCreateContact";
import { useUpdateContact } from "../hooks/contacts/useUpdateContact";
import type { Contact } from "../types/types";

export function ContactsPage() {
  const { data: contacts, isPending, isError } = useContacts();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const [mode, setMode] = useState<"list" | "create" | { edit: Contact }>("list");

  if (isPending) return <Spinner />;
  if (isError) return <EmptyState message="Couldn't load your contacts." />;

  return (
    <div className="space-y-4">
      {mode === "list" && (
        <div className="flex justify-end">
          <Button onClick={() => setMode("create")}>Add contact</Button>
        </div>
      )}

      {mode === "create" && (
        <ContactForm
          onCancel={() => setMode("list")}
          isSubmitting={createContact.isPending}
          error={createContact.error?.message}
          onSubmit={(formData) =>
            createContact.mutate(formData, { onSuccess: () => setMode("list") })
          }
        />
      )}

      {typeof mode === "object" && (
        <ContactForm
          initial={mode.edit}
          onCancel={() => setMode("list")}
          isSubmitting={updateContact.isPending}
          error={updateContact.error?.message}
          onSubmit={(formData) =>
            updateContact.mutate(
              { id: mode.edit._id, formData },
              { onSuccess: () => setMode("list") },
            )
          }
        />
      )}

      {mode === "list" &&
        (contacts && contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <ContactCard key={contact._id} contact={contact} onEdit={(c) => setMode({ edit: c })} />
            ))}
          </div>
        ) : (
          <EmptyState message="No contacts yet. Add your first one." />
        ))}
    </div>
  );
}
