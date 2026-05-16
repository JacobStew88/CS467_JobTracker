import { useEffect, useState } from "react";
import { getContacts, createContact, deleteContact } from "../services/contactService";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const [isOpen, setIsOpen] = useState(false);

  async function loadContacts() {
    const data = await getContacts();
    setContacts(data);
  }

  useEffect(() => {
    loadContacts();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();

    const newContact = await createContact(form);

    setContacts((prev) => [...prev, newContact]);

    setIsOpen(false);
  }

  async function handleDelete(id) {
    await deleteContact(id);

    setContacts((prev) =>
      prev.filter((c) => c.contact_id !== id)
    );
  }

  return (
    <div className="body">
      <h1>Contacts</h1>

      <Button onClick={() => setIsOpen(true)}>
        + Add Contact
      </Button>

      <Card>
        {contacts.length === 0 ? (
          <p>No contacts yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr key={c.contact_id}>
                  <td>
                    {c.first_name} {c.last_name}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>

                  <td>
                    <Button
                      onClick={() =>
                        handleDelete(c.contact_id)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {isOpen && (
        <div className="modal">
          <Card>
            <h2>Add Contact</h2>

            <form onSubmit={handleCreate}>
              <input
                name="first_name"
                placeholder="First name"
                onChange={handleChange}
              />

              <input
                name="last_name"
                placeholder="Last name"
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
              />

              <textarea
                name="notes"
                placeholder="Notes"
                onChange={handleChange}
              />

              <Button type="submit">
                Create
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}