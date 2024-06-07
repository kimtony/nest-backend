    /**
     * @Description: 根据两个列表取并集
     * @param {number} list1
     * @param {number} list2
     * @return {*}
     */
    export const getUnion = (list1: number[], list2: number[]): number[] => {
        return [...list1, ...list2];
    };
  /**
   * @Description: 两个列表取交集
   * @param {number} list1
   * @param {number} list2
   * @return {*}
   */
  export const getIntersection = (list1: number[], list2: number[]): number[] => {
    if (list1.length > list2.length) {
      return list1.filter((item) => list2.includes(item));
    } else {
      return list2.filter((item) => list1.includes(item));
    }
  };
  /**
   * @Description: 两个列表取差集
   * @param {number} list1
   * @param {number} list2
   * @return {*}
   */
  export const getDifference = (list1: number[], list2: number[]): number[] => {
    if (list1.length > list2.length) {
      return list1.filter((item) => !list2.includes(item));
    } else {
      return list2.filter((item) => !list1.includes(item));
    }
  };

    /**
   * @Description: 两个列表取差集
   * @param {any} list
   * @param {any} key
   * @return {*}
   */
    export const isExistInArr = (list: any[], key: any ): boolean => {
      return list.filter(item => item === key).length > 0;
    };
  
    /**
     * 
     * @param arr 数组去重
     * @returns 
     */
    export const unique = (arr:any[]) =>{
      return arr.filter(function(item, index, arr) {
        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        return arr.indexOf(item, 0) === index;
      });
    }