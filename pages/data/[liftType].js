import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "rebass";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

const GET_USER = gql`
  query ($uid: String!) {
    getUser(uid: $uid) {
      logs {
        lift
        notes
        rating
        reps
        timestamp
        id
        weight
      }
    }
  }
`;

const DataPage = () => {
  const { query } = useRouter();
  const [getUser, { loading, data }] = useLazyQuery(GET_USER);
  const [userLogs, setUserLogs] = useState([]);

  useEffect(() => {
    getUser({ variables: { uid: sessionStorage.getItem("uid") } });
  }, []);

  useEffect(() => {
    if (data) {
      setUserLogs(data.getUser.logs || []);
    }
  }, [data]);

  const liftsOfType = userLogs.length
    ? userLogs.filter((log) => log.lift === query.liftType)
    : [];

  console.log("liftsOfType", liftsOfType);

  return (
    <Box backgroundColor="white" width="90%" height="300px">
      {liftsOfType.length && (
        <ResponsiveContainer width="100%">
          <LineChart
            width={350}
            height={270}
            data={liftsOfType}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis dataKey="weight" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#84edac"
              strokeWidth="2"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default DataPage;
