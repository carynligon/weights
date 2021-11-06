import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import Select from "react-select";
import { useMutation, useQuery, gql, operationName } from "@apollo/client";
import { Box, Button, Heading, Text, Flex } from "rebass";
import Modal from "react-modal";
import { Label, Input, Textarea, Radio, Slider, Checkbox } from "@rebass/forms";
import styles from "../styles/Form.module.scss";
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
      <h2>Log</h2>
      <form>
        <Label sx={{ marginTop: [2, 4, 6] }} htmlFor="date">
          Date:
        </Label>
        <input
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
          className={styles.input}
        />
        <p>{formState.date}</p>
        <Label mt={3} mb={1} htmlFor="lift-dropdown">
          Type of lift:
        </Label>
        <select
          id="lift-dropdown"
          onChange={handleChange}
          options={options}
          isSearchable={true}
          className={styles.input}
        >
          <option disabled>Select</option>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <Label mt={3} mb={1} htmlFor="reps">
          Reps:
        </Label>
        <input
          id="reps"
          name="reps"
          type="tel"
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              updateFormState({
                ...formState,
                reps: e.target.value,
              });
            }
          }}
          placeholder="#"
          className={styles.input}
          value={formState.reps}
        />
        <Label mt={3} mb={1} htmlFor="weight">
          Weight:
        </Label>
        <input
          id="weight"
          name="weight"
          type="tel"
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              updateFormState({
                ...formState,
                weight: e.target.value,
              });
            }
          }}
          placeholder="#"
          className={styles.input}
          value={formState.weight}
        />
        <Label mt={3} mb={1} htmlFor="rating">
          How it went:
        </Label>
        <form id="rating">
          <div>
            <input id="rating-terrible" type="radio" value={1} />
            <label for="rating-terrible">Terrible</label>
          </div>
          <div>
            <input id="rating-pretty-bad" type="radio" value={2} />
            <label for="rating-pretty-bad">Pretty bad</label>
          </div>
          <div>
            <input id="rating-ok" type="radio" value={3} />
            <label for="rating-ok">Ok</label>
          </div>
          <div>
            <input id="rating-pretty-good" type="radio" value={4} />
            <label for="rating-pretty-good">Pretty good</label>
          </div>
          <div>
            <input id="rating-great" type="radio" value={5} />
            <label for="rating-great">Great</label>
          </div>
        </form>
        <Label mt={3} mb={1} htmlFor="notes">
          Notes:
        </Label>
        <textarea
          id="notes"
          name="notes"
          onChange={(e) => {
            updateFormState({
              ...formState,
              notes: e.target.value,
            });
          }}
          className={styles.input}
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
        <div className={styles.buttonContainer}>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
      <button
        className={styles.newLiftButton}
        onClick={() => setModalStatus(true)}
      >
        Don't see what you're looking for? Add a new lift!
      </button>
    </Box>
  );
};

export default NewLogPage;
