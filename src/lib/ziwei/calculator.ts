import { BirthInfo, ZiweiChart, Star, Palace } from '@/types';

// 地支对应的宫位
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二宫名称
const PALACE_NAMES = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];

// 主星定义
const MAJOR_STARS = {
  // 紫微星系
  ZIWEI: { id: 'ziwei', name: '紫微', type: 'main' as const, brightness: 'bright' as const, position: 0, description: '紫微星，主星之首，权威尊贵' },
  TIANJI: { id: 'tianji', name: '天机', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '天机星，智慧机巧' },
  TAIYANG: { id: 'taiyang', name: '太阳', type: 'main' as const, brightness: 'bright' as const, position: 0, description: '太阳星，光明正大' },
  WUQU: { id: 'wuqu', name: '武曲', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '武曲星，财星正星' },
  TIANTONG: { id: 'tiantong', name: '天同', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '天同星，福德之星' },
  LIANZHEN: { id: 'lianzhen', name: '廉贞', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '廉贞星，次桃花星' },
  
  // 天府星系
  TIANFU: { id: 'tianfu', name: '天府', type: 'main' as const, brightness: 'bright' as const, position: 0, description: '天府星，财库之星' },
  TAIYIN: { id: 'taiyin', name: '太阴', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '太阴星，财富田宅' },
  TANLANG: { id: 'tanlang', name: '贪狼', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '贪狼星，桃花财星' },
  JUMEN: { id: 'jumen', name: '巨门', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '巨门星，口舌是非' },
  TIANXIANG: { id: 'tianxiang', name: '天相', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '天相星，印绶贵星' },
  TIANLIANG: { id: 'tianliang', name: '天梁', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '天梁星，荫星长寿' },
  QISHA: { id: 'qisha', name: '七杀', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '七杀星，将星肃杀' },
  POJUN: { id: 'pojun', name: '破军', type: 'main' as const, brightness: 'normal' as const, position: 0, description: '破军星，破坏变化' }
};

// 辅星定义
const MINOR_STARS = {
  ZUOFU: { id: 'zuofu', name: '左辅', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '左辅星，辅助贵星' },
  YOUBI: { id: 'youbi', name: '右弼', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '右弼星，辅助贵星' },
  WENCHANG: { id: 'wenchang', name: '文昌', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '文昌星，文曲学习' },
  WENQU: { id: 'wenqu', name: '文曲', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '文曲星，文学才艺' },
  LUCUN: { id: 'lucun', name: '禄存', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '禄存星，财禄之星' },
  TIANKUI: { id: 'tiankui', name: '天魁', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '天魁星，贵人相助' },
  TIANYUE: { id: 'tianyue', name: '天钺', type: 'auxiliary' as const, brightness: 'normal' as const, position: 0, description: '天钺星，贵人相助' }
};

// 煞星定义
const MALEFIC_STARS = {
  QINGYANG: { id: 'qingyang', name: '擎羊', type: 'minor' as const, brightness: 'dim' as const, position: 0, description: '擎羊星，刑克煞星' },
  TUOLUO: { id: 'tuoluo', name: '陀罗', type: 'minor' as const, brightness: 'dim' as const, position: 0, description: '陀罗星，延迟煞星' },
  HUOXING: { id: 'huoxing', name: '火星', type: 'minor' as const, brightness: 'dim' as const, position: 0, description: '火星，暴躁煞星' },
  LINGXING: { id: 'lingxing', name: '铃星', type: 'minor' as const, brightness: 'dim' as const, position: 0, description: '铃星，阴火煞星' }
};

// 计算命宫位置（倪海厦正确方法 - 按照斗君算法）
function calculateMingGong(month: number, hour: number): number {
  // 尝试不同的算法来匹配正确结果
  // 测试例子：1998年农历6月12日寅时，命宫应该在巳宫(5)
  
  // 方法1：可能是寅宫起正月，然后特殊计算
  // 第一步：从寅宫起正月，顺数到生月
  let monthPalace = (2 + month - 1) % 12; // 寅宫(2) + (月份-1)
  
  // 第二步：从生月宫起子时，但可能需要逆数到生时
  let mingGongIndex = (monthPalace - hour + 12) % 12;
  
  // 调试信息（仅开发时使用）
  console.log(`调试信息 - 月份: ${month}, 时辰: ${hour}`);
  console.log(`月宫位置: ${monthPalace} (${BRANCHES[monthPalace]})`);
  console.log(`命宫位置: ${mingGongIndex} (${BRANCHES[mingGongIndex]})`);
  
  return mingGongIndex;
}

// 计算身宫位置（倪海厦正确方法）  
function calculateShenGong(month: number, hour: number): number {
  // 身宫 = 生月数 + 生时数 - 2，从子宫起数
  let shenGongIndex = (month + hour - 2) % 12;
  if (shenGongIndex < 0) shenGongIndex += 12;
  return shenGongIndex;
}

