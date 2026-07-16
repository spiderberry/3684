import repository from './repository.js';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const athleteSet = new Set();

for (let i = 0; i < 4; i++) {
    let randomId = getRandomIntInclusive(1, 9);

    while (athleteSet.has(randomId)) {
        randomId = getRandomIntInclusive(1, 9);
    }

    athleteSet.add(randomId);
}
console.log('\n');

console.log(`Random Athletes` + '\n');
for (const i of athleteSet) {
    console.log(`Random Athlete: ${JSON.stringify(repository.athletesFindById(i))}`);
}
console.log('\n');


console.log(`Athlete Seasons`+ '\n');
for (const i of athleteSet) {
    console.log(`Athlete ${i}: ${JSON.stringify(repository.athleteSeasonsFindByAthleteId(i))}`);
    console.log(`Athlete ${i} 100m SB: ${JSON.stringify(repository.athleteSeasonsFindByAthleteIdAndYear(i, 2024).sb100m)}`);
}
console.log('\n');


let raceTime = 0;
for (const i of athleteSet) {
    console.log(`Athlete ${i} 100m SB: ${JSON.stringify(repository.athleteSeasonsFindByAthleteIdAndYear(i, 2024).sb100m)}`);
    raceTime += repository.athleteSeasonsFindByAthleteIdAndYear(i, 2024).sb100m;
}
console.log(`Race Time: ${raceTime}` + '\n');
raceTime -= Math.random() * (3.2 - 2.4) + 2.4

console.log(`Race Time(Adjusted): ${raceTime}` + '\n');