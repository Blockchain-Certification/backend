export const isValidName = async (
  name: string,
  list: any,
): Promise<boolean> => {
  name = clearCharacter(name);

  const check = await list.filter((el: any) => {
    let nameEl = el.name || el.year;
    nameEl = clearCharacter(nameEl);
    return nameEl === name;
  });
  if (check.length > 0) return true;

  return false;

  function clearCharacter(name: string) {
    if (typeof +name === 'number') return name;
    return name.toLowerCase().replace(/\s+/g, '');
  }
};
