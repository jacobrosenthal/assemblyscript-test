

import { Arrival, Planet } from "./schema";



// The entry file of your WebAssembly module.

export function one(): i32 {

  return (-4 * 417 * 44);
}

export function two(): f64 {

  return (Math.exp(-4 * 417 * 44));
}

export function three(): f64 {

  return (Math.exp((-4 * 417 * 44) / 100000));
}

export function four(): f64 {

  return (100000 / 102150 - 1 + 1);
}

export function five(): f64 {

  return (Math.exp((-4 * 417 * 44) / 100000) * (100000 / 102150 - 1) + 1);
}









// todo can I type these to not be null somehow?
function calculateSilverSpent(planet: Planet | null): i32 {
  let upgradeState: i32[] = [
    planet.upgradeState0,
    planet.upgradeState1,
    planet.upgradeState2,
  ];

  // todo hardcoded?
  let upgradeCosts: i32[] = [20, 40, 60, 80, 100];
  let totalUpgrades = 0;
  for (let i = 0; i < upgradeState.length; i++) {
    totalUpgrades += upgradeState[i];
  }
  let totalUpgradeCostPercent = 0;
  for (let i = 0; i < totalUpgrades; i++) {
    totalUpgradeCostPercent += upgradeCosts[i];
  }

  return (totalUpgradeCostPercent / 100) * planet.silverCap;
}


function hasOwner(planet: Planet | null): boolean {
  // planet.owner should never be null
  return planet.owner !== "0000000000000000000000000000000000000000";
};

function getSilverOverTime(
  planet: Planet | null,
  startTimeS: i32,
  endTimeS: i32
): i32 {

  if (!hasOwner(planet)) {
    return planet.silver;
  }

  if (planet.silver > planet.silverCap) {
    return planet.silverCap;
  }
  let timeElapsed = endTimeS - startTimeS;

  return Math.min(
    timeElapsed * planet.silverGrowth + planet.silver,
    planet.silverCap
  ) as i32;
}

function getEnergyAtTime(planet: Planet | null, atTimeS: i32): i32 {
  if (planet.population === 0) {
    return 0;
  }

  if (!hasOwner(planet)) {
    return planet.population;
  }

  let timeElapsed = atTimeS - planet.lastUpdated;

  let denominator = (Math.exp((-4 * planet.populationGrowth * timeElapsed) / planet.populationCap) *
    (planet.populationCap / planet.population - 1) + 1);
  return (planet.populationCap / denominator) as i32;
}

function updatePlanetToTime(planet: Planet | null, atTimeS: i32): Planet | null {
  // todo hardcoded game endtime 
  // let safeEndS = Math.min(atTimeS, 1609372800) as i32;
  // if (safeEndS < planet.lastUpdated) {
  //     // console.error('tried to update planet to a past time');
  //     return planet;
  // }
  planet.silver = getSilverOverTime(
    planet,
    planet.lastUpdated,
    atTimeS
  );
  planet.population = getEnergyAtTime(planet, atTimeS);
  planet.lastUpdated = atTimeS;
  return planet;
}

function arrive(toPlanet: Planet | null, arrival: Arrival | null): Planet | null {

  // update toPlanet energy and silver right before arrival
  toPlanet = updatePlanetToTime(toPlanet, arrival.arrivalTime);

  // apply energy
  let shipsMoved = arrival.popArriving;

  if (arrival.player !== toPlanet.owner) {
    // attacking enemy - includes emptyAddress

    if (toPlanet.population > Math.floor((shipsMoved * 100) / toPlanet.defense) as i32) {
      // attack reduces target planet's garrison but doesn't conquer it
      toPlanet.population -= Math.floor((shipsMoved * 100) / toPlanet.defense) as i32;
    } else {
      // conquers planet
      toPlanet.owner = arrival.player;
      toPlanet.population = shipsMoved - Math.floor((toPlanet.population * toPlanet.defense) / 100) as i32;
    }
  } else {
    // moving between my own planets
    toPlanet.population += shipsMoved;
  }

  // apply silver
  if (toPlanet.silver + arrival.silverMoved > toPlanet.silverCap) {
    toPlanet.silver = toPlanet.silverCap;
  } else {
    toPlanet.silver += arrival.silverMoved;
  }

  return toPlanet;
}