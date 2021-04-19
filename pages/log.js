import { useEffect, useRef, useState } from "react";
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

const Home = () => {
  const [modalIsOpen, setModalStatus] = useState(false);
  const [formState, updateFormState] = useState({});
  const [liftList, setLiftList] = useState([]);
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [addLog, { data }] = useMutation(ADD_LOG);

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
    await addLog({
      variables: {
        user: "test_user",
        log: {
          lift: formState.lift,
          notes: formState.notes,
          rating: Number(formState.rating),
          reps: Number(formState.reps),
          timestamp: `${new Date().getTime()}`,
          weight: Number(formState.weight),
        },
      },
    });
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
      <form onSubmit={handleSubmit}>
        <Label mt={5} htmlFor="lift-dropdown">
          What did ya do?
        </Label>
        <Select
          id="lift-dropdown"
          onChange={handleChange}
          options={options}
          isSearchable={true}
        />
        <button onClick={() => setModalStatus(true)}>
          Don't see what you're looking for? Add a new lift!
        </button>
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
            type="submit"
          >
            Add
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default Home;
