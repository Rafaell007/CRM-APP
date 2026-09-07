import "./OnShiftNow.css";

const OnShiftNow = ({ employees, activeShift }) => {
  return (
    <section className="on-shift">
      <div className="on-shift__header">
        <h2 className="on-shift__title">Working now</h2>
        {activeShift && (
          <span className="on-shift__badge">Shift {activeShift.name}</span>
        )}
      </div>

      {employees.length === 0 ? (
        <p className="on-shift__empty">Nobody is on shift right now</p>
      ) : (
        <ul className="on-shift__list">
          {employees.map(({ id, avatar, name, email }) => (
            <li key={id} className="on-shift__item">
              <img className="on-shift__avatar" src={avatar} alt="" />
              <div>
                <p className="on-shift__name">{name}</p>
                <p className="on-shift__email">{email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default OnShiftNow;
