import { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

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
      <Card>
      {jobs.length === 0 ? (
        <p>No jobs yet</p>
      ) : (
        jobs.map((job) => (
          <div key={job.job_id}>
            <h3>{job.company_name}</h3>
            <p>{job.job_title}</p>
            <p>{job.status}</p>

            <Button onClick={() => handleDelete(job.job_id)}>
              Delete
            </Button>
          </div>
        ))
      )}
      </Card>
    </div>
  );
}