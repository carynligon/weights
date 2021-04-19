import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Box, Text } from "rebass";
import { format } from "date-fns";

const GET_USER = gql`
  query($username: String!) {
    getUser(username: $username) {
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
  const { data } = useQuery(GET_USER, {
    variables: { username: "test_user" },
  });
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [liftList, setLiftList] = useState([]);
  const [userLogs, setUserLogs] = useState([]);

  useEffect(() => {
    if (data) {
      setUserLogs(data.getUser.logs);
    }
  }, [data]);

  useEffect(() => {
    if (liftsResp) {
      setLiftList(liftsResp.getLifts);
    }
  }, [liftsResp]);

  return (
    <Box
      sx={{
        margin: [2, 4, 6],
      }}
    >
      {!!userLogs.length &&
        !!liftList.length &&
        userLogs.map((userLog) => {
          if (!userLog) return null;
          const lift = liftList.find((lift) => lift.id === userLog.lift);
          const date = new Date(Number(userLog.timestamp));
          return (
            <Box mt={3} p={2} sx={{ border: "1px solid black" }}>
              <Text>
                <b>Date:</b> {format(date, "MM/dd/yyyy h:mm a")}
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
            </Box>
          );
        })}
    </Box>
  );
};

export default Home;
