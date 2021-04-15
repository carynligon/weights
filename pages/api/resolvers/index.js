export const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await fetch(
          "https://weights-be15c-default-rtdb.firebaseio.com/users/.json"
        ).then((data) => data.json());
        return Object.values(users).map(({ first_name, last_name, logs }) => ({
          first_name,
          last_name,
          logs,
        }));
      } catch (error) {
        throw error;
      }
    },
    getUser: async (_, args) => {
      try {
        const user = await fetch(
          `https://weights-be15c-default-rtdb.firebaseio.com/users/${args.name}/.json`
        ).then((data) => data.json());
        return {
          first_name: user.first_name,
          last_name: user.last_name,
          logs: user.logs,
        };
      } catch (error) {
        throw error;
      }
    },
    getLifts: async () => {
      try {
        const lifts = await fetch(
          "https://weights-be15c-default-rtdb.firebaseio.com/lifts/.json"
        ).then((data) => data.json());
        return Object.keys(lifts).map((lift_key) => ({
          full_name: lifts[lift_key].full_name,
          lift_sub_type: lifts[lift_key].lift_sub_type,
          lift_type: lifts[lift_key].lift_type,
        }));
      } catch (error) {
        throw error;
      }
    },
  },
};
