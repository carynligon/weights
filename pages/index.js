import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { Box, Button, Flex, Text } from "rebass";
import LogItem from "../components/LogItem";
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

const Home = () => {
  // const { data } = useQuery(GET_USER, {
  //   variables: { uid: sessionStorage.getItem("uid") },
  // });
  const [getUser, { loading, data }] = useLazyQuery(GET_USER);
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [liftList, setLiftList] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const { push } = useRouter();

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

  const records = userLogs.reduce((acc, val) => {
    if (acc[`${val.lift}-${val.reps}`]) {
      if (acc[`${val.lift}-${val.reps}`] < val.weight) {
        acc[`${val.lift}-${val.reps}`] = val.weight;
      }
    } else {
      acc[`${val.lift}-${val.reps}`] = val.weight;
    }
    return acc;
  }, {});

  const sortedLogs = [...userLogs];
  sortedLogs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  const handleSelectChange = (e) => {
    push(`/data/${e.target.value}`);
  };

  return (
    <Box
      sx={{
        margin: [2, 4, 6],
        "@media screen and (max-width: 767px)": {
          width: "90%",
        },
        width: "80%",
      }}
    >
      <p>View by lift:</p>
      <select onChange={handleSelectChange}>
        <option disabled selected>
          {""}
        </option>
        {liftList.map((lift) => (
          <option value={lift.id}>{lift.full_name}</option>
        ))}
      </select>
      {!!userLogs.length &&
        !!liftList.length &&
        sortedLogs.map((userLog) => {
          const lift = liftList.find((lift) => lift.id === userLog.lift) || {};

          return <LogItem userLog={userLog} lift={lift} records={records} />;
        })}
    </Box>
  );
};

export default Home;
