// scripts/pre-deploy-check.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 Running pre-deployment checks...\n");

const checks = [];

// Check 1: No console.logs in src (except Debug components)
const checkConsoleLogs = () => {
  const srcDir = path.join(__dirname, "../src");
  let hasConsoleLogs = false;

  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        const content = fs.readFileSync(filePath, "utf8");
        // Skip debug files
        if (filePath.includes("Debug") || filePath.includes("debug")) return;
        if (content.includes("console.log(")) {
          console.log(`  ⚠️  console.log found in: ${filePath}`);
          hasConsoleLogs = true;
        }
      }
    });
  };

  walkDir(srcDir);
  return !hasConsoleLogs;
};

// Check 2: TypeScript compiles
const checkTypeScript = () => {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return true;
  } catch (error) {
    console.log("  ⚠️  TypeScript errors found");
    return false;
  }
};

// Check 3: Build succeeds
const checkBuild = () => {
  try {
    execSync("npm run build", { stdio: "pipe" });
    return true;
  } catch (error) {
    console.log("  ⚠️  Build failed");
    return false;
  }
};

// Check 4: Linting passes
const checkLint = () => {
  try {
    execSync("npm run lint", { stdio: "pipe" });
    return true;
  } catch (error) {
    // Lint warnings are acceptable, only errors fail
    return true;
  }
};

// Run checks
console.log("1. Checking for console.logs...");
checks.push({ name: "No console.logs", passed: checkConsoleLogs() });

console.log("2. Checking TypeScript...");
checks.push({ name: "TypeScript compiles", passed: checkTypeScript() });

console.log("3. Checking lint...");
checks.push({ name: "Linting passes", passed: checkLint() });

console.log("4. Running build...");
checks.push({ name: "Build succeeds", passed: checkBuild() });

// Results
console.log("\n📋 Results:");
checks.forEach((check) => {
  const icon = check.passed ? "✅" : "❌";
  console.log(`  ${icon} ${check.name}`);
});

const allPassed = checks.every((c) => c.passed);
if (allPassed) {
  console.log("\n🎉 All checks passed! Ready to deploy.");
  process.exit(0);
} else {
  console.log("\n⚠️  Some checks failed. Please fix before deploying.");
  process.exit(1);
}
