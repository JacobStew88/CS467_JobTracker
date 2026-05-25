import { useEffect, useState } from "react";
import { createJob, getJobs, deleteJob, updateJob, } from "../services/jobService";
import Button from "../components/Button";
import Card from "../components/Card";
import JobFormPopup from "../components/JobFormPopup";
import JobContacts from "../components/JobContacts";
import JobSkills from "../components/JobSkills";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  // Editing
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: "",
  });

  // Adding
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: "",
  });
  
  async function loadJobs() {
    try {
      const jobsData = await getJobs();
      const jobsList = jobsData.jobs || jobsData;
      setJobs(jobsList);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);
 
  // DELETE
  async function handleDelete(id) {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.job_id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  // EDIT
  function openEdit(job) {
    setEditingJob(job);

    setEditForm({
      company_name: job.company_name || "",
      job_title: job.job_title || "",
      status: job.status || "applied",
      application_date:
        job.application_date?.split("T")[0] || "",
    });
  }

  function handleEditChange(e) {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const updated = await updateJob(
        editingJob.job_id,
        editForm
      );

      setJobs((prev) =>
        prev.map((job) =>
          job.job_id === editingJob.job_id ? updated : job
        )
      );

      setEditingJob(null);
    } catch (err) {
      alert(err.message);
    }
  }

  // ADD
   function openAdd() {
    setIsAddOpen(true);
  }

  function closeAdd() {
    setIsAddOpen(false);

    setAddForm({
      company_name: "",
      job_title: "",
      status: "applied",
      application_date: "",
    });
  }

  function handleAddChange(e) {
    const { name, value } = e.target;

    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();

    try {
      const newJob = await createJob(addForm);

      setJobs((prev) => [...prev, newJob]);

      closeAdd();
    } catch (err) {
      alert(err.message);
    }
  }

  // RENDER
  return (
    <div className="body">
      <h1>My Jobs</h1>
      <Button onClick={openAdd}>+ Add Job</Button>
      <Card>
        {jobs.length === 0 ? (
          <p>No jobs yet</p>
        ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
            key={job.job_id}
            job={job}
            onEdit={openEdit}
            onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      </Card>
      {/* EDIT SCREEN */}
      <JobFormPopup
        isOpen={Boolean(editingJob)}
        onClose={() => setEditingJob(null)}
        title="Edit Job"
        form={editForm}
        onChange={handleEditChange}
        onSubmit={handleUpdate}
        isEdit
      />
      {/* ADD SCREEN */}
      <JobFormPopup
        isOpen={isAddOpen}
        onClose={closeAdd}
        title="Add Job"
        form={addForm}
        onChange={handleAddChange}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
}
