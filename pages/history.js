import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { Box, Button, Flex, Text } from "rebass";
import UserContext from "../contexts/user";
import LogItem from "../components/LogItem";
import styles from "../styles/History.module.scss";

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

const History = () => {
  const [getUser, { loading, data }] = useLazyQuery(GET_USER);
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [liftList, setLiftList] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const { back, push } = useRouter();

  const { uid } = useContext(UserContext);

  useEffect(() => {
    if (uid) {
      getUser({ variables: { uid } });
    }
  }, [uid]);

  console.log("???.", data);

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
      }}
    >
      <button className={styles.backBtn} onClick={() => back()}>
        Back
      </button>
      <p className={styles.selectorLabel}>View by lift:</p>
      <select className={styles.select} onChange={handleSelectChange}>
        <option disabled selected>
          Select a lift
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

export default History;
