import { useEffect, useState } from "react";
import {
  getSkills,
  createSkill,
  deleteSkill,
} from "../services/skillService";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState(3);

  async function loadSkills() {
    const data = await getSkills();
    setSkills(data);
  }

  useEffect(() => {
    loadSkills();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    await createSkill({
      skill_name: skillName,
      comfort_level: level,
    });

    setSkillName("");
    setLevel(3);
    loadSkills();
  }

  async function handleDelete(id) {
    await deleteSkill(id);
    loadSkills();
  }

  return (
    <div className="body">
      <h1>Skills</h1>

      {/* ADD FORM */}
      <form onSubmit={handleAdd}>
        <input
          placeholder="Skill name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
        />

        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <button type="submit">Add Skill</button>
      </form>

      {/* LIST */}
      {skills.map((skill) => (
        <div key={skill.skill_id}>
          {skill.skill_name} ({skill.comfort_level})
          <button onClick={() => handleDelete(skill.skill_id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
