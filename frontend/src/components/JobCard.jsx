import { useState } from "react";
import Button from "./Button";
import JobSkills from "./JobSkills";
import JobContacts from "./JobContacts";

  function formatDate(date) {
    if (!date) return "—";
    const [year, month, day] = date
      .slice(0, 10)
      .split("-");
    return `${month}/${day}/${year}`;
  }

export default function JobCard({ job, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card card--job">
      {/* top row */}
      <div className="card-header">
        <div>
          <h3>{job.company_name}</h3>
          <p className="card-title">{job.job_title}</p>
        </div>
          <span className={`status status-${job.status}`}>
            {job.status.replace(/^./, char => char.toUpperCase())}
          </span>
      </div>
      <div className="card-meta">
        <span>
          {formatDate(job.application_date)}
        </span>
      </div>
      
      {/* actions */}
      <div className="card-actions">
        <button onClick={() => setOpen(!open)}>
          {open ? "Hide details" : "View details"}
        </button>

        <div className="button-group">
          <Button onClick={() => onEdit(job)}>✎</Button>
          <Button onClick={() => onDelete(job.job_id)}>🗑</Button>
        </div>
      </div>

      {/* expandable section */}
      {open && (
        <div className="card-details">
          <div className="detail-section">
            <h4>Skills</h4>
            <JobSkills jobId={job.job_id} />
          </div>

          <div className="detail-section">
            <h4>Contacts</h4>
            <JobContacts jobId={job.job_id} />
          </div>
        </div>
      )}
    </div>
  );
}