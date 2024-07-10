function generateKey() {
  return crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

function encryptData(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  return crypto.subtle
    .encrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      key,
      new TextEncoder().encode(data)
    )
    .then((encrypted) => {
      return { encrypted, iv };
    });
}

function decryptData(encryptedData, key, iv) {
  return crypto.subtle
    .decrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      key,
      encryptedData
    )
    .then((decrypted) => {
      return new TextDecoder().decode(decrypted);
    });
}

function saveToFile(data, filename) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function encryptFiles() {
  const filesToEncrypt = [
    "src/js/scenes/tower-scene.js", // test
  ];

  generateKey().then((key) => {
    filesToEncrypt.forEach((filePath) => {
      fetch(filePath)
        .then((response) => response.text())
        .then((data) => {
          encryptData(data, key).then(({ encrypted, iv }) => {
            const encryptedFile = new Uint8Array(encrypted);
            const ivArray = new Uint8Array(iv);
            const combinedData = new Uint8Array(
              ivArray.length + encryptedFile.length
            );
            combinedData.set(ivArray);
            combinedData.set(encryptedFile, ivArray.length);
            saveToFile(combinedData, `${filePath}.encrypted`);
          });
        });
    });
  });
}
