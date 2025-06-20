import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    const analysis = '根据您的紫薇斗数命盘，您的主星显示出很强的领导能力和创造力。命宫中的星曜配置表明您在事业上有不错的发展潜力，建议把握机会，发挥自身优势。财运方面整体平稳，需要注意理财规划。';
    
    return NextResponse.json({ 
      success: true, 
      analysis, 
      chart: data 
    });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '分析失败，请稍后重试' }, 
      { status: 500 }
    );
  }
}