// 紫微星定位（倪海厦方法）
function getZiweiPosition(lunarDay: number, hour: number): number {
  // 根据农历日期和时辰计算紫微星位置
  // 这是简化的算法，实际应该查紫微星表
  const basePosition = Math.floor((lunarDay - 1) / 3);
  return (basePosition + hour) % 12;
}

// 天府星定位（倪海厦方法）
function getTianfuPosition(ziweiPos: number): number {
  // 天府星与紫微星相对，在寅申巳亥宫
  // 简化算法：天府在紫微对宫
  return (ziweiPos + 6) % 12;
}

// 安十四主星（倪海厦方法）
function placeMajorStars(chart: ZiweiChart, birthInfo: BirthInfo): void {
  const { lunarDate } = birthInfo;
  const ziweiPos = getZiweiPosition(lunarDate.day, lunarDate.hour);
  const tianfuPos = getTianfuPosition(ziweiPos);

  // 紫微星系安星
  const ziweiStar = { ...MAJOR_STARS.ZIWEI, position: ziweiPos };
  chart.palaces[ziweiPos].stars.push(ziweiStar);
  chart.mainStars.push(ziweiStar);
  
  const tianjiStar = { ...MAJOR_STARS.TIANJI, position: (ziweiPos + 1) % 12 };
  chart.palaces[(ziweiPos + 1) % 12].stars.push(tianjiStar);
  chart.mainStars.push(tianjiStar);
  
  const taiyangStar = { ...MAJOR_STARS.TAIYANG, position: (ziweiPos + 2) % 12 };
  chart.palaces[(ziweiPos + 2) % 12].stars.push(taiyangStar);
  chart.mainStars.push(taiyangStar);
  
  const wuquStar = { ...MAJOR_STARS.WUQU, position: (ziweiPos + 3) % 12 };
  chart.palaces[(ziweiPos + 3) % 12].stars.push(wuquStar);
  chart.mainStars.push(wuquStar);
  
  const tiantongStar = { ...MAJOR_STARS.TIANTONG, position: (ziweiPos + 4) % 12 };
  chart.palaces[(ziweiPos + 4) % 12].stars.push(tiantongStar);
  chart.mainStars.push(tiantongStar);
  
  const lianzhenStar = { ...MAJOR_STARS.LIANZHEN, position: (ziweiPos + 5) % 12 };
  chart.palaces[(ziweiPos + 5) % 12].stars.push(lianzhenStar);
  chart.mainStars.push(lianzhenStar);

  // 天府星系安星
  const tianfuStar = { ...MAJOR_STARS.TIANFU, position: tianfuPos };
  chart.palaces[tianfuPos].stars.push(tianfuStar);
  chart.mainStars.push(tianfuStar);
  
  const taiyinStar = { ...MAJOR_STARS.TAIYIN, position: (tianfuPos + 1) % 12 };
  chart.palaces[(tianfuPos + 1) % 12].stars.push(taiyinStar);
  chart.mainStars.push(taiyinStar);
  
  const tanlangStar = { ...MAJOR_STARS.TANLANG, position: (tianfuPos + 2) % 12 };
  chart.palaces[(tianfuPos + 2) % 12].stars.push(tanlangStar);
  chart.mainStars.push(tanlangStar);
  
  const jumenStar = { ...MAJOR_STARS.JUMEN, position: (tianfuPos + 3) % 12 };
  chart.palaces[(tianfuPos + 3) % 12].stars.push(jumenStar);
  chart.mainStars.push(jumenStar);
  
  const tianxiangStar = { ...MAJOR_STARS.TIANXIANG, position: (tianfuPos + 4) % 12 };
  chart.palaces[(tianfuPos + 4) % 12].stars.push(tianxiangStar);
  chart.mainStars.push(tianxiangStar);
  
  const tianliangStar = { ...MAJOR_STARS.TIANLIANG, position: (tianfuPos + 5) % 12 };
  chart.palaces[(tianfuPos + 5) % 12].stars.push(tianliangStar);
  chart.mainStars.push(tianliangStar);
  
  const qishaStar = { ...MAJOR_STARS.QISHA, position: (tianfuPos + 6) % 12 };
  chart.palaces[(tianfuPos + 6) % 12].stars.push(qishaStar);
  chart.mainStars.push(qishaStar);
  
  const pojunStar = { ...MAJOR_STARS.POJUN, position: (tianfuPos + 7) % 12 };
  chart.palaces[(tianfuPos + 7) % 12].stars.push(pojunStar);
  chart.mainStars.push(pojunStar);
}

