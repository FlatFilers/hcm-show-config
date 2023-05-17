import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RR from 'fp-ts/ReadonlyRecord';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as D from 'io-ts/Decoder';

/**
 * Calculates the unique records and builds up a list of ids to be removed.
 *
 * @param records - Inbound records from the FF API response
 * @returns A list of record ids to be removed
 */
export const dedupeEmployees = (records) => {
  let uniques = {}; // Dictionary to store unique records
  let removeThese = []; // Array to store record IDs to be removed

  pipe(
    records,
    RA.map((record) => {
      const decodedValue = D.string.decode(record.values.employeeId.value); // Decode the employeeId value using io-ts Decoder

      return pipe(
        decodedValue,
        E.fold(
          (decodingErrors) => {
            console.log('Decoding error:', decodingErrors);
            // Handle decoding error if necessary
          },
          (employeeId) => {
            console.log('Valid employeeId:', employeeId);
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
    })
  );

  return removeThese; // Return the list of record IDs to be removed
};
