import numeral from 'numeral';

export const printStats = (stat :any) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";