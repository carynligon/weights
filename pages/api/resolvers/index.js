export const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await fetch(
          `${process.env.api_base}.firebaseio.com/users/.json`
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
          `${process.env.api_base}.firebaseio.com/logs/${args.uid}/.json`
        ).then((data) => data.json());
        const logs = Object.keys(user).map((key) => {
          return { ...user[key]["0"] };
        });
        return {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          logs: logs,
        };
      } catch (error) {
        throw error;
      }
    },
    getLifts: async () => {
      try {
        const lifts = await fetch(
          "${process.env.api_base}.firebaseio.com/lifts/.json"
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
          `${process.env.api_base}.firebaseio.com/users/${args.user}/.json`
        ).then((data) => data.json());
        const allLogs = [...user.logs, log];
        await fetch(
          `${process.env.api_base}.firebaseio.com/users/${args.user}/logs/.json`,
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
            `${process.env.api_base}.firebaseio.com/lifts/.json`
          ).then((data) => data.json())) || [];
        const id = full_name.toLowerCase().replace(/\s/g, "_");
        const allLifts = [...existingLifts, { full_name, id }];
        const newLift = await fetch(
          `${process.env.api_base}.firebaseio.com/lifts/.json`,
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
    addUserLog: async (_, args) => {
      const { uid, log } = args;
      try {
        const existingUserLogs =
          (await fetch(
            `${process.env.api_base}.firebaseio.com/logs/${uid}/.json`
          ).then((d) => {
            if (d && d.json) {
              d.json();
            }
          })) || [];
        const allLogs = [...existingUserLogs, { ...log }];
        if (existingUserLogs.length) {
          await fetch(
            `${process.env.api_base}.firebaseio.com/logs/${uid}/.json`,
            {
              method: "PUT",
              body: JSON.stringify([...existingUserLogs, { ...log }]),
            }
          ).then((d) => d.json());
          return allLogs;
        } else {
          const resp = await fetch(
            `${process.env.api_base}.firebaseio.com/logs/${uid}/.json`,
            {
              method: "POST",
              body: JSON.stringify([{ ...log }]),
            }
          ).then((d) => d.json());
          return allLogs;
        }
      } catch (e) {
        console.error("Error adding user log!", e);
      }
    },
  },
};
