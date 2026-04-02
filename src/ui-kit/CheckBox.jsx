export default function CheckBox({ checked, onChange, className = '', ...props }) {
  return (
    <label className={`ui-checkbox ${className}`.trim()}>
      <input type="checkbox" checked={checked} onChange={onChange} {...props} />
      <span className="ui-checkbox__mark"></span>
    </label>
  );
}
