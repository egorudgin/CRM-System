export default function IconButton({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`ui-icon-button ui-icon-button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
