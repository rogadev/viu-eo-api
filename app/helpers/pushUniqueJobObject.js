/**
 *
 * @param {{noc:string,title:string}} job
 * @param {object[]} array
 * @returns {object[]}
 */
module.exports = (job, array) => {
  // Validate that both properties are defined.
  if (!job || !array) {
    throw new Error('pushUniqueJobObject() requires an item and an array.')
  }

  // Validate that the job object has the correct properties.
  if (!job.noc || !job.title) {
    throw new Error(
      'pushUniqueJobObject() requires a job object with "noc" and "title" properties.'
    )
  }

  // First, ensure that our array is, in fact, an array.
  if (!Array.isArray(array)) {
    throw new Error(
      `pushUniqueJobObject() expects an array as the second argument. Received: "${array}", of type: ${typeof array}`
    )
  }

  // If the array does not contain an object with the same noc and title properties, push this job object to the array.
  const arrayContainsJob = array.some(
    (item) => item.noc == job.noc && item.title == job.title
  )
  if (!arrayContainsJob) {
    array.push(job)
  }

  return array
}
