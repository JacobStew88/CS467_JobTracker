import { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  async function loadJobs() {
    try {
      const data = await getJobs();
      setJobs(data.jobs || data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter(job => job.job_id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="body">
      <h1>My Jobs</h1>

      <Link to="/add-job">+ Add Job</Link>

      {jobs.length === 0 ? (
        <p>No jobs yet</p>
      ) : (
        jobs.map((job) => (
          <div key={job.job_id} style={{ border: "1px solid gray", margin: 10 }}>
            <h3>{job.company_name}</h3>
            <p>{job.job_title}</p>
            <p>{job.status}</p>

            <button onClick={() => handleDelete(job.job_id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}