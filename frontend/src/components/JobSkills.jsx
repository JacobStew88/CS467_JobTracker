import { useEffect, useState } from "react";
import { getSkillsForJob, assignSkillToJob, removeSkillFromJob, getSkills } from "../services/skillService";

export default function JobSkills({ jobId }) {
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  // LOAD DATA
  async function loadSkills() {
    try {
      const [jobSkills, all] = await Promise.all([
        getSkillsForJob(jobId),
        getSkills()
      ]);

      setSkills(jobSkills);
      setAllSkills(all);

    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    loadSkills();
  }, [jobId]);

  // ASSIGN
  async function handleAssign() {
    if (!selectedSkill) return;

    try {
      await assignSkillToJob(selectedSkill, jobId);
      loadSkills();
      setSelectedSkill("");

    } catch (err) {
      alert(err.message);
    }
  }

  // REMOVE
  async function handleRemove(skillId) {
    try {
      await removeSkillFromJob(skillId, jobId);
      setSkills((prev) =>
        prev.filter((s) => s.skill_id !== skillId)
      );
    } catch (err) {
      alert(err.message);
    }
  }


  return (
    <div className="skill-block">
      {/* Existing skills */}
      <div className="chip-row">
        {skills.map((s) => (
          <span key={s.skill_id} className="chip">
            {s.skill_name}
            <button
              className="chip-remove"
              onClick={() => handleRemove(s.skill_id)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    {/* Add skill */}
    <div className="skill-add">
      <select
        value={selectedSkill}
        onChange={(e) => setSelectedSkill(e.target.value)}
      >
        <option value="">Select Skill</option>
        {allSkills.map((s) => (
          <option key={s.skill_id} value={s.skill_id}>
            {s.skill_name}
          </option>
        ))}
      </select>

      <button onClick={handleAssign}>+</button>
    </div>
  </div>
);
}