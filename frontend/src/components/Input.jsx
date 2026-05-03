export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}

      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}