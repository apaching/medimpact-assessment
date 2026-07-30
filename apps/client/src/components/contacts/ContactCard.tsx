import { useState } from "react";
import { Button } from "../ui/Button";
import { ShareDialog } from "./ShareDialog";
import { useDeleteContact } from "../../hooks/contacts/useDeleteContact";
import { useAuth } from "../../context/AuthContext";
import type { Contact } from "../../types/types";

export function ContactCard({ contact, onEdit }: { contact: Contact; onEdit: (contact: Contact) => void }) {
  const { user } = useAuth();
  const isOwner = contact.ownerId === user?.id;
  const deleteContact = useDeleteContact();
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {contact.photo ? (
          <img src={contact.photo!} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm text-secondary-foreground">
            {contact.firstName[0]}
            {contact.lastName[0]}
          </div>
        )}
        <div className="text-left">
          <p className="font-medium text-foreground">
            {contact.firstName} {contact.lastName}
            {!isOwner && <span className="ml-2 text-xs text-muted-foreground">(shared with you)</span>}
          </p>
          <p className="text-sm text-muted-foreground">{contact.contactNumber}</p>
          {contact.email && <p className="text-sm text-muted-foreground">{contact.email}</p>}
        </div>
      </div>

      {isOwner && (
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="secondary" onClick={() => setShowShare(true)}>
            Share
          </Button>
          <Button variant="secondary" onClick={() => onEdit(contact)}>
            Edit
          </Button>
          <Button
            variant="danger"
            disabled={deleteContact.isPending}
            onClick={() => {
              if (confirm("Delete this contact?")) deleteContact.mutate(contact._id);
            }}
          >
            Delete
          </Button>
        </div>
      )}

      {showShare && <ShareDialog contactId={contact._id} onClose={() => setShowShare(false)} />}
    </div>
  );
}
