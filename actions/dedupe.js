export const dedupeEmployees = (records) => {
  const uniques = {}; // Object to store unique records based on employeeId
  const removeThese = []; // Array to store record IDs to be removed

  for (const record of records) {
    const employeeId = record.values.employeeId.value; // Get the employeeId value from the record

    return pipe(
      decodedValue,
      E.fold(
        (decodingErrors) => {
          console.log('Decoding error:', decodingErrors);
          // Handle decoding error if necessary
        },
        (employeeId) => {
          pipe(
            RR.lookup(employeeId)(uniques), // Looks up the key in the dictionary
            O.match(
              () => {
                uniques = RR.upsertAt(employeeId, record)(uniques); // Adds the record to the dictionary if the key is not found
              },
              (latestRecord) => {
                if (
                  record.values.hireDate.value >
                  latestRecord.values.hireDate.value
                ) {
                  removeThese = RA.append(latestRecord.id)(removeThese); // Appends the ID of the existing record to the removal list
                  uniques = RR.upsertAt(employeeId, record)(uniques); // Updates the dictionary with the new record
                } else {
                  removeThese = RA.append(record.id)(removeThese); // Appends the ID of the current record to the removal list
                }
              }
            )
          );
        }
      )
    );
  }

  return removeThese; // Return the list of record IDs to be removed
};
