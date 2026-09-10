export const records = new Map();
export function createClient() {
  return {
    getDocument: async (id) => records.get(id),
    fetch: async () => 0,
    createIfNotExists: async (doc) => {
      if (!records.has(doc._id)) records.set(doc._id, { ...doc });
    },
    patch: (id) => ({
      set: (fields) => ({
        commit: async () => records.set(id, { ...records.get(id), ...fields }),
      }),
    }),
  };
}
