export default {
  /**
   * 金额格式化 123456789 => 1,234,567,890
   * @param {string} value 金额
   */
  formateMoney(value) {
    if (!value) {
      return '';
    }

    var num = Number(value);
    return num.toLocaleString('en-US');
  },
};
