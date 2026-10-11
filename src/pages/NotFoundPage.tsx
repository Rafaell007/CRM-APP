import { Link } from "@tanstack/react-router";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-105 rounded-xl bg-surface p-6 text-center">
        <p className="text-7xl leading-none font-bold tracking-[-2px] text-muted">404</p>
        <h1 className="mt-4 mb-2 text-2xl font-bold">Sorry, this page does not exist</h1>
        <p className="mb-6 text-base text-muted">
          The address is wrong, or the page has been moved.
        </p>

        <Link
          className="inline-block rounded-md bg-ink px-5 py-3 text-base text-white hover:opacity-90"
          to="/admin"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
