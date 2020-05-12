export default {
  /**
   * yyyy-MM-dd HH:mm:ss
   */
  formater(timeStr) {
    let d = new Date(parseInt(timeStr));
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = '' + d.getFullYear();
    let hour = '' + d.getHours();
    let min = '' + d.getMinutes();
    let sec = '' + d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;
    if (sec.length < 2) sec = '0' + sec;

    let time = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    return time;
  },
};
