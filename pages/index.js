import { useEffect, useState } from "react";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { Box, Flex, Text } from "rebass";
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

  return (
    <Box
      sx={{
        margin: [2, 4, 6],
      }}
      width="80%"
    >
      {!!userLogs.length &&
        !!liftList.length &&
        sortedLogs.map((userLog) => {
          const lift = liftList.find((lift) => lift.id === userLog.lift) || {};
          const date = new Date(Number(userLog.timestamp));
          const isPR =
            records[`${userLog.lift}-${userLog.reps}`] === userLog.weight;

          return (
            <Flex
              justifyContent="space-between"
              key={`${userLog.timestamp}-${lift.full_name}`}
              mt={3}
              p={2}
              sx={{
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: ".25rem",
                boxShadow:
                  "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
              }}
            >
              <Flex flexDirection="column">
                <Text>
                  <b>Date:</b>{" "}
                  {!isNaN(date) ? format(date, "iii, MM/dd/yyyy") : `${date}`}
                </Text>
                <Text>
                  <b>Lift:</b> {lift.full_name}
                </Text>
                <Text>
                  <b>Weight:</b> {userLog.weight}lbs
                </Text>
                <Text>
                  <b>Reps:</b> {userLog.reps}
                </Text>
                <Text>
                  <b>Rating:</b> {userLog.rating}/5
                </Text>
                <Text>
                  <b>Notes:</b> {userLog.notes}
                </Text>
                <Flex alignItems="center">
                  <Text fontWeight={isPR ? "bold" : ""}>
                    <b>{userLog.reps} RM:</b>{" "}
                    {records[`${userLog.lift}-${userLog.reps}`]}
                  </Text>
                  {isPR && <Text marginLeft="1">&#x1F44F;</Text>}
                </Flex>
              </Flex>
              <Flex flexDirection="column">
                <p>edit</p>
                <p>delete</p>
              </Flex>
            </Flex>
          );
        })}
    </Box>
  );
};

export default Home;
