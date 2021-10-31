import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import Select from "react-select";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Box, Button, Heading, Text, Flex } from "rebass";
import { Label, Input, Textarea, Radio, Slider, Checkbox } from "@rebass/forms";
import Modal from "react-modal";
import NewLiftForm from "../components/NewLiftForm";

const GET_LIFTS = gql`
  query {
    getLifts {
      full_name
      id
    }
  }
`;

const ADD_LOG = gql`
  mutation addLog($user: String!, $log: LogInput, $existing_logs: [LogInput]) {
    addLog(user: $user, log: $log, existing_logs: $existing_logs) {
      lift
    }
  }
`;

const ADD_USER_LOG = gql`
  mutation addUserLog($uid: String!, $log: LogInput) {
    addUserLog(uid: $uid, log: $log) {
      lift
    }
  }
`;

const NewLogPage = () => {
  const { push } = useRouter();
  const [modalIsOpen, setModalStatus] = useState(false);
  const [formState, updateFormState] = useState({ rating: "3" });
  const [liftList, setLiftList] = useState([]);
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [addLog, { data }] = useMutation(ADD_LOG);
  const [addUserLog, { data: userLogData }] = useMutation(ADD_USER_LOG);

  useEffect(() => {
    if (liftsResp) {
      setLiftList(liftsResp.getLifts);
    }
  }, [liftsResp]);

  const handleChange = ({ value }) => {
    updateFormState({
      ...formState,
      lift: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUserLog({
      variables: {
        uid: sessionStorage.getItem("uid"),
        log: {
          lift: formState.lift,
          notes: formState.notes,
          rating: Number(formState.rating),
          reps: Number(formState.reps),
          timestamp: `${new Date(`${formState.date}`).getTime()}`,
          weight: Number(formState.weight),
        },
      },
    });
    push("/");
  };

  const options = liftList.map((lift) => ({
    label: lift.full_name,
    value: lift.id,
  }));

  return (
    <Box
      sx={{
        margin: [2, 4, 6],
      }}
    >
      <Heading fontSize={[4, 5, 6]} color="primary">
        Log a lift
      </Heading>
      <form>
        <Label mt={5} htmlFor="date">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          backgroundColor="white"
          placeholder="mm/dd/yyyy"
          onChange={(e) => {
            updateFormState({
              ...formState,
              date: e.target.value,
            });
          }}
          sx={{
            height: "2.25rem",
          }}
        />
        <p>{formState.date}</p>
        <Label mt={3} htmlFor="lift-dropdown">
          What did ya do?
        </Label>
        <Select
          id="lift-dropdown"
          onChange={handleChange}
          options={options}
          isSearchable={true}
        />
        <Modal
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          isOpen={modalIsOpen}
          onRequestClose={() => setModalStatus(false)}
          contentLabel="Example Modal"
        >
          <NewLiftForm setModalStatus={setModalStatus} />
        </Modal>
        <Label mt={3} htmlFor="reps">
          Reps
        </Label>
        <Input
          id="reps"
          name="reps"
          type="number"
          backgroundColor="white"
          onChange={(e) => {
            updateFormState({
              ...formState,
              reps: e.target.value,
            });
          }}
        />
        <Label mt={3} htmlFor="weight">
          Weight
        </Label>
        <Input
          id="weight"
          name="weight"
          backgroundColor="white"
          onChange={(e) => {
            updateFormState({
              ...formState,
              weight: e.target.value,
            });
          }}
        />
        <Label mt={3} htmlFor="rating">
          How'd it feel?
        </Label>
        <Slider
          defaultValue={3}
          id="rating"
          name="rating"
          max={5}
          onChange={(e) => {
            updateFormState({
              ...formState,
              rating: e.target.value,
            });
          }}
        />
        <Label mt={3} htmlFor="notes">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          backgroundColor="white"
          onChange={(e) => {
            updateFormState({
              ...formState,
              notes: e.target.value,
            });
          }}
        />
        <Flex justifyContent="flex-end">
          <Button
            mt={3}
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
            backgroundColor="black"
            color="white"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </Flex>
      </form>
      <Button
        mt={1}
        sx={{
          ":hover": {
            cursor: "pointer",
            textDecoration: "underline",
          },
        }}
        backgroundColor="transparent"
        color="black"
        onClick={() => setModalStatus(true)}
      >
        Don't see what you're looking for? Add a new lift!
      </Button>
    </Box>
  );
};

export default NewLogPage;
