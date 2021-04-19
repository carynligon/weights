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
        return lifts.map((liftItem) => ({
          id: liftItem.id,
          full_name: liftItem.full_name,
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
    addLift: async (_, args) => {
      const { lift } = args;
      const { full_name } = lift;
      try {
        const existingLifts =
          (await fetch(
            `${config.api_base}.firebaseio.com/lifts/.json`
          ).then((data) => data.json())) || [];
        const id = full_name.toLowerCase().replace(/\s/g, "_");
        const allLifts = [...existingLifts, { full_name, id }];
        const newLift = await fetch(
          `${config.api_base}.firebaseio.com/lifts/.json`,
          {
            method: "PUT",
            body: JSON.stringify(allLifts),
          }
        ).then((data) => data.json());
        return allLifts;
      } catch (error) {
        throw error;
      }
    },
  },
};
