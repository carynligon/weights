import config from "../../../.env/local.json";

export const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await fetch(
          `${config.api_base}.firebaseio.com/users/.json`
        ).then((data) => data.json());
        return Object.values(users).map(
          ({ username, first_name, last_name, logs }) => ({
            username,
            first_name,
            last_name,
            logs,
          })
        );
      } catch (error) {
        throw error;
      }
    },
    getUser: async (_, args) => {
      try {
        const user = await fetch(
          `${config.api_base}.firebaseio.com/users/${args.username}/.json`
        ).then((data) => data.json());
        return {
          username: user.username,
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
          id: lift_key,
          full_name: lifts[lift_key].full_name,
          lift_sub_type: lifts[lift_key].lift_sub_type,
          lift_type: lifts[lift_key].lift_type,
        }));
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    addLog: async (_, args) => {
      const { log } = args;
      try {
        const user = await fetch(
          `${config.api_base}.firebaseio.com/users/${args.user}/.json`
        ).then((data) => data.json());
        const allLogs = [...user.logs, log];
        await fetch(
          `${config.api_base}.firebaseio.com/users/${args.user}/logs/.json`,
          {
            method: "PUT",
            body: JSON.stringify(allLogs),
          }
        ).then((data) => data.json());
        return allLogs;
      } catch (error) {
        throw error;
      }
    },
  },
};
