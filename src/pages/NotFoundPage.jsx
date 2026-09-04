import { Link } from "react-router";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Sorry, this page does not exist</h1>
        <p className="not-found__text">
          The address is wrong, or the page has been moved.
        </p>

        {/* Link, not a button — it is navigation, so it should be a real anchor */}
        <Link className="not-found__button" to="/admin">
          Back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
