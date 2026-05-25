import { useEffect, useState } from "react";
import {
  getContacts,
  createContact,
  deleteContact,
  updateContact
} from "../services/contactService";

import Button from "../components/Button";
import ContactCard from "../components/ContactCard";
import ContactFormPopup from "../components/ContactFormPopup";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    notes: ""
  };

  const [form, setForm] = useState(emptyForm);

  // -------------------------
  // LOAD CONTACTS
  // -------------------------
  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    const data = await getContacts();
    setContacts(data);
  }

  // -------------------------
  // FORM HANDLING
  // -------------------------
  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  // -------------------------
  // ADD CONTACT
  // -------------------------
  async function handleCreate(e) {
    e.preventDefault();

    const newContact = await createContact(form);

    setContacts((prev) => [...prev, newContact]);

    setIsAddOpen(false);
    setForm(emptyForm);
  }

  // -------------------------
  // EDIT CONTACT
  // -------------------------
  function openEdit(contact) {
    setEditingContact(contact);
    setForm(contact);
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const updated = await updateContact(
      editingContact.contact_id,
      form
    );

    setContacts((prev) =>
      prev.map((c) =>
        c.contact_id === updated.contact_id ? updated : c
      )
    );

    setEditingContact(null);
    setForm(emptyForm);
  }

  // -------------------------
  // DELETE CONTACT
  // -------------------------
  async function handleDelete(id) {
    await deleteContact(id);

    setContacts((prev) =>
      prev.filter((c) => c.contact_id !== id)
    );
  }

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="body">
      <h1>Contacts</h1>

      <Button
        onClick={() => {
          setForm(emptyForm);
          setIsAddOpen(true);
        }}
      >
        + Add Contact
      </Button>

      {/* CONTACT LIST */}
      <div className="card-grid">
        {contacts.length === 0 ? (
          <p>No contacts yet</p>
        ) : (
          contacts.map((c) => (
            <ContactCard
              key={c.contact_id}
              contact={c}
              onDelete={handleDelete}
              onEdit={openEdit}
            />
          ))
        )}
      </div>

      {/* ADD CONTACT */}
      <ContactFormPopup
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Contact"
        form={form}
        onChange={handleChange}
        onSubmit={handleCreate}
      />

      {/* EDIT CONTACT */}
      <ContactFormPopup
        isOpen={Boolean(editingContact)}
        onClose={() => {
          setEditingContact(null);
          setForm(emptyForm);
        }}
        title="Edit Contact"
        form={form}
        onChange={handleChange}
        onSubmit={handleUpdate}
        isEdit
      />
    </div>
  );
}