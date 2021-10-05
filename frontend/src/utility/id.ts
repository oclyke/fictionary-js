import greg from 'greg';

const pick = (indices: number | number[], input: any[]): any | any[] => {
  if (indices instanceof Array) {
    const result = indices.map((i) => (input[i]))
    return result;
  } else {
    return input.splice(indices, 1);
  }
}

export const suggestId = () => {
  const base = greg.sentence();
  const separate = base.split(' ');
  // const result = pick([1, 2, 3, 4], separate).join('-')
  const result = pick([1, 2], separate).join('-')
  return result;
}
