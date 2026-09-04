import { useGetTablesQuery } from "../services/api";

const TablesPage = () => {
  const { data: tables, isLoading, error } = useGetTablesQuery();

  if (isLoading) return <p>Loading...</p>;
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
