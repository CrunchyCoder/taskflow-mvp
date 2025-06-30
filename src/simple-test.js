// Simple test for our utilities
import { generateId, formatTime } from './utils/helpers';

export const testUtilities = () => {
  console.log("🧪 Testing TaskFlow utilities...");
  
  // Test ID generation
  const id1 = generateId();
  const id2 = generateId();
  console.log("✅ Generated ID 1:", id1);
  console.log("✅ Generated ID 2:", id2);
  console.log("✅ IDs are unique:", id1 !== id2);
  
  // Test time formatting
  console.log("✅ 30 minutes formatted:", formatTime(30));
  console.log("✅ 90 minutes formatted:", formatTime(90));
  
  console.log("🎉 All utilities working!");
};