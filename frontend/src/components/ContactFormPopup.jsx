import Popup from "./Popup";
import Input from "./Input";
import Button from "./Button";

export default function ContactFormPopup({
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
            name="first_name"
            placeholder="First name"
            onChange={onChange}
        />

        <Input
            name="last_name"
            placeholder="Last name"
            onChange={onChange}
        />

        <Input
            name="email"
            placeholder="Email"
            onChange={onChange}
        />
        
        <Input
            name="phone"
            placeholder="Phone"
            onChange={onChange}
        />

        <textarea
            name="notes"
            placeholder="Notes"
            onChange={onChange}
        />

        <div className="button-group">
        <Button type="submit">
          {isEdit ? "Save" : "Create"}
        </Button>

        <Button onClick={onClose}>
          Cancel
        </Button>
        </div>
      </form>
    </Popup>
  );
}