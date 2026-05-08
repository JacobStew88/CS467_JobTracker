export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  children,
}) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
            
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="input"
        >
          {children}
        </select>
      ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="input"
      />
      )}
    </div>
  );
}