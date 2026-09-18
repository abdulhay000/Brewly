import { useEffect } from "react";

function Modal({ isOpen, onClose, children, className = "" }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`reusable-modal ${className}`.trim()} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

export default Modal;
