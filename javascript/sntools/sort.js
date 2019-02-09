let sort = [3, 2, 1, 4].sort(function (e1, e2) {
  return e1 - e2;
});

console.log(sort);

sort = ['1', '01', '2', '02', '10', '20'].sort(function (e1, e2) {
  return e1.localeCompare(e2);
});

console.log(sort);
