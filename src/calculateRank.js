/**
 * Calculates the exponential cdf.
 *
 * @param {number} x The value.
 * @returns {number} The exponential cdf.
 */
function exponential_cdf(x) {
  return 1 - 2 ** -x;
}

/**
 * Calculates the log normal cdf.
 *
 * @param {number} x The value.
 * @returns {number} The log normal cdf.
 */
function log_normal_cdf(x) {
  // approximation
  return x / (1 + x);
}

/**
 * Calculates the users rank using enterprise-focused collaboration metrics.
 * Optimized for corporate development workflows with squash merges.
 * Focuses on teamwork, code quality, and feature delivery rather than popularity.
 *
 * @param {object} params Parameters on which the user's rank depends.
 * @param {boolean} params.all_commits Whether `include_all_commits` was used (unused in enterprise ranking).
 * @param {number} params.commits Number of commits (unused - irrelevant for squash merge workflows).
 * @param {number} params.prs The number of pull requests (features delivered).
 * @param {number} params.issues The number of issues (unused - not relevant for collaboration ranking).
 * @param {number} params.reviews The number of reviews (primary indicator of code quality engagement).
 * @param {number} params.repos Total number of repos (unused).
 * @param {number} params.stars The number of stars (unused - removed popularity metrics).
 * @param {number} params.followers The number of followers (unused - removed popularity metrics).
 * @returns {{level: string, percentile: number}}} The users rank based on collaboration metrics.
 */
function calculateRank({
  all_commits, // unused in enterprise ranking
  commits, // unused - irrelevant for squash merge workflows
  prs, // features/changes delivered to production
  issues, // unused - not relevant for collaboration focus
  reviews, // primary collaboration metric - code quality engagement
  // eslint-disable-next-line no-unused-vars
  repos, // unused
  // eslint-disable-next-line no-unused-vars
  stars, // removed - popularity metric not relevant for corporate development
  // eslint-disable-next-line no-unused-vars
  followers, // removed - popularity metric not relevant for corporate development
}) {
  // Enterprise collaboration ranking weights
  // Focuses on actual work delivery and team engagement
  const PRS_MEDIAN = 50,
    PRS_WEIGHT = 3; // Features/changes delivered
  const REVIEWS_MEDIAN = 2,
    REVIEWS_WEIGHT = 4; // Code quality engagement (highest weight)

  // Combined collaboration metric rewards active team participation
  const COLLABORATION_WEIGHT = 2; // Reviews + PRs = total team engagement

  const TOTAL_WEIGHT =
    PRS_WEIGHT +
    REVIEWS_WEIGHT +
    COLLABORATION_WEIGHT; // Total: 9 (pure collaboration focus)

  // Ranking thresholds and levels (unchanged)
  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];

  // Calculate enterprise collaboration score
  // Combines reviews (quality) + PRs (delivery) for total team engagement
  const collaborationScore = reviews + prs;
  
  // Enterprise ranking calculation
  // 100% based on collaboration metrics - no popularity or vanity metrics
  const rank =
    1 -
    (PRS_WEIGHT * exponential_cdf(prs / PRS_MEDIAN) + // 33% - Feature delivery
      REVIEWS_WEIGHT * exponential_cdf(reviews / REVIEWS_MEDIAN) + // 44% - Code quality
      COLLABORATION_WEIGHT * exponential_cdf(collaborationScore / 100)) / // 22% - Team engagement
      TOTAL_WEIGHT;

  const level = LEVELS[THRESHOLDS.findIndex((t) => rank * 100 <= t)];

  return { level, percentile: rank * 100 };
}

export { calculateRank };
export default calculateRank;
