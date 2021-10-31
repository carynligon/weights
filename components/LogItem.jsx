import Image from "next/image";
import deleteIcon from "../public/delete.svg";
import { Box, Button, Flex, Text } from "rebass";
import { useMutation, gql } from "@apollo/client";
import { format } from "date-fns";

const DELETE_USER_LOG = gql`
  mutation addUserLog($uid: String!, $id: String!) {
    deleteUserLog(uid: $uid, id: $id) {
      lift
    }
  }
`;

const LogItem = ({ userLog, lift, records }) => {
  const [deleteUserLog, { data: userLogData }] = useMutation(DELETE_USER_LOG);
  const date = new Date(Number(userLog.timestamp));
  const isPR = records[`${userLog.lift}-${userLog.reps}`] === userLog.weight;

  const deleteLog = async () => {
    const uid = sessionStorage.getItem("uid");
    await deleteUserLog({
      variables: {
        id: userLog.id,
        uid,
      },
    });
  };

  //   weights-be15c-default-rtdb.firebaseio.com/logs/I7xPKRzkuYe5aT3rogpByL3aOjf2/-Mb4NyEAgtlna05PIILf
  https: return (
    <Flex
      justifyContent="space-between"
      key={`${userLog.timestamp}-${lift.full_name}`}
      mt={3}
      p={2}
      sx={{
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: ".25rem",
        boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
      }}
    >
      <Flex flexDirection="column" maxWidth="85%">
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
        <Button
          mt={3}
          sx={{
            ":hover": {
              cursor: "pointer",
            },
            display: "flex",
            justifyContent: "center",
            width: "15px",
          }}
          color="black"
          onClick={deleteLog}
        >
          <span>X</span>
        </Button>
      </Flex>
    </Flex>
  );
};

export default LogItem;
