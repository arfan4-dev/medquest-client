import toast from "react-hot-toast";

/**
 * Distributes questions across subjects and cities based on availability
 * @param {Array} selectedSubjects - Array of selected subjects with their cities
 * @param {Array} availableSubjects - Array of subjects with their available questions per city
 * @param {number} totalQuestions - Total number of questions to distribute
 * @returns {Array} Distributed questions in format [{name, city, totalQuestions}]
 */
// export function distributeQuestions(
//   selectedSubjects,
//   availableSubjects,
//   totalQuestions
// ) {
//   const availabilityMap = {};
//   availableSubjects.forEach((subject) => {
//     availabilityMap[subject.subjectName] = {};
//     subject.schools.forEach((school) => {
//       availabilityMap[subject.subjectName][school.school] = school.count;
//     });
//   });

//   let totalAvailable = 0;
//   const subjectAvailability = [];

//   selectedSubjects.forEach((subject) => {
//     subject.city.forEach((city) => {
//       const available = availabilityMap[subject.name]?.[city] || 0;
//       subjectAvailability.push({
//         name: subject.name,
//         city: city,
//         available: available,
//       });
//       totalAvailable += available;
//     });
//   });

//   if (totalQuestions > totalAvailable) {
//     toast.error(
//       `Requested ${totalQuestions} questions, but only ${totalAvailable} are available.`
//     );
//     return [];
//   }

//   const questionsToDistribute = Math.min(totalQuestions, totalAvailable);

//   const distribution = subjectAvailability.map((item) => {
//     const ratio = item.available / totalAvailable;
//     let questions = Math.round(questionsToDistribute * ratio);
//     return {
//       name: item.name,
//       city: item.city,
//       totalQuestions: questions,
//     };
//   });

//   let distributedSum = distribution.reduce(
//     (sum, item) => sum + item.totalQuestions,
//     0
//   );
//   let remaining = questionsToDistribute - distributedSum;

//   if (remaining > 0) {
//     distribution.sort((a, b) => {
//       const availableA = availabilityMap[a.name]?.[a.city] || 0;
//       const availableB = availabilityMap[b.name]?.[b.city] || 0;
//       return availableB - availableA;
//     });

//     distribution.forEach((item) => {
//       if (remaining > 0) {
//         const available = availabilityMap[item.name]?.[item.city] || 0;
//         if (item.totalQuestions < available) {
//           item.totalQuestions++;
//           remaining--;
//         }
//       }
//     });
//   }

//   distribution.forEach((item) => {
//     if (
//       item.totalQuestions === 0 &&
//       availabilityMap[item.name]?.[item.city] > 0
//     ) {
//       item.totalQuestions = 1;
//     }
//   });

//   let finalDistributedSum = distribution.reduce(
//     (sum, item) => sum + item.totalQuestions,
//     0
//   );
//   let finalRemaining = questionsToDistribute - finalDistributedSum;

//   if (finalRemaining > 0) {
//     distribution.sort((a, b) => {
//       const availableA = availabilityMap[a.name]?.[a.city] || 0;
//       const availableB = availabilityMap[b.name]?.[b.city] || 0;
//       return availableB - availableA;
//     });

//     distribution.forEach((item) => {
//       if (finalRemaining > 0) {
//         const available = availabilityMap[item.name]?.[item.city] || 0;
//         if (item.totalQuestions < available) {
//           item.totalQuestions++;
//           finalRemaining--;
//         }
//       }
//     });
//   }

//   return distribution;
// }

