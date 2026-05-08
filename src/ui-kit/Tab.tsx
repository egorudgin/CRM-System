type TabProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

export default function Tab({ children, isActive = false, className = '', ...props }: TabProps) {
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
