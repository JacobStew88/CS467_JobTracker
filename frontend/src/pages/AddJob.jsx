import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/jobService";

export default function AddJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createJob(form);

      alert("Job created!");

      navigate("/jobs");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="body">
      <h1>Add Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="company_name"
          placeholder="Company"
          value={form.company_name}
          onChange={handleChange}
        />

        <input
          name="job_title"
          placeholder="Job Title"
          value={form.job_title}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="applied">Applied</option>
          <option value="waiting">Waiting</option>
          <option value="interviewed">Interviewed</option>
          <option value="decision">Decision</option>
        </select>

        <input
          type="date"
          name="application_date"
          value={form.application_date}
          onChange={handleChange}
        />

        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}