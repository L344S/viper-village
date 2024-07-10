import os
import logging
import shutil
from cryptography.fernet import Fernet, InvalidToken

# get the path of the 'noname' directory from this file
noname_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# get the path of the 'logs' directory and create it if it doesn't exist
log_directory = os.path.join(noname_directory, 'logs')
if not os.path.exists(log_directory):
    os.makedirs(log_directory)
log_file = os.path.join(log_directory, 'decryption_log.log')

# Configure a logging system to keep track of the decryption process
logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_key(key_path='encryption_key.key'):
    try:
        # get the key from key file and throw an error if not found
        with open(key_path, 'rb') as key_file:
            key = key_file.read()
        logging.info(f"Key successfully loaded from {key_path}")
        return key
    except FileNotFoundError:
        logging.error(f"Key file not found: {key_path}")
    except Exception as e:
        logging.error(f"Error loading key: {e}")
        return None

def decrypt_file(encrypted_file_path, cipher_suite, destination_folder):
    try:
        # read the encrypted file and decrypt it
        with open(encrypted_file_path, 'rb') as f:
            encrypted_data = f.read()
        decrypted_data = cipher_suite.decrypt(encrypted_data)
        decrypted_file_path = encrypted_file_path.rsplit('.encrypted', 1)[0]
        decrypted_file_name = os.path.basename(decrypted_file_path)
        destination_file_path = os.path.join(destination_folder, decrypted_file_name)

        with open(destination_file_path, 'wb') as f:
            f.write(decrypted_data)
        os.remove(encrypted_file_path)
        logging.info(f"Decrypted and moved: {encrypted_file_path} to {destination_file_path}")
    except FileNotFoundError:
        logging.error(f"File not found: {encrypted_file_path}")
    except InvalidToken:
        logging.error(f"Invalid token for file: {encrypted_file_path}. Wrong key or corrupted file.")
    except Exception as e:
        logging.error(f"Decryption failed for {encrypted_file_path}: {e}")

def decrypt_folder(folder_path, destination_folder, cipher_suite):
    for dirpath, _, filenames in os.walk(folder_path):
        # decrypt all files in the folder
        for filename in filenames:
            if filename.endswith('.encrypted'):
                encrypted_file_path = os.path.join(dirpath, filename)
                decrypt_file(encrypted_file_path, cipher_suite, destination_folder)

if __name__ == "__main__":
    # get the path of the 'encrypted' folder and the 'Downloads' folder
    encrypted_folder = os.path.join(os.path.expanduser('~'), 'Downloads', 'encrypted')
    downloads_folder = os.path.join(os.path.expanduser('~'), 'Downloads')
    # load the key and decrypt the files
    key = load_key()
    if key:
        cipher_suite = Fernet(key)
        decrypt_folder(encrypted_folder, downloads_folder, cipher_suite)
        # shutil.rmtree(encrypted_folder)
        logging.info("Encrypted folder deleted.")
    else:
        logging.error("Decryption key not loaded. Stopping.")