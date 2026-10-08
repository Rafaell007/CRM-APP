import { useQuery } from "@tanstack/react-query";
import { tablesQuery } from "../../services/queries";

const TablesPage = () => {
  const { data: tables = [], isPending, error } = useQuery(tablesQuery);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Could not load the tables {error.message}</p>;
  return (
    <ul>
      {tables.map((table) => (
        <li key={table.id}>
          <p>
            Table nr {table.number}-{table.status} seats {table.seats}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default TablesPage;
