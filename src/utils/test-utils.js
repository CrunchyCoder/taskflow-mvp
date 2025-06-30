import { generateId, formatTime, calculateTotalTime } from './utils/helpers';

// Test the functions
console.log("Testing utilities...");

// Test ID generation
const id1 = generateId();
const id2 = generateId();
console.log("Generated IDs:", id1, id2);
console.log("IDs are different:", id1 !== id2);

// Test time formatting
console.log("30 minutes:", formatTime(30));
console.log("90 minutes:", formatTime(90));
console.log("125 minutes:", formatTime(125));

// Test total time calculation
const testTasks = [
  { estimatedTime: 30 },
  { estimatedTime: 60 },
  { estimatedTime: 15 }
];
console.log("Total time:", formatTime(calculateTotalTime(testTasks)));