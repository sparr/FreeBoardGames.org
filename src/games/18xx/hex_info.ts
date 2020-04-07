import * as hexes from './hexes';

// prettier-ignore
export var mapHexList: hexes.MapHexList = {
  // generic map
  "map_lightgreen": {color: "light green"},
  "map_darkgreen": {color: "dark green"},
  "map_lightblue": {color: "light blue"},

  // 18EU map
  // red off map locations
  "18eu_Hamburg": {color: "red", name: "Hamburg", revenues: [30,50], connections: [[2,3],[2,4],[3,4]]},
  "18eu_Warsaw": {color: "red", name: "Warsaw", revenues: [20,30], offboardConnections: [4]},
  "18eu_London": {color: "red", name: "London", revenues: [40,70], offboardConnections: [2,3]},
  "18eu_Bucharest": {color: "red", name: "Bucharest", revenues: [30,50], offboardConnections: [5]},
  "18eu_Rome": {color: "red", name: "Rome", revenues: [30,50], offboardConnections: [0,1,5]},
  // blue off map locations
  "18eu_port_south": {color: "dark blue", icon: "anchor", revenue: 10, offboardConnections: [3]},
  "18eu_port_north": {color: "dark blue", icon: "anchor", revenue: 10, offboardConnections: [0]},
  // yellow starting city hexes
  "18eu_Berlin": {color: "yellow", name: "Berlin", letters: "B", stops: [{tokens: 1, revenue: 30, tokenLabels: ["7"]},{tokens: 1, revenue: 30, tokenLabels: ["9"]}], connections: [[1,-2],[4,-1]]},
  "18eu_Paris": {color: "yellow", name: "Paris", letters: "P", stops: [{tokens: 1, revenue: 40, tokenLabels: ["1"]},{tokens: 1, revenue: 40, tokenLabels: ["3"]}], connections: [[1,-1],[2,-2]]},
  "18eu_Vienna": {color: "yellow", name: "Vienna", letters: "V", stops: [{tokens: 1, revenue: 30, tokenLabels: ["6"]},{tokens: 1, revenue: 30, tokenLabels: ["11"]}], connections: [[0,-1],[3,-2]]},
  // yellow mountain track hex
  "18eu_Semmering": {color: "yellow", name: "Semmering", letters: "M", icon: "mountain", upgradeCost: 60, connections: [[0,4]]},
  // colorless starting city hexes
  "18eu_Amsterdam": {color: "light green", name: "Amsterdam", letters: "Y", stop: {tokens:1, tokenLabels: ["12"]}},
  "18eu_Dresden": {color: "light green", name: "Dresden", letters: "Y", stop: {tokens:1, tokenLabels: ["4"]}},
  "18eu_Brussels": {color: "light green", name: "Brussels", letters: "Y", stop: {tokens:1, tokenLabels: ["2"]}},
  "18eu_Munich": {color: "light green", name: "Munich", letters: "Y", stop: {tokens:1, tokenLabels: ["13"]}},
  "18eu_Strasbourg": {color: "light green", name: "Strasbourg", letters: "Y", stop: {tokens:1, tokenLabels: ["14"]}},
  "18eu_Budapest": {color: "light green", name: "Budapest", letters: "Y", stop: {tokens:1, tokenLabels: ["8"]}},
  "18eu_Lyon": {color: "light green", name: "Lyon", letters: "Y", stop: {tokens:1, tokenLabels: ["15"]}},
  "18eu_Milan": {color: "light green", name: "Milan", letters: "Y", stop: {tokens:1, tokenLabels: ["10"]}},
  "18eu_Venice": {color: "light green", name: "Venice", letters: "Y", stop: {tokens:1, tokenLabels: ["5"]}},
  // colorless city hexes
  "18eu_Dortmund": {color: "light green", name: "Dortmund", stop: {tokens: 1}},
  "18eu_Cologne": {color: "light green", name: "Cologne", stop: {tokens: 1}},
  "18eu_Frankfurt": {color: "light green", name: "Frankfurt", stop: {tokens: 1}},
  "18eu_Prague": {color: "light green", name: "Prague", stop: {tokens: 1}},
  "18eu_Trieste": {color: "light green", name: "Trieste", stop: {tokens: 1}},
  "18eu_Marseille": {color: "light green", name: "Marseille", stop: {tokens: 1}},
  "18eu_Turin": {color: "light green", name: "Turin", stop: {tokens: 1}},
  "18eu_Genoa": {color: "light green", name: "Genoa", stop: {tokens: 1}},
  // colorless town hexes
  "18eu_Bremen": {color: "light green", name: "Bremen", stop: {}},
};

// prettier-ignore
export var tileList: hexes.TileList = {
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
/*
  "": {color: "green"},
*/
