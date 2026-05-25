import { useState } from "react";
import Button from "./Button";

export default function ContactCard({ contact, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card card--job">

      <div className="card-header">
        <div>
          <h3>{contact.first_name} {contact.last_name}</h3>
        </div>
        <Button onClick={() => setOpen(!open)}>
          {open ? "Hide details" : "View details"}
        </Button>
      </div>
      {open && (
        <div className="card-details">
            <p className="card-subtitle">{contact.email}</p>
            <div className="card-meta">
                <span>{contact.phone}</span>
            </div>
          <div className="detail-section">
            <h4>Notes</h4>
            <p>{contact.notes || "—"}</p>
          </div>
          <div className="card-actions">
            <Button onClick={() => onDelete(contact.contact_id)}>🗑 Delete</Button>
            <Button onClick={() => onEdit(contact)}>✎ Edit</Button>
          </div>
        </div>
      )}
    </div>
  );
}