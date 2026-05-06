import { useEffect, useState } from "react";
import { createJob, getJobs, deleteJob, updateJob, } from "../services/jobService";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Popup";
import JobFormPopup from "../components/JobFormPopup";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  // Editing variables
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: "",
  });
// Adding variables
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: "",
  });

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
      application_date: job.application_date?.split("T")[0] || "",
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
      const updated = await updateJob(editingJob.job_id, editForm);

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

  function formatDate(date) {
    if (!date) return "—";
    const [year, month, day] = date.slice(0, 10).split("-");
    return `${month}/${day}/${year}`;
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
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.company_name}</td>
                  <td>{job.job_title}</td>
                  <td className={`status status-${job.status}`}>
                    {job.status}
                  </td>  
                  <td>{formatDate(job.application_date)}</td>
                  <td>
                    <div className="button-group">
                    <Button onClick={() => openEdit(job)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(job.job_id)}>
                      Delete
                    </Button>
                    {console.log(job.application_date)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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