export const combineData = (a, b, type = 'counties') => {
  const arr = a.objects[type].geometries;
  const importArr = b.objects[type].geometries;
  const newObjects = arr.map((element) => {
    const newObj = { ...element };
    importArr.forEach((item) => {
      if (transCode(element, type) === removeDash(item.id, type)) {
        newObj.properties = {
          countyId: element.properties.COUNTYCODE,
          countryName: element.properties.COUNTYNAME,
          kmt: item.properties.kmt,
          ddp: item.properties.ddp,
          pfp: item.properties.pfp,
          winner: transWinner(item.properties.winner_2020),
          winnerRate: item.properties.winning_rate_2020,
          color: transColor(transWinner(item.properties.winner_2020)),
        };
        newObj.id = element.properties.COUNTYCODE;
        if (type === 'town') {
          newObj.properties.townName = element.properties.TOWNNAME;
          newObj.id = element.properties.TOWNCODE;
          newObj.properties.townId = element.properties.TOWNCODE;
        }
        if (type === 'village') {
          newObj.properties.townName = element.properties.TOWNNAME;
          newObj.properties.villageName = element.properties.VILLAGENAME;
          newObj.id = element.properties.VILLCODE;
          newObj.properties.townId = element.properties.TOWNCODE;
          newObj.properties.villageId = element.properties.VILLCODE;
        }
      }
    });
    return newObj;
  });
  a.objects[type].geometries = newObjects;
  return a;
};

const removeDash = (str, type) => {
  return type === 'village' ? str.replace(/-/g, '') : str;
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
