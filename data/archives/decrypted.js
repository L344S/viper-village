const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const nonameDirectory = path.resolve(__dirname, "..", "..");

const logDirectory = path.join(nonameDirectory, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFile = path.join(logDirectory, "decryption_log.log");

function logMessage(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `${timestamp} - ${message}\n`);
}

function loadKey(keyPath = "encryption_key.key") {
  try {
    const key = fs.readFileSync(keyPath);
    logMessage(`We have the key !!`);
    return key;
  } catch (e) {
    logMessage(`Error loading key: ${e}`);
    return null;
  }
}

function decryptFile(encryptedFilePath, algorithm, key, iv, destinationFolder) {
  try {
    const encryptedData = fs.readFileSync(encryptedFilePath);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const decryptedFilePath = encryptedFilePath.replace(".encrypted", "");
    const decryptedFileName = path.basename(decryptedFilePath);
    const destinationFilePath = path.join(destinationFolder, decryptedFileName);

    fs.writeFileSync(destinationFilePath, decryptedData);
    fs.unlinkSync(encryptedFilePath);
    logMessage(
      `decrypted and moved: ${encryptedFilePath} > ${destinationFilePath}`
    );
  } catch (e) {
    logMessage(`decryption dont work ${encryptedFilePath}: ${e}`);
  }
}

function decryptFolder(folderPath, destinationFolder, algorithm, key, iv) {
  if (!fs.existsSync(folderPath)) {
    logMessage(`Folder ${folderPath} is not found :(`);
    return;
  }
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (file.endsWith(".encrypted")) {
      decryptFile(filePath, algorithm, key, iv, destinationFolder);
    }
  });
}

const algorithm = "aes-256-cbc";
const keyIv = loadKey();
if (keyIv) {
  const key = keyIv.slice(0, 32);
  const iv = keyIv.slice(32, 48);

  const encryptedFolder = path.join(path.resolve(__dirname), "encrypted");
  const destinationFolder = path.resolve(__dirname);
  decryptFolder(encryptedFolder, destinationFolder, algorithm, key, iv);
  logMessage("Decryption done.");
} else {
  logMessage("Decryption failed.");
}
