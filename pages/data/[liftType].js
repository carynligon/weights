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
import { format } from "date-fns";

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

const GET_LIFTS = gql`
  query {
    getLifts {
      full_name
      id
    }
  }
`;

const DataPage = () => {
  const { query } = useRouter();
  const [getUser, { loading, data }] = useLazyQuery(GET_USER);
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [userLogs, setUserLogs] = useState([]);
  const [liftList, setLiftList] = useState([]);

  const liftObj = liftList.find((lift) => lift.id === query.liftType);

  console.log("liftObj", liftObj);

  useEffect(() => {
    getUser({ variables: { uid: sessionStorage.getItem("uid") } });
  }, []);

  useEffect(() => {
    if (data) {
      setUserLogs(data.getUser.logs || []);
    }
  }, [data]);

  useEffect(() => {
    if (liftsResp) {
      setLiftList(liftsResp.getLifts);
    }
  }, [liftsResp]);

  const liftsOfType = userLogs.length
    ? userLogs.filter((log) => log.lift === query.liftType)
    : [];

  const repMaxes = liftsOfType.reduce((acc, val) => {
    if (acc[val.reps]) {
      if (acc[val.reps].weight < val.weight) {
        acc[val.reps] = val;
      }
    } else {
      acc[val.reps] = val;
    }
    return acc;
  }, {});

  return (
    <Box backgroundColor="white" width="90%" height="300px">
      <h2>{(liftObj || {}).full_name}</h2>
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
      <h3>Rep maxes:</h3>
      {Object.entries(repMaxes).map(([repCount, userLog]) => {
        console.log("??", userLog);
        const date = new Date(Number(userLog.timestamp));
        return (
          <div>
            <span>
              {repCount} rep{Number(repCount) > 1 ? "s" : ""}:{" "}
            </span>
            <span>{userLog.weight}lbs</span>
            <span>
              {" "}
              ({!isNaN(date) ? format(date, "MM/dd/yyyy") : `${date}`})
            </span>
          </div>
        );
      })}
    </Box>
  );
};

export default DataPage;
