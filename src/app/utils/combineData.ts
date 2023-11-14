export const combineData = (a, b, type = 'counties') => {
  const arr = a.objects[type].geometries;
  const importArr = b.objects[type].geometries;
  const newObjects = arr.map((element) => {
    const newObj = { ...element };
    importArr.forEach((item) => {
      if (transCode(element, type) === item.id) {
        newObj.id = item.id;
        newObj.properties = {
          countryName: element.properties.COUNTYNAME,
          kmt: item.properties.kmt,
          ddp: item.properties.ddp,
          pfp: item.properties.pfp,
          winner: transWinner(item.properties.winner_2020),
          winnerRate: item.properties.winning_rate_2020,
          color: transColor(transWinner(item.properties.winner_2020)),
        };
        if (type === 'town' || type === 'village') {
          newObj.properties.townName = element.properties.TOWNNAME;
        }
        if (type === 'village') {
          newObj.properties.villageName = element.properties.VILLAGENAME;
        }
      }
    });
    return newObj;
  });
  a.objects[type].geometries = newObjects;
  return a;
};

const transCode = (element, type) => {
  if (type === 'counties') return element.properties.COUNTYCODE;
  if (type === 'town') return element.properties.TOWNCODE.slice(0, -1);
  return element.properties.VILLCODE;
};

const transWinner = (type) => {
  if (type === '民進黨') return 'ddp';
  if (type === '國民黨') return 'kmt';
  return 'pfp';
};

const transColor = (winner) => {
  if (winner === 'ddp') return 'green';
  if (winner === 'kmt') return 'blue';
  return 'orange';
};
