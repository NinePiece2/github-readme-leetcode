// src/lib/svg-generators.ts

import { LeetCodeStats, Theme, CardOptions, RecentSubmission } from '../types/leetcode';

/**
 * Main function to generate the complete LeetCode stats card
 * @param stats - LeetCode statistics data
 * @param theme - Theme configuration
 * @param options - Card display options
 * @returns Complete SVG string
 */
export function generateLeetCodeCard(stats: LeetCodeStats, theme: Theme, options: CardOptions): string {
  const { cardWidth = 500 } = options;

  const mainBodyX = 25;
  const mainBodyY = 55;            // y where circle + difficulty stats group starts
  const progressSectionHeight = 140; // estimated height that progress circle + difficulty stats occupy
  const sectionGap = 20;           // vertical gap between sections

  let cardHeight = mainBodyY + progressSectionHeight + 20;

  let graphHeight = 0;
  let graphYOffset = 0;
  if (options.showGraph) {
    const paddingX = 50;
    const availableWidth = Math.max(200, cardWidth - paddingX);
    const cellSizeBase = 11;
    const cellGap = 2;
    const days = 7;
    let weeks = Math.min(53, Math.floor((availableWidth + cellGap) / (cellSizeBase + cellGap)));
    weeks = Math.min(53, Math.max(6, weeks));
    let cellSize = cellSizeBase;
    if (weeks * (cellSizeBase + cellGap) - cellGap > availableWidth) {
      cellSize = Math.max(6, Math.floor((availableWidth + cellGap) / weeks - cellGap));
    }
    const gridHeight = days * (cellSize + cellGap) - cellGap;
    graphHeight = gridHeight + 60;
    graphYOffset = mainBodyY + progressSectionHeight + sectionGap;
    cardHeight += graphHeight + sectionGap;
  }

  // compute recent submissions block height based on actual items (max 3)
  let recentHeight = 0;
  let recentYOffset = 0;
  if (options.showRecent) {
    const recentList = stats.recentQuestions || [];
    const displayCount = Math.min(3, recentList.length || 3); // default to reserve space for up to 3 rows
    const headerHeight = 28;
    const rowHeight = 36;
    const bottomPadding = 16;
    recentHeight = headerHeight + displayCount * rowHeight + bottomPadding;
    // If graph is shown, place recent below graph, otherwise below main progress section
    recentYOffset = options.showGraph ? (graphYOffset + graphHeight + sectionGap) : (mainBodyY + progressSectionHeight + sectionGap);
    cardHeight += recentHeight + sectionGap;
  }

  // Build the SVG content using computed offsets
  const title = `${stats.username}'s LeetCode Stats`;

  const totalQuestions = stats.easyQuestions.total + stats.mediumQuestions.total + stats.hardQuestions.total;
  const progressPercentage = totalQuestions > 0 ? (stats.totalSolved / totalQuestions) * 100 : 0;
  const easyPercent = stats.easyQuestions.total ? (stats.easyQuestions.solved / stats.easyQuestions.total) * 100 : 0;
  const mediumPercent = stats.mediumQuestions.total ? (stats.mediumQuestions.solved / stats.mediumQuestions.total) * 100 : 0;
  const hardPercent = stats.hardQuestions.total ? (stats.hardQuestions.solved / stats.hardQuestions.total) * 100 : 0;

  // build the SVG
  return `
<svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="descId">
  <title id="titleId">${title}</title>
  <desc id="descId">LeetCode Statistics: ${stats.totalSolved} problems solved</desc>
  ${generateStyles(theme)}
  ${generateCardBackground(theme, `#${theme.borderColor}`, 1, cardHeight, cardWidth, options.hideBorder)}
  ${generateHeader(stats, theme, options, cardWidth, title)}

  <g data-testid="main-card-body" transform="translate(${mainBodyX}, ${mainBodyY})">
    ${generateProgressCircle(stats.totalSolved, progressPercentage, theme)}
    ${generateDifficultyStats(stats, theme, easyPercent, mediumPercent, hardPercent)}
  </g>

  ${options.showGraph ? generateContributionGraph(stats.contributionGraph || [], theme, graphYOffset, cardWidth) : ''}

  ${options.showRecent ? generateRecentQuestions(stats.recentQuestions || [], theme, recentYOffset) : ''}
</svg>`;
}

/**
 * Generates CSS styles for the SVG
 * @param theme - Theme configuration
 * @returns CSS style string
 */
function generateStyles(theme: Theme): string {
  return `
  <style>
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.titleColor};
      animation: fadeInAnimation 0.8s ease-in-out forwards;
    }
    @supports(-moz-appearance: auto) {
      .header { font-size: 15.5px; }
    }
    .stat {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.textColor};
    }
    .stat-bold {
      font: 700 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.textColor};
    }
    .stat-label {
      font: 400 12px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.textColor};
      opacity: 0.7;
    }
    .circle-text {
      font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.textColor};
      text-anchor: middle;
    }
    .circle-number {
      font: 700 32px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.titleColor};
      text-anchor: middle;
    }
    .circle-percentage {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.iconColor};
      text-anchor: middle;
    }
    .rank-text {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.textColor};
      text-anchor: middle;
    }
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .progress-bar {
      transform-origin: left;
      transform: scaleX(0);
      animation: growWidthAnimation 0.6s ease-in-out forwards;
    }
    .lang-name {
      font: 400 11px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.textColor};
    }
    
    @keyframes fadeInAnimation {
      from {
        opacity: 0;
        transform: translateX(-5px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes growWidthAnimation {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
    
    @keyframes scaleInAnimation {
      from {
        transform: scale(0) rotate(45deg);
      }
      to {
        transform: scale(1) rotate(0deg);
      }
    }
  </style>`;
}

/**
 * Generates the card background with gradient and shadow
 * @param theme - Theme configuration
 * @param borderStyle - Border styling
 * @param borderWidth - Border width
 * @param cardHeight - Card height
 * @param cardWidth - Card width
 * @param hideBorder - Whether to hide border
 * @returns Background SVG elements
 */
function generateCardBackground(
  theme: Theme, 
  borderStyle: string, 
  borderWidth: number, 
  cardHeight: number, 
  cardWidth: number, 
  hideBorder: boolean
): string {
  return `
  <!-- Enhanced background with subtle gradient -->
  <defs>
    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#${theme.bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#${theme.bgColor};stop-opacity:0.98" />
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
  </defs>
  
  <rect data-testid="card-bg" x="${borderWidth/2}" y="${borderWidth/2}" rx="4.5" 
        height="${cardHeight - borderWidth}" width="${cardWidth - borderWidth}" 
        fill="url(#cardGradient)" 
        stroke="${borderStyle}" 
        stroke-width="${borderWidth}"
        stroke-opacity="1"
        filter="${!hideBorder ? 'url(#dropShadow)' : ''}"/>`;
}

/**
 * Generates the header section with title and rank
 * @param stats - LeetCode statistics
 * @param theme - Theme configuration
 * @param options - Card options
 * @param cardWidth - Card width
 * @param title - Card title
 * @returns Header SVG elements
 */
function generateHeader(stats: LeetCodeStats, theme: Theme, options: CardOptions, cardWidth: number, title: string): string {
  return `
  <!-- Header section with improved layout -->
  <g data-testid="card-title" transform="translate(25, 35)">
    <text x="0" y="0" class="header">${title}</text>
    ${!options.hideRank && stats.rank > 0 ? `
    <g transform="translate(${cardWidth - 170}, -5)">
      <rect x="0" y="-15" width="140" height="25" rx="12" fill="#${theme.accentColor}" opacity="0.1"/>
      <text x="70" y="2" class="rank-text" fill="#${theme.accentColor}">
        Rank: ${stats.rank.toLocaleString()}
      </text>
    </g>` : ''}
  </g>`;
}

/**
 * Generates the central progress circle - FIXED to start from top
 * @param totalSolved - Total problems solved
 * @param progressPercentage - Completion percentage
 * @param theme - Theme configuration
 * @returns SVG circle elements
 */
function generateProgressCircle(totalSolved: number, progressPercentage: number, theme: Theme): string {
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // precise circumference
  const progressFraction = Math.max(0, Math.min(1, progressPercentage / 100));

  // dashoffset = circumference * (1 - progressFraction)
  const finalOffset = +(circumference * (1 - progressFraction)).toFixed(3);
  const initialOffset = +circumference.toFixed(3);

  return `
    <!-- Enhanced central circle progress indicator -->
    <g transform="translate(65, 55)">
      <!-- Outer glow -->
      <circle cx="0" cy="0" r="55" fill="none" stroke="#${theme.iconColor}" stroke-width="1" opacity="0.06"/>
      <!-- Background ring -->
      <circle cx="0" cy="0" r="${radius}" fill="none" stroke="#${theme.borderColor}" stroke-width="4" opacity="0.15"/>
      <!-- Progress arc drawn as a path that starts at top (12 o'clock) -->
      <!-- Path: move to (0,-r) then draw two half-arcs to make a full circle -->
      <path
        d="M 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}"
        fill="none"
        stroke="#${theme.iconColor}"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${initialOffset}"
        class="stagger"
        style="filter: drop-shadow(0 0 6px #${theme.iconColor}25);"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="${initialOffset}"
          to="${finalOffset}"
          begin="0.06s"
          dur="0.9s"
          fill="freeze"
        />
      </path>

      <!-- Center numbers -->
      <text x="0" y="-2" class="circle-number">${totalSolved}</text>
      <text x="0" y="16" class="circle-text">Solved</text>
      <text x="0" y="32" class="circle-percentage">${progressPercentage.toFixed(1)}%</text>
    </g>`;
}

/**
 * Generates difficulty statistics section
 * @param stats - LeetCode statistics
 * @param theme - Theme configuration
 * @param easyPercent - Easy problems percentage
 * @param mediumPercent - Medium problems percentage
 * @param hardPercent - Hard problems percentage
 * @returns Difficulty stats SVG elements
 */
function generateDifficultyStats(
  stats: LeetCodeStats, 
  theme: Theme, 
  easyPercent: number, 
  mediumPercent: number, 
  hardPercent: number
): string {
  // Make bars wider to better fill layout gaps and align text to the bar's right edge
  const barWidth = 320;

  return `
    <!-- Enhanced right side statistics with better spacing and repositioned percentages -->
    <g transform="translate(140, 10)">
      <!-- Easy problems with enhanced styling -->
      <g class="stagger" style="animation-delay: 600ms">
        <text x="0" y="18" class="stat">Easy</text>
        <text x="${barWidth - 50}" y="18" class="stat-bold" text-anchor="end">${stats.easyQuestions.solved}/${stats.easyQuestions.total}</text>
        <text x="${barWidth}" y="18" class="stat-label" text-anchor="end">${easyPercent.toFixed(1)}%</text>
        
  <rect x="0" y="25" width="${barWidth}" height="8" rx="4" fill="#${theme.borderColor}" opacity="0.2"/>
  <rect x="0" y="25" width="${(easyPercent / 100) * barWidth}" height="8" rx="4" fill="#00b894" class="progress-bar" style="animation-delay: 800ms"/>
      </g>
      
      <!-- Medium problems -->
      <g class="stagger" style="animation-delay: 700ms">
        <text x="0" y="55" class="stat">Medium</text>
        <text x="${barWidth - 50}" y="55" class="stat-bold" text-anchor="end">${stats.mediumQuestions.solved}/${stats.mediumQuestions.total}</text>
        <text x="${barWidth}" y="55" class="stat-label" text-anchor="end">${mediumPercent.toFixed(1)}%</text>
        
      <rect x="0" y="62" width="${barWidth}" height="8" rx="4" fill="#${theme.borderColor}" opacity="0.2"/>
      <rect x="0" y="62" width="${(mediumPercent / 100) * barWidth}" height="8" rx="4" fill="#fdcb6e" class="progress-bar" style="animation-delay: 900ms"/>
      </g>
      
      <!-- Hard problems -->
      <g class="stagger" style="animation-delay: 800ms">
        <text x="0" y="92" class="stat">Hard</text>
        <text x="${barWidth - 50}" y="92" class="stat-bold" text-anchor="end">${stats.hardQuestions.solved}/${stats.hardQuestions.total}</text>
        <text x="${barWidth}" y="92" class="stat-label" text-anchor="end">${hardPercent.toFixed(1)}%</text>
      <rect x="0" y="99" width="${barWidth}" height="8" rx="4" fill="#${theme.borderColor}" opacity="0.2"/>
      <rect x="0" y="99" width="${(hardPercent / 100) * barWidth}" height="8" rx="4" fill="#e17055" class="progress-bar" style="animation-delay: 1000ms"/>
      </g>
    </g>`;
}

/**
 * Enhanced contribution graph with better styling
 * @param data - Contribution data array
 * @param theme - Theme configuration
 * @param yOffset - Vertical offset position
 * @returns Contribution graph SVG elements
 */
export function generateContributionGraph(data: number[], theme: Theme, yOffset: number, cardWidth: number): string {
  const days = 7;
  const maxWeeks = 53;
  const paddingX = 50; // left + right padding
  const availableWidth = Math.max(200, cardWidth - paddingX);

  const baseCellSize = 11;
  const cellGap = 2;

  let weeks = Math.min(maxWeeks, Math.floor((availableWidth + cellGap) / (baseCellSize + cellGap)));
  let cellSize = baseCellSize;

  weeks = Math.min(53, Math.max(6, weeks));

  if (weeks * (baseCellSize + cellGap) - cellGap > availableWidth) {
    cellSize = Math.max(6, Math.floor((availableWidth + cellGap) / weeks - cellGap));
  }

  const gridWidth = weeks * (cellSize + cellGap) - cellGap;

  const translateX = Math.max(25, Math.round((cardWidth - gridWidth) / 2));

  const totalCells = weeks * days;
  const cells = new Array(totalCells).fill(0);
  const recent = data && data.length ? data.slice(-totalCells) : [];
  const start = Math.max(0, totalCells - recent.length);
  for (let i = 0; i < recent.length; i++) {
    cells[start + i] = recent[i] || 0;
  }

  const maxContributions = Math.max(...(cells.length ? cells : [1]), 1);

  const getContributionLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= maxContributions * 0.25) return 1;
    if (count <= maxContributions * 0.5) return 2;
    if (count <= maxContributions * 0.75) return 3;
    return 4;
  };

  const opacities = [0.14, 0.3, 0.5, 0.75, 1.0];
  const getOpacity = (level: number) => opacities[level] ?? 0.08;

  // header + legend
  let svg = `
  <g transform="translate(${translateX}, ${yOffset})">
    <text x="0" y="0" class="header" style="font-size:18px; font-weight:700;">Submission Activity</text>
    <g transform="translate(0, 22)" aria-hidden="true">
      <text x="0" y="0" class="stat-label" style="font-size:12px; fill:#${theme.textColor}; opacity:0.7">Less</text>
      ${[0,1,2,3,4].map((level, idx) => `<rect x="${35 + idx * (cellSize + 4)}" y="${-10}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${theme.iconColor}" fill-opacity="${getOpacity(level)}"/>`).join('')}
      <text x="${35 + 5 * (cellSize + 4) + 10}" y="0" class="stat-label" style="font-size:12px; fill:#${theme.textColor}; opacity:0.7">More</text>
    </g>

    <g transform="translate(0, 45)">`;

  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < days; day++) {
  const index = week * days + day;
  const contributions = cells[index] || 0;
      const level = getContributionLevel(contributions);
      const opacity = getOpacity(level);
      const x = week * (cellSize + cellGap);
      const y = day * (cellSize + cellGap);

      svg += `
        <g transform="translate(${x}, ${y})">
          <rect class="contrib-rect" x="0" y="0" width="${cellSize}" height="${cellSize}" rx="2"
                fill="#${theme.iconColor}" fill-opacity="${opacity}" data-week="${week}" data-day="${day}">
            <title>${contributions} submissions</title>
          </rect>
        </g>
      `;
    }
  }

  svg += '</g></g>';
  return svg;
}

/**
 * Enhanced recent questions with better styling and links
 * @param questions - Recent submission data
 * @param theme - Theme configuration
 * @param yOffset - Vertical offset position
 * @returns Recent questions SVG elements
 */
export function generateRecentQuestions(questions: RecentSubmission[], theme: Theme, yOffset: number): string {
  const difficultyColors = {
    'Easy': '#00b894',
    'Medium': '#fdcb6e',
    'Hard': '#e17055'
  };

  const startY = 24;           // first row baseline inside the block
  const lineHeight = 36;       // spacing between rows (in px)
  const circleCX = 10;         // left dot x
  const titleX = 34;           // title x
  const timeX = 350;           // time x (unchanged from previous layout)
  const difficultyX = 420;     // difficulty label x

  let svg = `
  <g transform="translate(25, ${yOffset})" aria-label="Recent submissions">
    <text x="0" y="0" class="header" style="font-size:22px; font-weight:700">Recent Submissions</text>
    <g transform="translate(0, 18)">
  `;

  const seen = new Set<string>();
  const unique: RecentSubmission[] = [];
  const list = (questions || []).map((q) => ({
    q,
    _ts: q && q.timestamp ? parseInt(String(q.timestamp), 10) : 0
  } as { q: RecentSubmission; _ts: number }));

  list.sort((a, b) => (b._ts || 0) - (a._ts || 0));

  for (const item of list) {
    const q = item.q;
    const key = (q && (q.titleSlug || q.title)) || String(item._ts) || String(Math.random());
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(q);
    }
    if (unique.length >= 3) break;
  }

  const displayQuestions = unique;

  if (displayQuestions.length === 0) {
    svg += `
      <text x="0" y="${startY}" class="stat-label">No recent submissions found</text>
    `;
  } else {
    displayQuestions.forEach((question, index) => {
      const rawTitle = question && question.title ? question.title : 'Unknown Title';
      const title = rawTitle.length > 50 ? rawTitle.slice(0, 47) + '...' : rawTitle;
      const difficulty: string = (question as RecentSubmission)?.difficulty ?? 'Easy';
      const difficultyColor = difficultyColors[difficulty as keyof typeof difficultyColors] || `#${theme.iconColor}`;

      let timeAgo = '-';
      if (question && question.timestamp) {
        const ts = parseInt(String(question.timestamp), 10);
        if (!isNaN(ts) && ts > 0) {
          timeAgo = getTimeAgo(new Date(ts * 1000));
        }
      }

      const rowY = startY + index * lineHeight;

      svg += `
        <!-- Row ${index} -->
        <g role="listitem" aria-label="${escapeXml(title)}" >
          <!-- Difficulty indicator dot -->
          <circle cx="${circleCX}" cy="${rowY - 6}" r="6" fill="${difficultyColor}" />

          <!-- Title (truncated server-side) -->
          <text x="${titleX}" y="${rowY}" class="stat" fill="#${theme.textColor}" style="font-size:14px;">
            ${escapeXml(title)}
            <title>${escapeXml(rawTitle)} — ${timeAgo}</title>
          </text>

          <!-- Time ago -->
          <text x="${timeX}" y="${rowY}" class="stat-label" text-anchor="end" fill="#${theme.textColor}" style="font-size:14px;">
            ${timeAgo}
          </text>

          <!-- Difficulty label -->
          <text x="${difficultyX}" y="${rowY}" class="lang-name" text-anchor="end" fill="${difficultyColor}" style="font-size:14px;">
            ${escapeXml(difficulty)}
          </text>
        </g>
      `;
    });
  }

  svg += '</g></g>';
  return svg;
}

function escapeXml(str: string) {
  return String(str).replace(/[&<>"']/g, (s) => {
    switch (s) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return s;
    }
  });
}

/**
 * Helper function for time ago formatting
 * @param date - Date to format
 * @returns Formatted time ago string
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}