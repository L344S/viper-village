from cryptography.fernet import Fernet, InvalidToken
import os


def load_key(key_path='encryption_key.key'):
    try:
        with open(key_path, 'rb') as key_file:
            key = key_file.read()
        print(f"Key loaded successfully from {key_path}")
        return key
    except FileNotFoundError:
        print(f"Key file not found : {key_path}")
    except Exception as e:
        print(f"Error loading key: {e}")
        return None


def decrypt_file(encrypted_file_path, cipher_suite):
    try:
        with open(encrypted_file_path, 'rb') as f:
            encrypted_data = f.read()
        print(f"Read encrypted data from {encrypted_file_path}")

        decrypted_data = cipher_suite.decrypt(encrypted_data)
        decrypted_file_path = encrypted_file_path[:-10]  # remove '.encrypted' suffix
        with open(decrypted_file_path, 'wb') as f:
            f.write(decrypted_data)
        os.remove(encrypted_file_path)
        print(f"Decrypted: {encrypted_file_path} to {decrypted_file_path}")
    except FileNotFoundError:
        print(f"File not found: {encrypted_file_path}")
    except InvalidToken:
        print(f"Invalid token for file: {encrypted_file_path}. Possible key mismatch or file corruption.")
    except Exception as e:
        print(f"Failed to decrypt {encrypted_file_path}: {e}")


def decrypt_folder(folder_path, cipher_suite):
    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            if filename.endswith('.encrypted'):
                encrypted_file_path = os.path.join(dirpath, filename)
                decrypt_file(encrypted_file_path, cipher_suite)


if __name__ == "__main__":
    documents_folder = os.path.expanduser("~/Videos")  # Path to the folder to decrypt

    key = load_key()
    if key:
        cipher_suite = Fernet(key)
        decrypt_folder(documents_folder, cipher_suite)
    else:
        print("Decryption key not loaded. Exiting.")
