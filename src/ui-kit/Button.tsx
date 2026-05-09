type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
