function helloWorld() {
  console.log("Hello, World!");
  return "Hello, World!";
}

// Export the function for use in other modules
module.exports = {
  helloWorld
};

// If this file is run directly, execute the hello-world function
if (require.main === module) {
  helloWorld();
}