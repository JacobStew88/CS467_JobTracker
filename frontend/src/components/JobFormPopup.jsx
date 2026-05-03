import Popup from "./Popup";
import Input from "./Input";
import Button from "./Button";

export default function JobFormPopup({
  isOpen,
  onClose,
  title,
  form,
  onChange,
  onSubmit,
  isEdit = false,
}) {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <h2>{title}</h2>

      <form onSubmit={onSubmit} className="form">
        <Input
          name="company_name"
          placeholder="Company Name"
          value={form.company_name}
          onChange={onChange}
        />

        <Input
          name="job_title"
          placeholder="Job Title"
          value={form.job_title}
          onChange={onChange}
        />

        <Input
          type="select"
          name="status"
          value={form.status}
          onChange={onChange}
        >
          <option value="applied">Applied</option>
          <option value="waiting">Waiting</option>
          <option value="interviewed">Interviewed</option>
          <option value="decision">Decision</option>
        </Input>

        <Input
          type="date"
          name="application_date"
          value={form.application_date}
          onChange={onChange}
        />
        <div className="button-group">
        <Button type="submit">
          {isEdit ? "Save" : "Create"}
        </Button>

        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        </div>
      </form>
    </Popup>
  );
}