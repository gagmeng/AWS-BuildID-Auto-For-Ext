/**
 * 浏览器指纹随机化模块
 * 为每个注册会话生成随机的浏览器指纹，避免被检测为批量注册
 */

/**
 * 生成随机 User-Agent
 */
function generateRandomUserAgent() {
  const browsers = [
    {
      name: 'Chrome',
      versions: ['120.0.0.0', '119.0.0.0', '118.0.0.0', '117.0.0.0'],
      platforms: [
        'Windows NT 10.0; Win64; x64',
        'Windows NT 10.0; WOW64',
        'Macintosh; Intel Mac OS X 10_15_7',
        'X11; Linux x86_64'
      ]
    },
    {
      name: 'Firefox',
      versions: ['121.0', '120.0', '119.0', '118.0'],
      platforms: [
        'Windows NT 10.0; Win64; x64; rv:121.0',
        'Macintosh; Intel Mac OS X 10.15',
        'X11; Linux x86_64'
      ]
    },
    {
      name: 'Safari',
      versions: ['17.1', '17.0', '16.6', '16.5'],
      platforms: [
        'Macintosh; Intel Mac OS X 10_15_7',
        'Macintosh; Intel Mac OS X 10_14_6'
      ]
    }
  ];

  const browser = browsers[Math.floor(Math.random() * browsers.length)];
  const version = browser.versions[Math.floor(Math.random() * browser.versions.length)];
  const platform = browser.platforms[Math.floor(Math.random() * browser.platforms.length)];

  let userAgent;
  switch (browser.name) {
    case 'Chrome':
      userAgent = `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
      break;
    case 'Firefox':
      userAgent = `Mozilla/5.0 (${platform}) Gecko/20100101 Firefox/${version}`;
      break;
    case 'Safari':
      userAgent = `Mozilla/5.0 (${platform}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;
      break;
  }

  return userAgent;
}

/**
 * 生成随机屏幕分辨率
 */
function generateRandomScreenResolution() {
  const resolutions = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 2560, height: 1440 },
    { width: 1600, height: 900 }
  ];

  return resolutions[Math.floor(Math.random() * resolutions.length)];
}

/**
 * 生成随机时区
 */
function generateRandomTimezone() {
  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'America/Chicago'
  ];

  return timezones[Math.floor(Math.random() * timezones.length)];
}

/**
 * 生成随机语言设置
 */
function generateRandomLanguages() {
  const languageSets = [
    ['en-US', 'en'],
    ['zh-CN', 'zh'],
    ['en-GB', 'en'],
    ['fr-FR', 'fr'],
    ['de-DE', 'de'],
    ['ja-JP', 'ja'],
    ['es-ES', 'es']
  ];

  return languageSets[Math.floor(Math.random() * languageSets.length)];
}

/**
 * 生成随机 Canvas 指纹干扰值
 */
function generateCanvasNoise() {
  return {
    r: Math.floor(Math.random() * 10) - 5,
    g: Math.floor(Math.random() * 10) - 5,
    b: Math.floor(Math.random() * 10) - 5,
    a: Math.random() * 0.1 - 0.05
  };
}

/**
 * 生成随机 WebGL 参数
 */
function generateWebGLParams() {
  const vendors = [
    'Google Inc.',
    'Mozilla',
    'Apple Inc.',
    'Microsoft Corporation'
  ];

  const renderers = [
    'ANGLE (Intel, Intel(R) HD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'WebKit WebGL',
    'Mozilla -- ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.8681)'
  ];

  return {
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    renderer: renderers[Math.floor(Math.random() * renderers.length)]
  };
}

/**
 * 生成完整的随机指纹配置
 */
function generateRandomFingerprint() {
  const userAgent = generateRandomUserAgent();
  const screen = generateRandomScreenResolution();
  const timezone = generateRandomTimezone();
  const languages = generateRandomLanguages();
  const canvasNoise = generateCanvasNoise();
  const webgl = generateWebGLParams();

  return {
    userAgent,
    screen,
    timezone,
    languages,
    canvasNoise,
    webgl,
    // 其他随机参数
    hardwareConcurrency: Math.floor(Math.random() * 8) + 2, // 2-10 核心
    deviceMemory: [2, 4, 8, 16][Math.floor(Math.random() * 4)], // GB
    colorDepth: [24, 32][Math.floor(Math.random() * 2)],
    pixelDepth: [24, 32][Math.floor(Math.random() * 2)]
  };
}

/**
 * 指纹注入函数（直接传给 chrome.scripting.executeScript 的 func 参数）
 * 注意：此函数在页面 MAIN world 中执行，不能引用外部闭包
 */
function injectFingerprint(fp) {
  'use strict';

  Object.defineProperty(navigator, 'userAgent', { get: () => fp.userAgent });

  Object.defineProperty(screen, 'width', { get: () => fp.screen.width });
  Object.defineProperty(screen, 'height', { get: () => fp.screen.height });
  Object.defineProperty(screen, 'availWidth', { get: () => fp.screen.width });
  Object.defineProperty(screen, 'availHeight', { get: () => fp.screen.height - 40 });

  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => fp.hardwareConcurrency });
  Object.defineProperty(navigator, 'deviceMemory', { get: () => fp.deviceMemory });

  Object.defineProperty(screen, 'colorDepth', { get: () => fp.colorDepth });
  Object.defineProperty(screen, 'pixelDepth', { get: () => fp.pixelDepth });

  Object.defineProperty(navigator, 'language', { get: () => fp.languages[0] });
  Object.defineProperty(navigator, 'languages', { get: () => fp.languages });

  const originalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(...args) {
    if (args.length === 0 || (args.length === 1 && typeof args[0] === 'undefined')) {
      args[0] = fp.languages[0];
    }
    if (args.length <= 1 || !args[1] || !args[1].timeZone) {
      args[1] = args[1] || {};
      args[1].timeZone = fp.timezone;
    }
    return new originalDateTimeFormat(...args);
  };

  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function(...args) {
    const imageData = originalGetImageData.apply(this, args);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] += fp.canvasNoise.r;
      data[i + 1] += fp.canvasNoise.g;
      data[i + 2] += fp.canvasNoise.b;
      data[i + 3] += fp.canvasNoise.a;
    }
    return imageData;
  };

  const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    if (parameter === 37445) return fp.webgl.vendor;
    if (parameter === 37446) return fp.webgl.renderer;
    return originalGetParameter.apply(this, arguments);
  };

  if (typeof WebGL2RenderingContext !== 'undefined') {
    const originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return fp.webgl.vendor;
      if (parameter === 37446) return fp.webgl.renderer;
      return originalGetParameter2.apply(this, arguments);
    };
  }

  console.log('[Fingerprint] 随机指纹已注入:', {
    userAgent: fp.userAgent,
    screen: `${fp.screen.width}x${fp.screen.height}`,
    timezone: fp.timezone,
    language: fp.languages[0]
  });
}

export {
  generateRandomFingerprint,
  injectFingerprint
};