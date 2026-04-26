export default function Tab({ children, isActive = false, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`ui-tab ${isActive ? 'ui-tab--active' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
