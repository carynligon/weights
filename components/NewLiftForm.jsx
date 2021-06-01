import { useState } from "react";
import { useRouter } from "next/router";
import { Flex, Button } from "rebass";
import { Label, Input, Textarea, Radio, Slider, Checkbox } from "@rebass/forms";
import { useMutation, gql } from "@apollo/client";

const ADD_LIFT = gql`
  mutation addLift($lift: LiftInput!) {
    addLift(lift: $lift) {
      full_name
    }
  }
`;

const NewLiftForm = ({ setModalStatus }) => {
  const { push } = useRouter();
  const [liftName, updateLiftName] = useState("");
  const [addLift, { data }] = useMutation(ADD_LIFT);

  const handleNewLiftSubmit = (e) => {
    e.preventDefault();
    addLift({ variables: { lift: { full_name: liftName } } });
    setModalStatus(false);
    push("/log");
  };

  return (
    <>
      <Label mt={3} htmlFor="lift_name">
        Lift name
      </Label>
      <Input
        id="lift_name"
        name="lift_name"
        type="text"
        onChange={(e) => {
          updateLiftName(e.target.value);
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
          onClick={handleNewLiftSubmit}
        >
          Add
        </Button>
      </Flex>
    </>
  );
};

export default NewLiftForm;