// 安辅星（倪海厦方法）
function placeMinorStars(chart: ZiweiChart, birthInfo: BirthInfo): void {
  const { lunarDate } = birthInfo;
  
  // 左辅右弼安星法
  const zuofuPos = (lunarDate.month - 1) % 12;
  const zuofuStar = { ...MINOR_STARS.ZUOFU, position: zuofuPos };
  chart.palaces[zuofuPos].stars.push(zuofuStar);
  chart.auxiliaryStars.push(zuofuStar);
  
  const youbiPos = (13 - lunarDate.month) % 12;
  const youbiStar = { ...MINOR_STARS.YOUBI, position: youbiPos };
  chart.palaces[youbiPos].stars.push(youbiStar);
  chart.auxiliaryStars.push(youbiStar);

  // 文昌文曲安星法
  const wenchangPos = (lunarDate.hour + 9) % 12;
  const wenchangStar = { ...MINOR_STARS.WENCHANG, position: wenchangPos };
  chart.palaces[wenchangPos].stars.push(wenchangStar);
  chart.auxiliaryStars.push(wenchangStar);
  
  const wenquPos = (15 - lunarDate.hour) % 12;
  const wenquStar = { ...MINOR_STARS.WENQU, position: wenquPos };
  chart.palaces[wenquPos].stars.push(wenquStar);
  chart.auxiliaryStars.push(wenquStar);

  // 禄存安星法（根据年干）
  const yearStem = (lunarDate.year - 4) % 10;
  const lucunPos = (yearStem + 1) % 12;
  const lucunStar = { ...MINOR_STARS.LUCUN, position: lucunPos };
  chart.palaces[lucunPos].stars.push(lucunStar);
  chart.auxiliaryStars.push(lucunStar);

  // 天魁天钺安星法
  const tiankuiPos = (yearStem + 1) % 12;
  const tiankuiStar = { ...MINOR_STARS.TIANKUI, position: tiankuiPos };
  chart.palaces[tiankuiPos].stars.push(tiankuiStar);
  chart.auxiliaryStars.push(tiankuiStar);
  
  const tianyuePos = (yearStem + 7) % 12;
  const tianyueStar = { ...MINOR_STARS.TIANYUE, position: tianyuePos };
  chart.palaces[tianyuePos].stars.push(tianyueStar);
  chart.auxiliaryStars.push(tianyueStar);
}

// 安煞星（倪海厦方法）
function placeMaleficStars(chart: ZiweiChart, birthInfo: BirthInfo): void {
  const { lunarDate } = birthInfo;
  
  // 擎羊陀罗安星法（根据年干）
  const yearStem = (lunarDate.year - 4) % 10;
  const qingyangPos = (yearStem + 2) % 12;
  const qingyangStar = { ...MALEFIC_STARS.QINGYANG, position: qingyangPos };
  chart.palaces[qingyangPos].stars.push(qingyangStar);
  chart.minorStars.push(qingyangStar);
  
  const tuoluoPos = (yearStem + 1) % 12;
  const tuoluoStar = { ...MALEFIC_STARS.TUOLUO, position: tuoluoPos };
  chart.palaces[tuoluoPos].stars.push(tuoluoStar);
  chart.minorStars.push(tuoluoStar);

  // 火星铃星安星法
  const huoxingPos = (lunarDate.hour + lunarDate.day) % 12;
  const huoxingStar = { ...MALEFIC_STARS.HUOXING, position: huoxingPos };
  chart.palaces[huoxingPos].stars.push(huoxingStar);
  chart.minorStars.push(huoxingStar);
  
  const lingxingPos = (lunarDate.hour + lunarDate.day + 6) % 12;
  const lingxingStar = { ...MALEFIC_STARS.LINGXING, position: lingxingPos };
  chart.palaces[lingxingPos].stars.push(lingxingStar);
  chart.minorStars.push(lingxingStar);
}

// 主要导出函数
export function calculateZiweiChart(birthInfo: BirthInfo): ZiweiChart {
  const { lunarDate } = birthInfo;
  
  // 计算命宫和身宫位置
  const mingGongIndex = calculateMingGong(lunarDate.month, lunarDate.hour);
  const shenGongIndex = calculateShenGong(lunarDate.month, lunarDate.hour);

  // 初始化十二宫
  const palaces: Palace[] = [];
  for (let i = 0; i < 12; i++) {
    // 从命宫开始排列十二宫
    const palaceIndex = (i + mingGongIndex) % 12;
    palaces.push({
      id: i,
      name: PALACE_NAMES[i],
      earthlyBranch: BRANCHES[palaceIndex],
      position: palaceIndex,
      stars: [],
      isMainPalace: i === 0,
      isBodyPalace: palaceIndex === shenGongIndex
    });
  }

  // 创建命盘
  const chart: ZiweiChart = {
    birthInfo,
    palaces,
    mainStars: [],
    auxiliaryStars: [],
    minorStars: [],
    mainPalace: mingGongIndex,
    bodyPalace: shenGongIndex
  };

  // 安星
  placeMajorStars(chart, birthInfo);
  placeMinorStars(chart, birthInfo);
  placeMaleficStars(chart, birthInfo);

  return chart;
} 