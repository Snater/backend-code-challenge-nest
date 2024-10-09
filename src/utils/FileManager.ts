import * as path from 'path';

export default class FileManager {
	static readonly ADDRESSES_FILE = path.join(__dirname, '..', '..', 'addresses.json');
	static readonly AREAS_DIR = path.join(__dirname, '..', '..', 'areas');
	static readonly PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
}
