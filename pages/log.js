import { useEffect, useState } from "react";
import Select from "react-select";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Box, Flex } from "rebass";
import { Label, Input, Textarea, Radio, Slider, Checkbox } from "@rebass/forms";

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
  const [liftList, setLiftList] = useState([]);
  const { data: liftsResp } = useQuery(GET_LIFTS);
  const [addLog, { data }] = useMutation(ADD_LOG);

  useEffect(() => {
    if (liftsResp) {
      setLiftList(liftsResp.getLifts);
    }
  }, [liftsResp]);

  const handleChange = async ({ value }) => {
    await addLog({
      variables: {
        user: "test_user",
        log: {
          lift: value,
          notes: "fine",
          rating: 4,
          reps: 3,
          timestamp: `${new Date().getTime()}`,
          weight: 120,
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
      <Label htmlFor="lift-dropdown">What did ya do?</Label>
      <Select
        id="lift-dropdown"
        onChange={handleChange}
        options={options}
        isSearchable={true}
      />
      <Label mt={3} htmlFor="reps">
        Reps
      </Label>
      <Input id="reps" name="reps" defaultValue="3" />

      <Label mt={3} htmlFor="weight">
        Weight
      </Label>
      <Input id="weight" name="weight" defaultValue="150" />

      <Label mt={3} htmlFor="rating">
        How'd it feel?
      </Label>
      <Slider id="rating" name="rating" defaultValue="3" />

      <Label mt={3} htmlFor="notes">
        Notes
      </Label>
      <Textarea id="notes" name="notes" />
    </Box>
  );
};

export default Home;
