const AdminSummary = ({
  employees,
  activeShift,
  onReset,
  onFilterChange,
}) => {
  const total = employees.length;

  const onShift = activeShift
    ? employees.filter((employee) => employee.shiftId === activeShift.id).length
    : 0;

  const idle = total - onShift;

  const summary = [
    { label: "All Employees", value: total, onClick: onReset },
    {
      label: "On Shift",
      value: onShift,
      onClick: () => onFilterChange({ status: "onShift" }),
    },
    {
      label: "Idle",
      value: idle,
      onClick: () => onFilterChange({ status: "idle" }),
    },
  ];

  return (
    <>
      <h1 className="employee-summary__title">Employees</h1>
      <div className="employee-summary__cards">
        {summary.map(({ label, value, onClick }) => (
          <div key={label} className="employee-summary__card">
            <p className="employee-summary__label">{label}</p>
            <div className="employee-summary__row">
              <span className="employee-summary__count">{value}</span>
              <span className="employee-summary__line"></span>
              <button
                className="employee-summary__button"
                onClick={() => {
                  onClick();
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminSummary;
