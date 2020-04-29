import * as hexTypes from './HexTypes';

// prettier-ignore
export var tileList: hexTypes.TileList = {
  // 18EU tiles
  "3": {color: "yellow", stop: {revenue: 10}, connections: [[3,-1],[4,-1]]},
  "4": {color: "yellow", stop: {revenue: 10}, connections: [[0,-1],[3,-1]]},
  "7": {color: "yellow", connections: [[2,4]]},
  "8": {color: "yellow", connections: [[1,4]]},
  "9": {color: "yellow", connections: [[0,4]]},
  "14": {color: "green", stop: {tokens: 2, revenue: 30}, connections: [[0,-1],[2,-1],[3,-1],[5,-1]]},
  "15": {color: "green", stop: {tokens: 2, revenue: 30}, connections: [[0,-1],[3,-1],[4,-1],[5,-1]]},
  "57": {color: "yellow", stop: {tokens: 1, revenue: 20}, connections: [[0,-1],[-1,3]]},
  "58": {color: "yellow", stop: {revenue: 10}, connections: [[1,-1],[-1,3]]},
  "80": {color: "green", connections: [[2,6],[3,6],[4,6]]},
  "81": {color: "green", connections: [[0,6],[2,6],[4,6]]},
  "82": {color: "green", connections: [[1,6],[2,6],[4,6]]},
  "83": {color: "green", connections: [[1,6],[3,6],[4,6]]},
  "141": {color: "green", stop: {revenue: 10}, connections: [[0,-1],[1,-1],[3,-1]]},
  "142": {color: "green", stop: {revenue: 10}, connections: [[0,-1],[3,-1],[5,-1]]},
  "143": {color: "green", stop: {revenue: 10}, connections: [[0,-1],[1,-1],[5,-1]]},
  "144": {color: "green", stop: {revenue: 10}, connections: [[1,-1],[3,-1],[5,-1]]},
  "145": {color: "brown", stop: {revenue: 20}, connections: [[0,-1],[1,-1],[3,-1],[4,-1]]},
  "146": {color: "brown", stop: {revenue: 20}, connections: [[0,-1],[1,-1],[2,-1],[3,-1]]},
  "147": {color: "brown", stop: {revenue: 20}, connections: [[0,-1],[1,-1],[3,-1],[5,-1]]},
  "201": {color: "yellow", letters: "Y", stop: {tokens: 1, revenue: 30}, connections: [[2,-1],[3,-1]]},
  "202": {color: "yellow", letters: "Y", stop: {tokens: 1, revenue: 30}, connections: [[1,-1],[3,-1]]},
  "513": {color: "grey", stop: {tokens: 3, revenue: 60}, connections: [[0,-1],[1,-1],[2,-1],[3,-1],[4,-1],[5,-1]]},
  "544": {color: "brown", connections: [[0,6],[1,6],[3,6],[4,6]]},
  "545": {color: "brown", connections: [[0,6],[3,6],[4,6],[5,6]]},
  "546": {color: "brown", connections: [[0,6],[1,6],[3,6],[5,6]]},
  "576": {color: "green", letters: "Y", stop: {tokens: 1, revenue: 40}, connections: [[0,-1],[1,-1],[3,-1]]},
  "577": {color: "green", letters: "Y", stop: {tokens: 1, revenue: 40}, connections: [[0,-1],[3,-1],[5,-1]]},
  "578": {color: "green", letters: "Y", stop: {tokens: 1, revenue: 40}, connections: [[3,-1],[4,-1],[5,-1]]},
  "579": {color: "green", letters: "Y", stop: {tokens: 1, revenue: 40}, connections: [[1,-1],[3,-1],[5,-1]]},
  "580": {color: "green", letters: "P", stops: [{tokens: 1, revenue: 60}, {tokens: 1, revenue: 60}], connections: [[0,-1],[1,-1],[2,-2],[3,-2]]},
  "581": {color: "green", letters: "B-V", stops: [{tokens: 1, revenue: 50}, {tokens: 1, revenue: 50}, {tokens: 1, revenue: 50}], connections: [[0,-1],[1,-2],[2,-2],[3,-3],[4,-3],[5,-1]]},
  "582": {color: "brown", letters: "Y", stop: {tokens: 2, revenue: 50}, connections: [[0,-1],[1,-1],[3,-1],[5,-1]]},
  "583": {color: "brown", letters: "P", stops: [{tokens: 2, revenue: 80}, {tokens: 2, revenue: 80}], connections: [[0,-1],[1,-1],[2,-2],[3,-2]]},
  "584": {color: "brown", letters: "B-V", stop: {tokens: 3, revenue: 60}, connections: [[0,-1],[1,-1],[2,-1],[3,-1],[4,-1],[5,-1]]},
  "611": {color: "brown", stop: {tokens: 2, revenue: 40}, connections: [[0,-1],[1,-1],[3,-1],[4,-1],[5,-1]]},

  // non-18EU tiles
  "1": {color: "yellow", stops: [{revenue: 10},{revenue: 10}], connections: [[0,-1],[4,-1],[1,-2],[3,-2]]},
  "2": {color: "yellow", stops: [{revenue: 10},{revenue: 10}], connections: [[0,-1],[3,-1],[1,-2],[2,-2]]},
  "5": {color: "yellow", stop: {tokens: 1, revenue: 20}, connections: [[2,-1],[3,-1]]},
  "6": {color: "yellow", stop: {tokens: 1, revenue: 20}, connections: [[1,-1],[3,-1]]},
  "10": {color: "green", stops: [{tokens: 1, revenue: 30},{tokens: 1, revenue: 30}], connections: [[0,-1],[3,-2]]},
  "11": {color: "green", stop: {revenue: 10, variation: "halt"}, connections: [[1,-1],[5,-1],[5,3],[3,1]]},
  "12": {color: "green", stop: {tokens: 1, revenue: 30}, connections: [[2,-1],[3,-1],[4,-1]]},
  "13": {color: "green", stop: {tokens: 1, revenue: 30}, connections: [[1,-1],[3,-1],[5,-1]]},
  "16": {color: "green", connections: [[1,3],[2,4]]},
  "17": {color: "green", connections: [[0,4],[1,3]]},
  "18": {color: "green", connections: [[0,3],[4,5]]},
  "19": {color: "green", connections: [[0,3],[2,4]]},
  "20": {color: "green", connections: [[0,3],[1,4]]},

  // 18MEX
  // Mexico City double-tile
  "485": [
    [[],0,{color: "brown", stops: [{revenue: 10, name: "Toluca"}, {tokens:3, revenue: 60, name: "Mexico City", tokenLabels: ["NdM"]}], connections: [[0,-1],[1,-2],[3,-2],[4,-2],[5,-2],[-1,-2]]}],
    [[3],0,{color: "brown", stop: {revenue: 10, name: "Puebla"}, connections: [[0,2],[0,-1],[3,-1]]}],
  ],
  "486": [
    [[],0,{color: "brown", stops: [{revenue: 10, name: "Toluca"}, {tokens:4, revenue: 50, name: "Mexico City", tokenLabels: ["NdM"]}], connections: [[0,-1],[1,-2],[3,-2],[4,-2],[5,-2],[-1,-2]]}],
    [[3],0,{color: "brown", stop: {revenue: 10, name: "Puebla"}, connections: [[0,2],[0,-1],[3,-1]]}],
  ],
}
