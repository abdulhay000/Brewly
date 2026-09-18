function Button({ children, onClick, variant = "primary", type = "button", disabled = false, className = "" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`reusable-button reusable-button-${variant} ${className}`.trim()}>
      {children}
    </button>
  );
}

export default Button;