export function distributeQuestions(
  selectedSubjects,
  availableSubjects,
  totalQuestions
) {
  const availabilityMap = {};
  availableSubjects.forEach((subject) => {
    availabilityMap[subject.subjectName] = {};
    subject.schools.forEach((school) => {
      availabilityMap[subject.subjectName][school.school] = school.count;
    });
  });

  let totalAvailable = 0;
  const subjectAvailability = [];

  selectedSubjects.forEach((subject) => {
    subject.city.forEach((city) => {
      const available = availabilityMap[subject.name]?.[city] || 0;
      subjectAvailability.push({
        name: subject.name,
        city: city,
        available: available,
      });
      totalAvailable += available;
    });
  });

  if (totalQuestions > totalAvailable) {
    toast.error(
      `Requested ${totalQuestions} questions, but only ${totalAvailable} are available.`
    );
    return [];
  }

  const questionsToDistribute = Math.min(totalQuestions, totalAvailable);

  // First round of distribution
  let distributedQuestions = 0;
  const distribution = subjectAvailability.map((item) => {
    const ratio = item.available / totalAvailable;
    let questions = Math.floor(questionsToDistribute * ratio); // Use Math.floor to avoid overshooting
    distributedQuestions += questions;

    return {
      name: item.name,
      city: item.city,
      totalQuestions: questions,
    };
  });

  let remainingQuestions = questionsToDistribute - distributedQuestions;

  // Second pass to adjust the distribution for any remaining questions
  if (remainingQuestions > 0) {
    // Sort the distribution by availability to prioritize the subjects with the most availability
    distribution.sort((a, b) => {
      const availableA = availabilityMap[a.name]?.[a.city] || 0;
      const availableB = availabilityMap[b.name]?.[b.city] || 0;
      return availableB - availableA;
    });

    distribution.forEach((item) => {
      if (remainingQuestions > 0) {
        const available = availabilityMap[item.name]?.[item.city] || 0;
        if (item.totalQuestions < available) {
          item.totalQuestions++;
          remainingQuestions--;
        }
      }
    });
  }

  // Ensure no city has 0 questions if it has availability
  distribution.forEach((item) => {
    if (
      item.totalQuestions === 0 &&
      availabilityMap[item.name]?.[item.city] > 0
    ) {
      item.totalQuestions = 1;
    }
  });

  // Double-check that we don't exceed totalQuestions
  let finalDistributedSum = distribution.reduce(
    (sum, item) => sum + item.totalQuestions,
    0
  );

  // Adjust if the sum exceeds the total requested questions
  if (finalDistributedSum > totalQuestions) {
    let excess = finalDistributedSum - totalQuestions;
    distribution.sort((a, b) => {
      const availableA = availabilityMap[a.name]?.[a.city] || 0;
      const availableB = availabilityMap[b.name]?.[b.city] || 0;
      return availableB - availableA;
    });

    // Reduce the questions from the cities with the highest availability
    for (let i = 0; i < distribution.length && excess > 0; i++) {
      if (distribution[i].totalQuestions > 0) {
        distribution[i].totalQuestions--;
        excess--;
      }
    }
  }

  return distribution;
}

const selectedSubjects = [
  [
    {
      name: "Anatomie 1",
      city: ["Rabat", "Casablanca"],
    },
    {
      name: "Communication et Langues",
      city: ["Rabat"],
    },
    {
      name: "Histologie / Embryologie I",
      city: ["Rabat"],
    },
    {
      name: "Anatomie 2",
      city: ["Rabat"],
    },
    {
      name: "Histoire de la Médecine / Psycho-Sociologie",
      city: ["Rabat"],
    },
  ],
];

const availableSubjects = [
  {
    subjectName: "Anatomie 1",
    totalQuestions: 49,
    schools: [
      {
        school: "Rabat",
        count: 9,
      },
      {
        school: "Casablanca",
        count: 40,
      },
    ],
  },
  {
    subjectName: "Communication et Langues",
    totalQuestions: 43,
    schools: [
      {
        school: "Rabat",
        count: 43,
      },
    ],
  },
  {
    subjectName: "Histologie / Embryologie I",
    totalQuestions: 15,
    schools: [
      {
        school: "Rabat",
        count: 15,
      },
    ],
  },
  {
    subjectName: "Anatomie 2",
    totalQuestions: 12,
    schools: [
      {
        school: "Rabat",
        count: 12,
      },
    ],
  },
  {
    subjectName: "Histoire de la Médecine / Psycho-Sociologie",
    totalQuestions: 53,
    schools: [
      {
        school: "Rabat",
        count: 53,
      },
    ],
  },
];

const totalQuestions = 10;

export default distributeQuestions;
