import { useEffect, useState } from "react";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../services/skillService";

import Button from "../components/Button";
import Card from "../components/Card";
import JobFormPopup from "../components/JobFormPopup"; // reuse your popup

export default function Skills() {
  const [skills, setSkills] = useState([]);

  // EDIT STATE
  const [editingSkill, setEditingSkill] = useState(null);
  const [editForm, setEditForm] = useState({
    skill_name: "",
    comfort_level: 3,
  });

  // ADD STATE
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    skill_name: "",
    comfort_level: 3,
  });

  // LOAD
  async function loadSkills() {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  // DELETE
  async function handleDelete(id) {
    try {
      await deleteSkill(id);
      setSkills((prev) =>
        prev.filter((skill) => skill.skill_id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  // ======================
  // EDIT
  // ======================

  function openEdit(skill) {
    setEditingSkill(skill);
    setEditForm({
      skill_name: skill.skill_name || "",
      comfort_level: skill.comfort_level || 3,
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "comfort_level" ? Number(value) : value,
    }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const updated = await updateSkill(
        editingSkill.skill_id,
        editForm
      );

      setSkills((prev) =>
        prev.map((skill) =>
          skill.skill_id === editingSkill.skill_id ? updated : skill
        )
      );

      setEditingSkill(null);
    } catch (err) {
      alert(err.message);
    }
  }

  // ======================
  // ADD
  // ======================

  function openAdd() {
    setIsAddOpen(true);
  }

  function closeAdd() {
    setIsAddOpen(false);
    setAddForm({
      skill_name: "",
      comfort_level: 3,
    });
  }

  function handleAddChange(e) {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: name === "comfort_level" ? Number(value) : value,
    }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      const newSkill = await createSkill(addForm);
      setSkills((prev) => [...prev, newSkill]);
      closeAdd();
    } catch (err) {
      alert(err.message);
    }
  }

  // ======================
  // RENDER
  // ======================

  return (
    <div className="body">
      <h1>My Skills</h1>

      <Button onClick={openAdd}>+ Add Skill</Button>

      <Card>
        {skills.length === 0 ? (
          <p>No skills yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Comfort Level</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {skills.map((skill) => (
                <tr key={skill.skill_id}>
                  <td>{skill.skill_name}</td>

                  <td>
                    {"★".repeat(skill.comfort_level)}
                    {"☆".repeat(5 - skill.comfort_level)}
                  </td>

                  <td>
                    <div className="button-group">
                      <Button onClick={() => openEdit(skill)}>
                        Edit
                      </Button>

                      <Button
                        onClick={() =>
                          handleDelete(skill.skill_id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* EDIT POPUP */}
      <form>
        {editingSkill && (
          <div className="modal">
            <Card>
              <h2>Edit Skill</h2>

              <input
                name="skill_name"
                value={editForm.skill_name}
                onChange={handleEditChange}
                placeholder="Skill name"
              />

              <select
                name="comfort_level"
                value={editForm.comfort_level}
                onChange={handleEditChange}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>

              <Button onClick={handleUpdate}>Save</Button>
              <Button onClick={() => setEditingSkill(null)}>
                Cancel
              </Button>
            </Card>
          </div>
        )}
      </form>

      {/* ADD POPUP */}
      <form>
        {isAddOpen && (
          <div className="modal">
            <Card>
              <h2>Add Skill</h2>

              <input
                name="skill_name"
                value={addForm.skill_name}
                onChange={handleAddChange}
                placeholder="Skill name"
              />

              <select
                name="comfort_level"
                value={addForm.comfort_level}
                onChange={handleAddChange}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>

              <Button onClick={handleAddSubmit}>Create</Button>
              <Button onClick={closeAdd}>Cancel</Button>
            </Card>
          </div>
        )}
      </form>
    </div>
  );
}