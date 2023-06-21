export function formatDate(dateString: string) {
  let tempDate = new Date(dateString);
  let formattedDate = [
    tempDate.getDate(),
    tempDate.getMonth() <= 10
      ? '0' + (parseInt(tempDate.getMonth().toString()) + 1)
      : tempDate.getMonth() + 1,
    tempDate.getFullYear(),
  ].join('/');
  return formattedDate;
}
