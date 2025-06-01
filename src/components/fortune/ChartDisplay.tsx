import React from 'react';
import { ZiweiChart, Palace, Star } from '@/types';

interface ChartDisplayProps {
  chart: ZiweiChart;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chart }) => {
  // 十二宫位的布局位置（按传统命盘排列）
  const palaceLayout = [
    { row: 0, col: 3 }, // 巳宫 (5)
    { row: 0, col: 2 }, // 午宫 (6) 
    { row: 0, col: 1 }, // 未宫 (7)
    { row: 0, col: 0 }, // 申宫 (8)
    { row: 1, col: 0 }, // 酉宫 (9)
    { row: 2, col: 0 }, // 戌宫 (10)
    { row: 3, col: 0 }, // 亥宫 (11)
    { row: 3, col: 1 }, // 子宫 (0)
    { row: 3, col: 2 }, // 丑宫 (1)
    { row: 3, col: 3 }, // 寅宫 (2)
    { row: 2, col: 3 }, // 卯宫 (3)
    { row: 1, col: 3 }  // 辰宫 (4)
  ];

  // 地支对应的宫位索引
  const branchToIndex = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11
  };

  // 根据地支获取宫位
  const getPalaceByBranch = (branch: string): Palace => {
    const index = branchToIndex[branch as keyof typeof branchToIndex];
    return chart.palaces[index];
  };

  // 渲染星宿
  const renderStars = (stars: Star[]) => {
    const mainStars = stars.filter(star => star.type === 'main');
    const auxiliaryStars = stars.filter(star => star.type === 'auxiliary');
    
    return (
      <div className="space-y-1">
        {/* 主星 */}
        {mainStars.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mainStars.map((star, index) => (
              <span
                key={index}
                className="text-xs px-1 py-0.5 bg-red-100 text-red-700 rounded font-medium"
                title={star.description}
              >
                {star.name}
              </span>
            ))}
          </div>
        )}
        
        {/* 辅星 */}
        {auxiliaryStars.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {auxiliaryStars.slice(0, 4).map((star, index) => (
              <span
                key={index}
                className={`text-xs px-1 py-0.5 rounded ${
                  star.brightness === 'dim' 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}
                title={star.description}
              >
                {star.name}
              </span>
            ))}
            {auxiliaryStars.length > 4 && (
              <span className="text-xs text-gray-500">
                +{auxiliaryStars.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染单个宫位
  const renderPalace = (palace: Palace, layoutIndex: number) => {
    const layout = palaceLayout[layoutIndex];
    const isCorner = (layout.row === 0 || layout.row === 3) && (layout.col === 0 || layout.col === 3);
    
    return (
      <div
        key={palace.id}
        className={`
          relative border border-gray-300 p-2 min-h-[120px] bg-white
          ${palace.isMainPalace ? 'ring-2 ring-red-500 bg-red-50' : ''}
          ${palace.isBodyPalace ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
          ${isCorner ? 'bg-gray-50' : ''}
        `}
        style={{
          gridRow: layout.row + 1,
          gridColumn: layout.col + 1
        }}
      >
        {/* 宫位标题 */}
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-bold text-gray-700">
            {palace.name}
          </div>
          <div className="text-xs text-gray-500">
            {palace.earthlyBranch}
          </div>
        </div>

        {/* 命宫/身宫标记 */}
        {(palace.isMainPalace || palace.isBodyPalace) && (
          <div className="absolute top-1 right-1 flex space-x-1">
            {palace.isMainPalace && (
              <span className="text-xs bg-red-500 text-white px-1 rounded">命</span>
            )}
            {palace.isBodyPalace && (
              <span className="text-xs bg-blue-500 text-white px-1 rounded">身</span>
            )}
          </div>
        )}

        {/* 星宿 */}
        <div className="mt-2">
          {renderStars(palace.stars)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 命盘标题 */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">紫薇斗数命盘</h3>
        <div className="text-sm text-gray-600">
          <span className="mr-4">
            命宫：{chart.palaces[chart.mainPalace].name}({chart.palaces[chart.mainPalace].earthlyBranch})
          </span>
          <span>
            身宫：{chart.palaces[chart.bodyPalace].name}({chart.palaces[chart.bodyPalace].earthlyBranch})
          </span>
        </div>
      </div>

      {/* 命盘网格 */}
      <div className="grid grid-cols-4 grid-rows-4 gap-0 border-2 border-gray-400 bg-gray-100 mx-auto max-w-2xl">
        {/* 按照传统布局顺序渲染宫位 */}
        {[5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4].map((palaceIndex, layoutIndex) => 
          renderPalace(chart.palaces[palaceIndex], layoutIndex)
        )}
      </div>

      {/* 图例 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium text-gray-800 mb-2">标记说明</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-red-500 rounded"></span>
              <span>命宫</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-blue-500 rounded"></span>
              <span>身宫</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium text-gray-800 mb-2">星宿类型</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">主星</span>
              <span>十四主星</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">辅星</span>
              <span>辅助星宿</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">煞星</span>
              <span>煞曜星宿</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium text-gray-800 mb-2">宫位说明</h4>
          <div className="text-xs space-y-1">
            <p>命宫：主要性格特质</p>
            <p>身宫：后天发展方向</p>
            <p>财帛宫：财运状况</p>
            <p>官禄宫：事业发展</p>
            <p>夫妻宫：感情婚姻</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay; 