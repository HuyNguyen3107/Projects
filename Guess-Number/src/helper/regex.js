export const regexNumber = (maxNum, number) => {
  let count = 0;
  while (maxNum > 0) {
    count++;
    maxNum = Math.floor(maxNum / 10);
  }
  const pattern = new RegExp(`^[0-9]{1,${count}}$`);
  if (pattern.test(number)) {
    return number;
  } else {
    number = number + "";
    number = number.slice(0, -1);
    return +number;
  }
};
