import { recordHook } from '@flatfile/plugin-record-hook';
import { blueprintSheets } from './blueprint';
import flatfile from '@flatfile/api';

export default function(listener) {

  // listener.on('space:created', (event) => {
  //   // why isn't this interacting with the event?
  //   const workbook = flatfile.workbooks.create({
  //     spaceId: event.context.spaceId,
  //     environmentId: event.context.environmentId,
  //     sheets: blueprintSheets
  //   })
  //   console.log('-> My event', JSON.stringify(workbook))
  // })

  // listener.use(
  //   recordHook('benefit-elections-sheet', (record) => {
  //     // if employeeId contains any non-numbers
  //     // then.. set benefitCoverageType to Retirement_Savings_Coverage_Type_Swedish
  //     record.compute('employeeId',() => 'Eric','Computed value')

  //     // if benefitPlan is not null
  //     // then.. set benefitCoverageType to Additional_Benefits_Coverage_Type_Fringe_Benefits
  //     record.computeIfPresent('employeeId',() => 'Eric','Computed if present value')

  //     // if coverageStartDate is after today
  //     // then.. set coverageStartDate to invalid
  //     record.validate('employeeId',() => false,'Validated value')

  //     return record
  //   })
  // )

  listener.use(
    recordHook('contacts', (record) => {
      // if employeeId contains any non-numbers
      // then.. set benefitCoverageType to Retirement_Savings_Coverage_Type_Swedish
      record.compute('first_name',() => 'Eric','Computed value')

      // if benefitPlan is not null
      // then.. set benefitCoverageType to Additional_Benefits_Coverage_Type_Fringe_Benefits
      record.computeIfPresent('first_name',() => 'Colin','Computed if present value')

      // if coverageStartDate is after today
      // then.. set coverageStartDate to invalid
      record.validate('first_name',() => false,'Validated value')

      return record
    })
  )

  // listener.on('action:triggered', async (event) => {
  //     const webhookReceiver = '<Webhook URL>';  
  //     // copy your https://webhook.site URL for testing
  //     const res = await fetch(webhookReceiver, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(event.payload)
  //     })
  // })

}
