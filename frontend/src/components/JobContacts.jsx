import { useEffect, useState } from "react";
import { getContacts, getContactsFromJob, assignContactToJob, removeContactFromJob,} from "../services/contactService";


export default function JobContacts({ jobId }) {
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);

  const [selectedContact, setSelectedContact] = useState("");
  const [relationshipType, setRelationshipType] = useState("");

  async function loadContacts() {
    try {
      const linked = await getContactsFromJob(jobId);
      setContacts(linked);

      const all = await getContacts();
      setAllContacts(all);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    loadContacts();
  }, [jobId]);

  async function handleAssign() {
    if (!selectedContact || !relationshipType) return;

    try {
      await assignContactToJob(
        jobId,
        selectedContact,
        relationshipType
      );

      loadContacts();

      setSelectedContact("");
      setRelationshipType("");

    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRemove(contactId) {
    try {
      await removeContactFromJob(jobId, contactId);

      setContacts((prev) =>
        prev.filter((c) => c.contact_id !== contactId)
      );

    } catch (err) {
      alert(err.message);
    }
  }

return (
  <div className="skill-block">

    {/* existing contacts */}
    <div className="chip-row">
      {contacts.map((contact) => (
        <span key={contact.contact_id} className="chip chip-added">
          {contact.first_name} {contact.last_name}
          <span className="chip-meta">
            {contact.relationship_type}
          </span>

          <button
            className="chip-remove"
            onClick={() => handleRemove(contact.contact_id)}
          >
            ×
          </button>
        </span>
      ))}
    </div>

    {/* add contact */}
    <div className="skill-add">
      <select
        value={selectedContact}
        onChange={(e) => setSelectedContact(e.target.value)}
      >
        <option value="">Select contact</option>

        {allContacts.map((contact) => (
          <option
            key={contact.contact_id}
            value={contact.contact_id}
          >
            {contact.first_name} {contact.last_name}
          </option>
        ))}
      </select>

      <select
        value={relationshipType}
        onChange={(e) => setRelationshipType(e.target.value)}
      >
        <option value="">Role</option>
        <option value="Recruiter">Recruiter</option>
        <option value="Hiring Manager">Hiring Manager</option>
        <option value="Referral">Referral</option>
        <option value="Interviewer">Interviewer</option>
      </select>

      <button onClick={handleAssign}>+</button>
    </div>

  </div>
);
}