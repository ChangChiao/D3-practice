export const doData = (a, b) => {
  const arr = a.COUNTY_MOI_1090820.geometries;
  const importArr = b.counties.geometries;
  arr.map((element) => {
    const newObj = { ...element };
    importArr.forEach((item) => {
      if (element.properties.COUNTYNAME === item.properties.name) {
        newObj.id = item.id;
        newObj.properties = {
          ...item.properties.name,
          ...item.properties.kmt,
          ...item.properties.ddp,
          ...item.properties.pfp,
          winner: transWinner(item.properties.winner_2020),
          winnerRate: item.properties.winning_rate_2020,
          color: transColor(transWinner(item.properties.winner_2020)),
        };
      }
    });
    return newObj;
  });
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
