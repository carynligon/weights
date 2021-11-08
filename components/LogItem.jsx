import Image from "next/image";
import deleteIcon from "../public/delete.svg";
import { Box, Button, Flex, Text } from "rebass";
import { useMutation, gql } from "@apollo/client";
import { format } from "date-fns";
import styles from "../styles/LogItem.module.scss";

const DELETE_USER_LOG = gql`
  mutation addUserLog($uid: String!, $id: String!) {
    deleteUserLog(uid: $uid, id: $id) {
      lift
    }
  }
`;

const days = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

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

  const unformattedDate = date;
  const updatedDate = new Date(unformattedDate);
  updatedDate.setDate(updatedDate.getDate() - 1);

  //   weights-be15c-default-rtdb.firebaseio.com/logs/I7xPKRzkuYe5aT3rogpByL3aOjf2/-Mb4NyEAgtlna05PIILf
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <span>{updatedDate.getDate()}</span>
        <span className={styles.day}>{days[updatedDate.getDay()]}</span>
      </div>
      <div className={styles.data}>
        <p className={styles.lift}>{lift.full_name}</p>
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
      </div>
    </div>
  );
};

export default LogItem;
