/**
 * Computes age in total months from a birth date to today.
 * Day component is ignored — month+year precision only.
 */
export function computeAgeInMonths(birthDate: Date): number {
  const now = new Date();
  return (
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth())
  );
}
