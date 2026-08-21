const dns = require("dns").promises;
const https = require("https");

console.log("🔍 MongoDB Connection Diagnostic Test\n");

// Test 1: DNS Resolution
async function testDNS() {
  console.log("1️⃣  Testing DNS Resolution...");
  try {
    const result = await dns.resolveSrv("_mongodb._tcp.cluster0.a7amtcr.mongodb.net");
    console.log("   ✅ DNS SRV resolved:", result);
    return true;
  } catch (error) {
    console.log("   ❌ DNS SRV resolution failed:", error.message);
    console.log("   💡 Possible causes:");
    console.log("      - No internet connection");
    console.log("      - ISP/Firewall blocking DNS queries");
    console.log("      - Cluster name incorrect in connection string");
    return false;
  }
}

// Test 2: Internet Connectivity
function testInternet() {
  console.log("\n2️⃣  Testing Internet Connectivity...");
  return new Promise((resolve) => {
    https
      .get("https://www.google.com", { timeout: 5000 }, () => {
        console.log("   ✅ Internet connection working");
        resolve(true);
      })
      .on("error", (error) => {
        console.log("   ❌ No internet connection:", error.message);
        resolve(false);
      });
  });
}

// Test 3: MongoDB Atlas Availability
async function testMongoDBServer() {
  console.log("\n3️⃣  Testing MongoDB Atlas Server...");
  try {
    // Try to resolve the hostname
    const result = await dns.resolve4("cluster0.a7amtcr.mongodb.net");
    console.log("   ✅ Server resolved to:", result);
    return true;
  } catch (error) {
    console.log("   ❌ Server resolution failed:", error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const dnsOk = await testDNS();
  const internetOk = await testInternet();
  const serverOk = await testMongoDBServer();

  console.log("\n📋 Summary:");
  console.log(`   DNS Resolution: ${dnsOk ? "✅" : "❌"}`);
  console.log(`   Internet: ${internetOk ? "✅" : "❌"}`);
  console.log(`   MongoDB Server: ${serverOk ? "✅" : "❌"}`);

  if (!internetOk) {
    console.log("\n🚨 CRITICAL: No internet connection. Connect to internet and try again.");
  } else if (!dnsOk) {
    console.log("\n🚨 CRITICAL: Cannot resolve MongoDB SRV record.");
    console.log("   Please check:");
    console.log("   - Your ISP might be blocking MongoDB DNS queries");
    console.log("   - Your firewall settings");
    console.log("   - MongoDB Atlas cluster name in .env");
  } else if (!serverOk) {
    console.log("\n⚠️  Server not accessible - check MongoDB Atlas IP whitelist");
  } else {
    console.log("\n✅ All checks passed! Try running: npm run dev");
  }
}

runTests().catch(console.error);
