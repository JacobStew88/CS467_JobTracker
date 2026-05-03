export default function Button({ children, onClick }) {
  return (
    <div className="button-group">
    <button className="button" onClick={onClick}>
      {children}
    </button>
    </div>
  );
}