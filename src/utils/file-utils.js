import fs from "fs";

class FileUtils {
    _makeDir(dir) {
        try {
            fs.mkdirSync(dir);
        } catch(error) {
            if (error.code !== "EEXIST") {
                console.log(error);
            }
        }
    }

    write(dir, filename, content = "") {
        this._makeDir(dir);
        fs.appendFileSync(`${dir}/${filename}`, content, (error) => {
            if (error) {
                throw error;
            }
        });
    }
}

export default new FileUtils();