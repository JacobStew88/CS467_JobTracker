import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobs, updateJob } from "../services/jobService";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: "",
  });

  // 1. Load job on page load
  useEffect(() => {
    async function loadJob() {
      try {
        const data = await getJobs();

        // find job by id (backend returns array)
        const job = jobs.find(j => String(j.job_id) === String(id));

        if (!job) {
          alert("Job not found");
          navigate("/jobs");
          return;
        }

        setForm({
          company_name: job.company_name || "",
          job_title: job.job_title || "",
          status: job.status || "applied",
          application_date: job.application_date?.split("T")[0] || "",
        });

      } catch (err) {
        alert(err.message);
      }
    }

    loadJob();
  }, [id, navigate]);

  // 2. Handle form input changes
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 3. Submit update
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateJob(id, form);

      alert("Job updated!");
      navigate("/jobs");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="body">
      <h1>Edit Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
        />

        <input
          name="job_title"
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}