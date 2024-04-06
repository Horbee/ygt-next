export function getColorByPercentage(normalizedPercentage: number): string {
  // Ensure percentage is within [0, 1]
  normalizedPercentage = Math.min(1, Math.max(0, normalizedPercentage));

  // Define RGB values for orange and green
  const orangeRGB = [255, 165, 0];
  const greenRGB = [0, 128, 0];

  // Interpolate between orange and green based on percentage
  const interpolatedRGB = orangeRGB.map((value, index) => {
    const greenValue = greenRGB[index]!;
    return Math.round(value + (greenValue - value) * normalizedPercentage);
  });

  // Convert RGB values to hexadecimal color code
  const color =
    "#" +
    interpolatedRGB
      .map((component) => {
        const hex = component.toString(16);
        return hex.length === 1 ? "0" + hex : hex; // Ensure two digits
      })
      .join("");

  return color;
}
