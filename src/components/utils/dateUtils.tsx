export class DateUtils {


  /**
   * Returns a human-readable duration between now and the target date.
   * @param targetDate The future target date.
   * @returns A string like "4 days, 3 hours" or "Expired".
   */
  public static getReadableDuration(targetDate: Date): string {
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      return "Expired";
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const remainingHours = diffHours % 24;
    const remainingMinutes = diffMinutes % 60;

    const parts = [];
    if (diffDays > 0) parts.push(`${diffDays} day${diffDays > 1 ? "s" : ""}`);
    if (remainingHours > 0) parts.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);

    return parts.join(", ");
  }

  /**
   * Returns a human-readable duration between now and the target date.
   * Adjusts the output to eliminate unnecessary small units.
   * @param targetDate The future target date.
   * @returns A string like "4 days", "3 hours", "2 days, 3 hours", or "Expired".
   */
  public static getReadableDurationTrimmed(targetDate: Date): string {
    const now = new Date();
    let diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      diffMs = -diffMs;
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const remainingHours = diffHours % 24;
    const remainingMinutes = diffMinutes % 60;

    const parts = [];

    // If we are over 24 hours, only show the days
    if (diffDays > 0) {
      parts.push(`${diffDays} day${diffDays > 1 ? "s" : ""}`);
    }

    // If within a single day, show hours only if they're significant (at least 1 hour)
    if (diffDays === 0 && remainingHours > 0) {
      parts.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
    }

    // Only show minutes if we're less than a day away, and if it's meaningful
    if (diffDays === 0 && (remainingMinutes > 0 || (remainingHours > 0 && remainingMinutes > 5))) {
      parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);
    }

    // If under 1 minute, show it as "1 minute"
    if (remainingMinutes === 0 && remainingHours === 0 && diffMs > 0) {
      parts.push("1 minute");
    }

    return parts.join(", ");
  }

  public static formatTimeDifference( targetDate: Date ): string {

    const now = new Date();
    let ms = targetDate.getTime() - now.getTime();

    if (ms <= 0) {
      ms = -ms;
    }

    // Handle days
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    ms -= days * (1000 * 60 * 60 * 24);

    // Handle hours
    const hours = Math.floor(ms / (1000 * 60 * 60));
    ms -= hours * (1000 * 60 * 60);

    // Handle minutes
    const minutes = Math.floor(ms / (1000 * 60));
    ms -= minutes * (1000 * 60);

    // Handle seconds
    const seconds = Math.floor(ms / 1000);

    let result = '';

    // Include the smallest non-zero unit below the largest
    if (days > 0) result = `${days}d, ${hours}h`;
    else if (hours > 0) result = `${hours}h, ${minutes}m`;
    else if (minutes > 0) result = `${minutes}m, ${seconds}s`;

    return result.trim();

  }

  /**
   * Formats a date to a human-readable string.
   * @param date The date to format.
   * @param locale The locale string (default is "en-GB").
   * @returns The formatted date string.
   */
  public static simpleFormatDate(date: Date, locale: string = "en-GB"): string {
    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Checks if a given date is in the past.
   * @param date The date to check.
   * @returns True if the date is in the past, false otherwise.
   */
  public static isPast(date: Date): boolean {

    const now = new Date();
    const isInPast = date < now;
    return isInPast;
  }

  /**
   * Adds a specified number of days to a date.
   * @param date The starting date.
   * @param days The number of days to add.
   * @returns A new Date object with the added days.
   */
  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
