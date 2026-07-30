import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { useContactShares } from "../../hooks/contacts/useContactShares";
import { useShareContact } from "../../hooks/contacts/useShareContact";
import { useUnshareContact } from "../../hooks/contacts/useUnshareContact";

export function ShareDialog({ contactId, onClose }: { contactId: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const { data: sharedUsers, isPending } = useContactShares(contactId, true);
  const shareContact = useShareContact();
  const unshareContact = useUnshareContact();

  function handleShare(e: FormEvent) {
    e.preventDefault();
    shareContact.mutate(
      { contactId, email: email.trim() },
      { onSuccess: () => setEmail("") },
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-foreground/30 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-lg">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Share this contact</h2>

        <form onSubmit={handleShare} className="mb-2 flex gap-2">
          <Input
            placeholder="user@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={shareContact.isPending}>
            Share
          </Button>
        </form>
        {shareContact.isError && <p className="mb-2 text-xs text-destructive">{shareContact.error.message}</p>}

        {isPending ? (
          <Spinner />
        ) : sharedUsers && sharedUsers.length > 0 ? (
          <ul className="mb-4 space-y-2">
            {sharedUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between text-sm text-foreground">
                <span>
                  {user.first_name} {user.last_name} ({user.email})
                </span>
                <button
                  type="button"
                  onClick={() => unshareContact.mutate({ contactId, userId: user.id })}
                  className="text-destructive hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-muted-foreground">Not shared with anyone yet.</p>
        )}

        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}
