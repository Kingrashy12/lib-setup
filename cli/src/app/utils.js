export const changeAppName = (name, content) => {
  let newName = name === "/" ? "my-package" : name;
  const jsonFile = JSON.parse(content);
  jsonFile.name = newName;
  return JSON.stringify(jsonFile, null, 2);
};
