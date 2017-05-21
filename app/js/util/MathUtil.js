class MathUtil {

  // static valueToCaption(value, decimals) {
  //   return this.round(value  / Math.pow(10, decimals), ShowDecimals)
  // }

  static format(value, decimals, showDecimals) {
    if (value === "" || isNaN(value)) {
      return ""
    }
    return this.round(value / Math.pow(10, decimals), ShowDecimals)
  }

  static round(value, decimals) {
    return value === "" ? "" : Math.round(value  * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }

  static step(a, b) {
    return a / this.gcd(a, b)
  }

  static gcd(a, b) {
    if (!b) {
      return a;
    }
    return this.gcd(b, a % b);
  }

  static pairs(set) {
    var i, j, combs, head, tailcombs;
    if (2 == set.length) {
      return [set];
    }
    var combs = [];
    for (i = 0; i < set.length - 1; i++) {
      head = set.slice(i, i + 1);
      tailcombs = set.slice(i + 1);
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  }
}
