#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 CHEEMA PROPERTIES - Preparing for deployment...\n');

// Check if all required files exist
const requiredFiles = [
  'index.html',
  'App.tsx',
  'index.tsx',
  'styles/globals.css',
  'package.json'
];

let allFilesPresent = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesPresent = false;
  }
});

if (allFilesPresent) {
  console.log('\n🎉 All files ready for deployment!');
  console.log('\n📋 DEPLOYMENT CHECKLIST:');
  console.log('1. ✅ Project files ready');
  console.log('2. ⏳ Upload to Netlify, Vercel, or GitHub Pages');
  console.log('3. ⏳ Configure custom domain (optional)');
  console.log('4. ⏳ Submit to Google Search Console');
  console.log('5. ⏳ Create Google My Business profile');
  
  console.log('\n🌐 FASTEST DEPLOYMENT OPTIONS:');
  console.log('• Netlify: https://netlify.com (Drag & drop)');
  console.log('• Vercel: https://vercel.com (30 seconds)');
  console.log('• GitHub Pages: https://github.com (Free forever)');
  
  console.log('\n📞 CHEEMA PROPERTIES Contact Info:');
  console.log('• Phone: +91 9056330000 / +91 9056361000');
  console.log('• Email: balvircheema2016@gmail.com');
  console.log('• Admin Password: jacob');
  
  console.log('\n🎯 Follow DEPLOY_NOW.md for step-by-step instructions!');
} else {
  console.log('\n❌ Some files are missing. Please ensure all project files are present.');
}