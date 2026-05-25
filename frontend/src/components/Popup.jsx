export default function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="card--popup" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}