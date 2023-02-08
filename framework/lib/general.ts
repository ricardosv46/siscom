const fetcher = async (input: RequestInfo,init: RequestInit,...args: any[]) => {
  const res = await fetch(input, init);
  return res.json();
};
const mergeArray = (arr1:any[], arr2:any[]) => {
  let res = [];
  res = arr2.filter( obj => {
    const index = arr1.some(el => el["id"] === obj["id"]);
    return !index;
  });
  return [...arr1, ...res];
};

const formatDate =  (dateInput:string):string => {
  const date = new Date(dateInput)
  const day = ('0'+date.getDate()).slice(-2)
  const month = ('0'+ (date.getMonth()+1)).slice(-2)
  return `${day} / ${month} / ${date.getFullYear().toString().slice(2)}`
}

export { fetcher, mergeArray, formatDate }