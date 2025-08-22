import React from "react";
import { useGetDashboardStatsQuery } from "../../services/apiSlice";

const LeaderboardView = () => {
  const { data, error, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error loading leaderboard.</p>;

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Total Donated</th>
          </tr>
        </thead>
        <tbody>
          {data?.leaderboard?.map((entry: any) => (
            <tr key={entry.userId}>
              <td>{entry.userName}</td>
              <td>${entry.totalDonated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardView;
